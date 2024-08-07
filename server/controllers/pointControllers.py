from collections import Counter
from datetime import timedelta
import os
import json
import shutil
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
import pandas as pd
from pathlib import Path
from bson import ObjectId

from config.database import dataset_collection, point_collection
from helpers.miscHelpers import get_ph_datetime
from helpers.pointHelpers import check_unique_location
from schema.pointSchema import list_points

seed_folder = Path("assets/data/seed")

annotated_datasets_folder = Path("public/annotated_datasets")

"""
@desc     Seed points
route     POST api/points/seed-points
@access   Private
"""


async def seed_points():
    annotated_datasets = ["annotated_data.csv", "annotated_data_2.csv"]

    annotated_datasets_final = []

    os.makedirs(annotated_datasets_folder, exist_ok=True)

    user_id = str(ObjectId())

    for annotated_dataset in annotated_datasets:
        annotated_dataset_path = seed_folder / annotated_dataset

        original_filename = annotated_dataset

        filename = (
            f"{(round(get_ph_datetime().timestamp() * 1000))}-{original_filename}"
        )

        shutil.copy(annotated_dataset_path, annotated_datasets_folder / filename)

        annotated_datasets_final.append(filename)

        file_size = os.stat(annotated_dataset_path).st_size

        num_of_rows = len(pd.read_csv(annotated_dataset_path))

        csv_headers = ["posts", "filtered_location", "annotations"]

        preview_headers = "+".join(csv_headers)

        preview_data = pd.read_csv(
            (annotated_dataset_path), nrows=3, usecols=csv_headers
        ).to_json(orient="records")

        to_encode = dict(
            {
                "user_id": user_id,
                "user_name": "HealthPH",
                "original_filename": original_filename,
                "filename": filename,
                "file_size": file_size,
                "num_of_rows": num_of_rows,
                "preview_headers": str(preview_headers),
                "preview_data": json.dumps(preview_data),
                "dataset_type": "ANNOTATED",
                "created_at": get_ph_datetime(),
            }
        )

        new_dataset = dataset_collection.insert_one(dict(to_encode))

        if not new_dataset:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to seed",
            )

    for annotated_dataset in annotated_datasets_final:
        await create_points(annotated_dataset)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Points seeded successfully"},
    )


async def create_points(annotated_filename):
    """
    OUTPUT

    [
        {
            "PH_code": <PH_code>,
            "region": <region>,
            "province": <province>,
            "lat": <lat>,
            "long": <long>,
            "annotations": <annotations>,
            "annotations_count": {
                "TB": <counts>,
                "PN": <counts>,
                "AURI": <counts>,
                "COVID": <counts>
            },
            "keywords": [
                {"key": <key>, "count": <keyword_counts>, "annotation": <keyword_annotation>},
                {"key": <key>, "count": <keyword_counts>, "annotation": <keyword_annotation>}
            ],
            "dataset_source": <dataset_source>
        },
        ...
    ]
    """

    annotated_file_path = annotated_datasets_folder / annotated_filename

    # Convert to csv file to Dataframe
    annotated_df = pd.read_csv(annotated_file_path)

    # Convert Dataframe to dict
    annotated_dict: dict = annotated_df.to_dict("records")

    # Initialize list to be inserted to database
    to_encode_dict = []

    # Iterate over the annotated dataset
    for a_d in annotated_dict:
        # Retrieve values from the each record from the annotated dataset
        PH_code = a_d["PH_code"]
        region = a_d["region"]
        province = a_d["province"]
        lat = a_d["lat"]
        long = a_d["long"]
        annotations = str.split(a_d["annotations"], sep=",")
        extracted_word = a_d["extracted_words"]

        # Check if there are records in the <to_encode_dict'> with the same [PH_code, lat, long]
        # If it already exists, return the index, else return -1
        record_index = next(
            (
                i
                for (i, d) in enumerate(to_encode_dict)
                if check_unique_location(d, a_d)
            ),
            -1,
        )

        # If the record exists, update the data
        if record_index >= 0:

            existing_record = to_encode_dict[record_index]

            """
            ANNOTATIONS
            """

            # Get the existing annotations from existing record
            existing_annotations = existing_record["annotations"]
            # Merged the existing annotations and the new annotations, preventing duplicates
            merged_annotations = list(set(annotations).union(set(existing_annotations)))
            # Update the existing annotations with the new merged annotations
            to_encode_dict[record_index]["annotations"] = merged_annotations

            """
            ANNOTATIONS COUNT
            """

            # Get the existing annotations count from existing record
            annotations_count = existing_record["annotations_count"]
            # Iterate over the new annotations
            for annotation in annotations:
                # If the annotation, already exists as a key in the annotations_count
                # Add 1 to the value, else, add new key-value pair with value of 1
                annotations_count[annotation] = annotations_count.get(annotation, 0) + 1
            # Update the existing annotations count with the new annotations count
            to_encode_dict[record_index]["annotations_count"] = annotations_count

            """
            KEYWORDS
            """

            # Get the existing list of keywords from existing record
            existing_keywords: list = existing_record["keywords"]

            # Check if the extracted word is already in the existing keywords
            # If it already exists, return the index, else return -1
            keyword_index = next(
                (
                    i
                    for (i, keyword) in enumerate(existing_keywords)
                    if keyword["key"] == extracted_word
                ),
                -1,
            )

            # If the keyword exists, add 1 to count.
            # Merged the annotations for that specific keyword
            if keyword_index >= 0:
                # Get the existing and matching keyword
                matching_keyword = existing_keywords[keyword_index]

                """
                KEYWORD COUNT
                """

                # Add 1 to count
                matching_keyword["count"] = matching_keyword["count"] + 1

                """
                KEYWORD ANNOTATIONS
                """

                # Get the annotations from the matching keyword
                matching_keyword_annotations = matching_keyword["annotation"]
                # Merged the existing annotations from the matching keyword and new annotations, preventing duplicates
                merged_matching_keyword_annotations = list(
                    set(annotations).union(set(matching_keyword_annotations))
                )
                # Updated the annotations of the matching keyword with the merged annotations
                matching_keyword["annotation"] = merged_matching_keyword_annotations

                # Update the matching keyword
                existing_keywords[keyword_index] = matching_keyword
            else:  # If the keyword does not exist,
                # Add new keyword to existing keyword with count of 1
                existing_keywords.append(
                    {"key": extracted_word, "count": 1, "annotation": annotations}
                )

            # Update the existing record keywords with the new keywords list
            to_encode_dict[record_index]["keywords"] = existing_keywords

        else:  # If the record does not exist, append new record to the <to_encode_list>
            to_encode_dict.append(
                {
                    "PH_code": PH_code,
                    "region": region,
                    "province": province,
                    "lat": lat,
                    "long": long,
                    "annotations": annotations,
                    "annotations_count": {a: 1 for a in annotations},
                    "keywords": [
                        {"key": extracted_word, "count": 1, "annotation": annotations}
                    ],
                    "dataset_source": f"{annotated_filename}",
                }
            )

    new_points = point_collection.insert_many(to_encode_dict)

    if not new_points:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to seed",
        )

    return "Success points"


"""
@desc     Fetch points
route     POST api/points/fetch-points
@access   Private
"""

async def fetch_points():
    """
    OUTPUT

    [
        {
            "PH_code": <PH_code>,
            "region": <region>,
            "province": <province>,
            "lat": <lat>,
            "long": <long>,
            "annotations": <combined_annotations>,
            "annotations_count": {
                "TB": <combined_counts>,
                "PN": <combined_counts>,
                "AURI": <combined_counts>,
                "COVID": <combined_counts>
            },
            "keywords": [
                {"key": <key>, "count": <combined_keyword_counts>, "annotation": <combined_keyword_annotation>},
                {"key": <key>, "count": <combined_keyword_counts>, "annotation": <combined_keyword_annotation>}
            ]
        },
        ...
    ]
    """
    
    
    start_date = get_ph_datetime() - timedelta(days=7)

    datasets = dataset_collection.find(
        {"created_at": {"$gte": start_date}}, {"filename": 1}
    )

    valid_datasets = [dataset["filename"] for dataset in datasets]

    points_data = point_collection.find(
        {"dataset_source": {"$in": valid_datasets}}
    )

    points = list_points(points_data)
    
    # Initialize empty dictionary to store combined data
    result = {}

    # Iterate over each point in points
    for point in points:
        # Create a unique key based on [PH_code, lat, long]
        unique_key = (point["PH_code"], point["lat"], point["long"])

        # Check if unique_key exists in result
        # If it does not exists create new key-value pair with the unique_key
        if unique_key not in result:
            result[unique_key] = {
                "PH_code": point["PH_code"],
                "region": point["region"],
                "province": point["province"],
                "lat": point["lat"],
                "long": point["long"],
                "annotations": point["annotations"],
                "annotations_count": point["annotations_count"],
                "keywords": [],
            }
        else:  # If it already exists,
            # Get existing record from result
            existing_record = result[unique_key]

            """
            ANNOTATIONS
            """

            # Get existing annotations from existing record
            existing_annotations: list = existing_record["annotations"]
            # Merged the existing annotations and new annotations, preventing duplicates
            merged_annotations = list(set(existing_annotations + point["annotations"]))
            # Update the existing record annotations with the new merged annotations
            result[unique_key]["annotations"] = merged_annotations

            """
            ANNOTATIONS COUNT
            """

            # Initialize Counter to combine counts
            new_annotations_count = Counter()
            # Update the counter with the existing annotations count and new annotations count
            new_annotations_count.update(existing_record["annotations_count"])
            new_annotations_count.update(point["annotations_count"])
            # Update the existing record annotations_count with the new annotations count
            result[unique_key]["annotations_count"] = dict(new_annotations_count)

        """
        KEYWORDS 
        """

        # Iterate over keywords of point
        for point_keyword in point["keywords"]:
            found = False

            # Iterate over existing keywords
            for existing_keyword in result[unique_key]["keywords"]:
                # Check if keyword already exists
                if point_keyword["key"] == existing_keyword["key"]:
                    # If it exists, add the count values
                    existing_keyword["count"] += point_keyword["count"]
                    # Get the annotation of the existing keyword
                    existing_keyword_annotation: list = existing_keyword["annotation"]
                    # Merge the existing keyword annotation and new keyword annotations, preventing duplicates
                    merged_keyword_annotations = list(
                        set(existing_keyword_annotation + point_keyword["annotation"])
                    )
                    # Update existing keyword annotations with the merged annotations
                    existing_keyword["annotation"] = merged_keyword_annotations
                    # If match is found, exit loop
                    found = True
                    break
            if not found:  # If point_keyword does not exists, add to existing keywords
                result[unique_key]["keywords"].append(point_keyword)

    # Return result as a list of dictionaries
    return list(result.values())


def delete_point(dataset_src):
    deleted_points = point_collection.delete_many({"dataset_source": dataset_src})

    if not deleted_points:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting points...",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "All points deleted successfully"},
    )


"""
@desc     Seed points
route     DELETE api/points/all
@access   Private
"""


async def delete_all_points():
    deleted_points = point_collection.delete_many({})

    if not deleted_points:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting points...",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "All points deleted successfully"},
    )
