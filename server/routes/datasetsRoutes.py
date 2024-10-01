from fastapi import APIRouter
from controllers.datasetsController import (
    delete_all_datasets,
    delete_dataset,
    upload_dataset,
    download_dataset,
    fetch_datasets,
    fetch_datasets_by_user
)

router = APIRouter()

# POST      /datasets/upload
router.add_api_route("/upload", methods=["POST"], endpoint=upload_dataset)

# GET       /datasets/download/{id}
router.add_api_route("/download/{id}", methods=["GET"], endpoint=download_dataset)

# GET       /datasets/user/{user_id}
router.add_api_route("/user/{user_id}", methods=["GET"], endpoint=fetch_datasets_by_user)

# GET       /datasets
router.add_api_route("/", methods=["GET"], endpoint=fetch_datasets)

# DELETE    /datasets/all-datasets
router.add_api_route("/all-datasets", methods=["DELETE"], endpoint=delete_all_datasets)

# DELETE    /datasets/{id}
router.add_api_route("/{id}", methods=["DELETE"], endpoint=delete_dataset)

