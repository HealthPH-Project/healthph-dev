import json


def individual_dataset(dataset) -> dict:
    return {
        "id": str(dataset["_id"]),
        "user_id": str(dataset["user_id"]),
        "user_name": dataset["user_name"],
        "filename": dataset["filename"],
        "original_filename": dataset["original_filename"],
        "file_size": dataset["file_size"],
        "num_of_rows": dataset["num_of_rows"],
        "preview_headers": str(dataset["preview_headers"]).split("+"),
        "preview_data": (json.loads(dataset["preview_data"])),
        "created_at": (
            str(dataset["created_at"]) if "created_at" in dataset.keys() else ""
        ),
    }


def list_datasets(datasets) -> list:
    return [individual_dataset(log) for log in datasets]
