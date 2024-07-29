from fastapi import APIRouter
from controllers.datasetsController import (
    delete_all_datasets,
    delete_dataset,
    upload_dataset,
    download_dataset,
    fetch_datasets,
)

router = APIRouter()

router.add_api_route("/upload", methods=["POST"], endpoint=upload_dataset)

router.add_api_route("/download/{id}", methods=["GET"], endpoint=download_dataset)

router.add_api_route("/", methods=["GET"], endpoint=fetch_datasets)

router.add_api_route("/all-datasets", methods=["DELETE"], endpoint=delete_all_datasets)

router.add_api_route("/{id}", methods=["DELETE"], endpoint=delete_dataset)

