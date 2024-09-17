from collections import Counter
from datetime import timedelta
import json
import os
from pathlib import Path
from fastapi import BackgroundTasks, status
from fastapi.responses import FileResponse, JSONResponse
from helpers.analyticsHelpers import (
    filters_datasets_by_region,
    frequent_words,
    word_cloud,
)
from controllers.pointControllers import fetch_points, fetch_points_by_disease
from helpers.miscHelpers import get_ph_datetime
from config.database import dataset_collection


from dotenv import load_dotenv

load_dotenv()


"""
@desc     Generate disease data
route     GET api/suspected-symptoms
@access   Private
"""


async def generate_suspected_symptom():
    # Fetch points by disease
    points = await fetch_points_by_disease()

    # Convert to JSON object
    points = json.loads(points.body.decode(encoding="utf-8"))

    # Get count for each disease
    suspected_symptoms = {
        "total": {"count": points["count"]["total"], "regions_located": []},
        "TB": {"count": points["count"]["TB"], "regions_located": []},
        "PN": {"count": points["count"]["PN"], "regions_located": []},
        "AURI": {"count": points["count"]["AURI"], "regions_located": []},
        "COVID": {"count": points["count"]["COVID"], "regions_located": []},
    }

    # Get the region where each disease are located
    for region in points["data"]:
        region_annotations = region["annotations"]
        for annotation in region_annotations:
            suspected_symptoms[annotation]["regions_located"].append(region["region"])

        if "X" not in region_annotations or len(region_annotations) != 0:
            suspected_symptoms["total"]["regions_located"].append(region["region"])

    return suspected_symptoms


"""
@desc     Generate list of frequent words in posts by region
route     GET api/frequent-words
@access   Private
"""


async def generate_frequent_words(filters: str = "all"):
    # Get date nd time _ days before current Philippine date and time
    start_date = get_ph_datetime() - timedelta(days=int(os.getenv("TIMEDELTA_DAYS")))

    # Fetch annotated datasets within the start date
    datasets = dataset_collection.find(
        {"created_at": {"$gte": start_date}, "dataset_type": "ANNOTATED"},
        {"filename": 1},
    )

    # Get filename of each of the datasets
    valid_datasets = [dataset["filename"] for dataset in datasets]

    # Get all the posts from these annotated datasets
    all_posts = filters_datasets_by_region(region=filters, datasets=valid_datasets)

    # Get frequent words data
    frequent_words_dict = frequent_words(data=all_posts)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"frequent_words": frequent_words_dict},
    )


"""
@desc     Generate percentage of annotations by disease
route     GET api/percentage
@access   Private
"""


async def generate_percentage():
    # Fetch points
    points = await fetch_points()

    # Convert to JSON object
    points = json.loads(points.body.decode(encoding="utf-8"))

    # Initialize response data
    percentage_result = {
        "NCR": [],
        "I": [],
        "II": [],
        "III": [],
        "CAR": [],
        "IVA": [],
        "IVB": [],
        "V": [],
        "VI": [],
        "VII": [],
        "VIII": [],
        "IX": [],
        "X": [],
        "XI": [],
        "XII": [],
        "XIII": [],
        "BARMM": [],
    }

    # Initialize disease count
    all_counts = {"TB": 0, "PN": 0, "AURI": 0, "COVID": 0}

    # Iterate over each region
    for region in list(percentage_result.keys()):
        # Get all points for the specific region
        regional_points = [point for point in points if point["region"] == region]

        annotations_count = Counter()

        # Iterate over each points, and add annotations count
        for r_p in regional_points:
            annotations_count.update(r_p["annotations_count"])

        # Convert to dictionary
        annotations_count = dict(annotations_count)

        # Get count of each disease if available, else
        tb_count = annotations_count["TB"] if "TB" in annotations_count else 0
        pn_count = annotations_count["PN"] if "PN" in annotations_count else 0
        auri_count = annotations_count["AURI"] if "AURI" in annotations_count else 0
        covid_count = annotations_count["COVID"] if "COVID" in annotations_count else 0

        result = [
            {"label": "PTB", "name": "PTB", "count": tb_count},
            {"label": "Pneumonia", "name": "Pneumonia", "count": pn_count},
            {
                "label": "AURI",
                "name": "AURI",
                "count": (auri_count),
            },
            {
                "label": "COVID",
                "name": "COVID",
                "count": (covid_count),
            },
        ]
        
        # Get the total counts for each disease
        all_counts["TB"] += tb_count
        all_counts["PN"] += pn_count
        all_counts["AURI"] += auri_count
        all_counts["COVID"] += covid_count

        percentage_result[region] = result

    percentage_result["all"] = [
        {
            "label": "PTB",
            "name": "PTB",
            "count": all_counts["TB"],
        },
        {"label": "Pneumonia", "name": "Pneumonia", "count": all_counts["PN"]},
        {
            "label": "AURI",
            "name": "AURI",
            "count": (all_counts["AURI"]),
        },
        {
            "label": "COVID",
            "name": "COVID",
            "count": (all_counts["COVID"]),
        },
    ]

    return JSONResponse(status_code=status.HTTP_200_OK, content=percentage_result)


"""
@desc     Generate wordcloud by region
route     GET api/wordcloud/filters=
@access   Private
"""


async def generate_wordcloud(background_tasks: BackgroundTasks, filters: str = "all"):
    # Get date nd time _ days before current Philippine date and time
    start_date = get_ph_datetime() - timedelta(days=int(os.getenv("TIMEDELTA_DAYS")))

    # Fetch annotated datasets within the start date
    datasets = dataset_collection.find(
        {"created_at": {"$gte": start_date}, "dataset_type": "ANNOTATED"},
        {"filename": 1},
    )

    # Get filename of each of the datasets
    valid_datasets = [dataset["filename"] for dataset in datasets]

    # Get all the posts from these annotated datasets
    all_posts = filters_datasets_by_region(region=filters, datasets=valid_datasets)

    # Define word cloud folder in server
    wordcloud_folder = Path("public/images/wordcloud")

    # Create wordcloud folder if it does not exists
    os.makedirs(wordcloud_folder, exist_ok=True)
    
    # Set full path of word cloud image
    full_path = wordcloud_folder / f"wordcloud-{filters}.png"
    
    # Check if there are valid datasets
    if len(valid_datasets) > 0:
        # Check if word cloud already exists.
        # If it exists, run the word cloud generator in background
        # If not, run and wait for word cloud generator
        if os.path.exists(full_path):
            background_tasks.add_task(word_cloud, all_posts, full_path)

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=f"Wordcloud generated for region: {filters}",
            )
        else:
            word_cloud(all_posts, full_path)

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=f"Wordcloud generated for region: {filters}",
            )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=f"No datasets.",
    )


"""
@desc     Fetch wordcloud image by region
route     GET api/percentage/{filters}
@access   Private
"""


async def fetch_wordcloud(filters: str = "all"):
    # Define word cloud folder
    wordcloud_folder = Path("public/images/wordcloud")

    # Set filename of word cloud image
    filename = f"wordcloud-{filters}.png"

    # Set full path of word cloud image
    full_path = wordcloud_folder / filename

    # If it exists, return word cloud image file
    if os.path.exists(full_path):
        return FileResponse(full_path)
    else:
        return "#"
