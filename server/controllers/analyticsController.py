from fastapi import Response, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse

import pandas as pd
from io import BytesIO
from helpers.analyticsHelpers import clean_dataframe, frequent_words, word_cloud


async def upload_dataset(file: UploadFile):
    # contents = await file.read()
    #  Validate file type
    f = file
    # text/csv
    # File size = f.size
    if f.content_type != "text/csv":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid File Type. Must be a .csv file",
        )
    print(f)
    print(f.size)
    print(type(f.content_type))
    x = await f.read()
    tb_keys_df = pd.read_csv(BytesIO(x))

    tb_keys = tb_keys_df.iloc[:, 0].tolist()
    print(tb_keys)
    return {"file": f}


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
