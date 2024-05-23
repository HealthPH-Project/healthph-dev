from fastapi import Response, status
from fastapi.responses import JSONResponse, StreamingResponse
from matplotlib.pylab import det
from numpy import full
import pandas as pd
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


async def generate_wordcloud(filters: str = "all"):
    if filters != "all":
        raw = pd.read_csv("assets/data/cleaned_envi.csv")
    else:
        raw = pd.read_csv("assets/data/annotated_data.csv")

    data = clean_dataframe(raw)

    buffer = word_cloud(data)

    return Response(
        content=buffer,
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=wordcloud.png"},
    )
