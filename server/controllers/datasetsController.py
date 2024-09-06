from datetime import datetime
import json
import os
from pathlib import Path
import shutil
import time
from numpy import full
import pymongo
from typing_extensions import Annotated
import pandas as pd

from bson import ObjectId
from fastapi import BackgroundTasks, Depends, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse

from config.database import user_collection, dataset_collection
from models.user import AdminResult
from middleware.requireAdmin import require_admin
from schema.datasetSchema import individual_dataset, list_datasets
from helpers.datasetsHelpers import annotation
from helpers.miscHelpers import get_ph_datetime
from controllers.pointControllers import delete_point, create_points

# Folder to store datasets
datasets_folder = Path("public/datasets")

annotated_datasets_folder = Path("public/annotated_datasets")


def annotate_dataset(
    dataset_data: dict,
    raw_dataset_filename: str,
    original_filename: str,
    user_name: str,
):
    print("===== ANNOTATION STARTED =====\n")

    # Split the raw dataset filename [<filename>, 'csv']
    raw_dataset_filename_split = str.split(raw_dataset_filename, sep=".")

    # Append '-annotated' to filename
    result_filename = (
        f"{raw_dataset_filename_split[0]}-annotated.{raw_dataset_filename_split[1]}"
    )

    # Annotated dataset
    annotated_datasets_path: str = annotation(raw_dataset_filename, result_filename)

    file_size = os.stat(annotated_datasets_path).st_size

    num_of_rows = len(pd.read_csv(annotated_datasets_path))

    csv_headers = ["posts", "filtered_location", "annotations"]

    preview_headers = "+".join(csv_headers)

    preview_data = pd.read_csv(
        (annotated_datasets_path),
        nrows=3,
        usecols=csv_headers,
    ).to_json(orient="records")

    to_encode = dict(dataset_data).copy()

    to_encode.update(
        {
            "user_name": user_name,
            "filename": result_filename,
            "original_filename": original_filename,
            "file_size": file_size,
            "num_of_rows": num_of_rows,
            "preview_headers": str(preview_headers),
            "preview_data": json.dumps(preview_data),
            "dataset_type": "ANNOTATED",
            "created_at": get_ph_datetime(),
        }
    )

    new_annotated_dataset = dataset_collection.insert_one(dict(to_encode))

    if not new_annotated_dataset:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload annotated dataset",
        )

    print("DATASET ANNOTATED SUCCESSFULLY")
    
    create_points(result_filename)
    pass


"""
@desc     Upload a single dataset
route     POST api/datasets/upload
@access   Private
"""


async def upload_dataset(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    is_admin: Annotated[AdminResult, Depends(require_admin)],
):
    # Check if user is an admin or superadmin
    if not is_admin.result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to upload a dataset.",
        )

    dataset_data = {"user_id": is_admin.id}

    to_encode = dict(dataset_data).copy()

    # Check if id is valid object ID
    if not ObjectId.is_valid(to_encode["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to upload dataset",
        )

    user_data = user_collection.find_one({"_id": ObjectId(to_encode["user_id"])})

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload dataset",
        )

    # Create uploads destination folder if it not exists
    os.makedirs(datasets_folder, exist_ok=True)

    filename = file.filename

    original_filename = filename

    filename = f"{(round(get_ph_datetime().timestamp() * 1000))}-{filename}"

    file_size = file.size

    content_type = file.content_type

    # Check if file is a csv file
    if content_type != "text/csv":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type",
        )

    full_path = datasets_folder / filename

    contents = await file.read()

    with open(full_path, "wb") as f:
        f.write(contents)

    num_of_rows = len(pd.read_csv(full_path))

    csv_headers = list(pd.read_csv((full_path), nrows=3, usecols=range(3)).columns)

    csv_headers = ["region", "province", "posts"]

    preview_headers = "+".join(csv_headers)

    preview_data = pd.read_csv((full_path), nrows=3, usecols=range(3)).to_json(
        orient="records"
    )

    preview_data = pd.read_csv((full_path), nrows=3, usecols=csv_headers).to_json(
        orient="records"
    )

    to_encode.update(
        {
            "user_name": f"{user_data['first_name']} {user_data['last_name']}",
            "filename": filename,
            "original_filename": original_filename,
            "file_size": file_size,
            "num_of_rows": num_of_rows,
            "preview_headers": str(preview_headers),
            "preview_data": json.dumps(preview_data),
            "dataset_type": "RAW",
            "created_at": get_ph_datetime(),
        }
    )

    new_dataset = dataset_collection.insert_one(dict(to_encode))

    if not new_dataset:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload dataset",
        )

    background_tasks.add_task(
        annotate_dataset,
        dataset_data,
        filename,
        original_filename,
        f"{user_data['first_name']} {user_data['last_name']}",
    )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Dataset uploaded successfully"},
    )


"""
@desc     Download a single dataset by filename
route     GET api/datasets/download/{filename}
@access   Private
"""


async def download_dataset(id: str):
    # Check if there is id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error downloading dataset...",
        )

    # Check if id is valid object ID
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to download dataset"
        )

    # Check if data exists in database
    dataset_data = dataset_collection.find_one({"_id": ObjectId(id)})

    if not (dataset_data):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found"
        )

    filename = dataset_data["filename"]

    # Check if dataset is RAW or ANNOTATED dataset
    if dataset_data["dataset_type"] == "RAW":
        full_path = datasets_folder / filename
    elif dataset_data["dataset_type"] == "ANNOTATED":
        full_path = annotated_datasets_folder / filename

    # full_path = datasets_folder / filename

    if not os.path.isfile(full_path):
        return {"message": f"File {filename} not found."}

    with open(full_path, "rb") as f:
        file_data = f.read()

    response = FileResponse(
        full_path, media_type="application/octet-stream", filename=filename
    )

    response.headers["Content-Disposition"] = f'attachment; filename="{filename}"'

    return response


"""
@desc     Fetch all datasets
route     GET api/datasets
@access   Private
"""


async def fetch_datasets():
    data = dataset_collection.aggregate(
        [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_data",
                }
            },
            {"$sort": {"created_at": pymongo.DESCENDING}},
        ]
    )

    datasets = list_datasets(data)

    return datasets


"""
@desc     Delete a single dataset
route     DELETE api/datasets/{id}
@access   Private
"""


async def delete_dataset(background_tasks: BackgroundTasks, id: str):
    # Check if there is id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error deleting dataset...",
        )

    # Check if id is valid object ID
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to delete dataset"
        )

    # Check if data exists in database
    dataset_data = dataset_collection.find_one({"_id": ObjectId(id)})

    if not (dataset_data):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found"
        )

    deleted_dataset = dataset_collection.find_one_and_delete({"_id": ObjectId(id)})

    # If deletion failed
    if not deleted_dataset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete dataset.",
        )

    # Check if deleted dataset is RAW or ANNOTATED dataset
    if deleted_dataset["dataset_type"] == "RAW":
        full_path = datasets_folder / dataset_data["filename"]
    elif deleted_dataset["dataset_type"] == "ANNOTATED":
        full_path = annotated_datasets_folder / dataset_data["filename"]

    # Remove dataset from directory
    if os.path.exists(full_path):
        os.remove(full_path)

    background_tasks.add_task(delete_point, dataset_data["filename"])
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Dataset deleted successfully",
            "dataset": individual_dataset(deleted_dataset),
        },
    )


"""
@desc     Delete all datasets
route     DELETE api/datasets/all-datasets
@access   Private
"""


async def delete_all_datasets():
    deleted = dataset_collection.delete_many({})

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting datasets...",
        )

    if os.path.exists(datasets_folder):
        shutil.rmtree("public/datasets")

        os.makedirs(datasets_folder, exist_ok=True)
        
    if os.path.exists(annotated_datasets_folder):
        shutil.rmtree("public/annotated_datasets")

        os.makedirs(annotated_datasets_folder, exist_ok=True)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "All datasets deleted successfully"},
    )
