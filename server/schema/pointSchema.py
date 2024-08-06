def individual_point(point) -> dict:
    return {
        "id": str(point["_id"]),
        "PH_code": str(point["PH_code"]),
        "region": str(point["region"]),
        "province": str(point["province"]),
        "lat": point["lat"],
        "long": point["long"],
        "annotations": point["annotations"],
        "annotations_count": point["annotations_count"],
        "keywords": point["keywords"],
        "dataset_source": point["dataset_source"],
    }


def list_points(points) -> list:
    return [individual_point(point) for point in points]
