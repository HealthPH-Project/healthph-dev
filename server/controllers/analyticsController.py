import os
from pathlib import Path
from fastapi import BackgroundTasks, Response, status
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from matplotlib.pylab import det
from numpy import full
import pandas as pd
from wordcloud import WordCloud
from helpers.analyticsHelpers import clean_dataframe, frequent_words, word_cloud


async def generate_frequent_words(filters: str = "all"):
    if filters != "all":
        raw = pd.read_csv("assets/data/cleaned_envi.csv")
    else:
        raw = pd.read_csv("assets/data/annotated_data.csv")

    data = clean_dataframe(raw)

    freq_words = frequent_words(data).to_dict(orient="records")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"frequent_words": freq_words},
    )


async def generate_percentage(filters: str = "all"):
    if filters != "all":
        result = [
            {"label": "Tubercolosis", "name": "Tubercolosis", "count": 114},
            {"label": "Pneumonia", "name": "Pneumonia", "count": 202},
            {"label": "COVID", "name": "COVID", "count": 285},
            {"label": "AURI", "name": "AURI", "count": 170},
        ]
    else:
        result = [
            {"label": "Tubercolosis", "name": "Tubercolosis", "count": 623},
            {"label": "Pneumonia", "name": "Pneumonia", "count": 438},
            {"label": "COVID", "name": "COVID", "count": 733},
            {"label": "AURI", "name": "AURI", "count": 567},
        ]

    return JSONResponse(status_code=status.HTTP_200_OK, content=result)


async def generate_wordcloud(background_tasks: BackgroundTasks, filters: str = "all"):
    if filters != "all":
        raw = pd.read_csv("assets/data/cleaned_envi.csv")
    else:
        raw = pd.read_csv("assets/data/annotated_data.csv")

    data = clean_dataframe(raw)

    # Folder to store all wordcloud images
    wordcloud_folder = Path("public/images/wordcloud")

    # Create wordcloud folder if it does not exists
    os.makedirs(wordcloud_folder, exist_ok=True)

    # Set filename for wordcloud image
    filename = f"wordcloud-{filters}.png"

    full_path = wordcloud_folder / filename

    # Check if wordcloud for a specific already exists
    if not os.path.exists(full_path):
        # If it does not exists, generate first the wordcloud image
        wordcloud = word_cloud(data, full_path)

        # Then, return a url path to retrieve the generated wordcloud image
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"wordcloud_url": f"/wordcloud/{filters}"},
        )
    else:
        # If it already exists, run the wordcloud generator in the background
        background_tasks.add_task(word_cloud, data, full_path)

        # Then, return a url path to retrieve the generated wordcloud image
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"wordcloud_url": f"/wordcloud/{filters}"},
        )

    buffer = word_cloud(data)

    return Response(
        content=buffer,
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=wordcloud.png"},
    )


async def fetch_wordcloud(filters: str = "all"):
    wordcloud_folder = Path("public/images/wordcloud")

    filename = f"wordcloud-{filters}.png"

    full_path = wordcloud_folder / filename

    return FileResponse(full_path)
