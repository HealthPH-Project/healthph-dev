from fastapi import HTTPException, status, Depends
from fastapi.responses import JSONResponse
from bson import ObjectId
import pymongo
from typing_extensions import Annotated

from config.database import activity_logs_collection, user_collection
from models.activityLogs import ActivityLog
from schema.activityLogSchema import list_activity_logs
from helpers.miscHelpers import get_ph_datetime
from middleware.requireAuth import require_auth

"""
@desc     Fetch all activity logs
route     GET api/activity_logs
@access   Private
"""


async def fetch_activity_logs(user_id: Annotated[str, Depends(require_auth)]):
    user_data = user_collection.find_one({"_id": ObjectId(user_id)})

    activity_logs = []

    if user_data["user_type"] == "ADMIN":
        # Fetch activity logs from Activity Logs table joined with Users table
        data = activity_logs_collection.aggregate(
            [
                {"$match": {"user_id": user_id}},
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
    elif user_data["user_type"] == "SUPERADMIN":
        # Fetch activity logs from Activity Logs table joined with Users table
        data = activity_logs_collection.aggregate(
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

    # Convert data to list of JSON objects
    activity_logs = list_activity_logs(data)

    return activity_logs


"""
@desc     Create a single activity log
route     POST api/activity_logs
@access   Private
"""


async def create_activity_log(data: ActivityLog):
    # Create a copy of request data
    to_encode = dict(data).copy()

    # Check if id is valid object ID
    if not ObjectId.is_valid(to_encode["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error creating activity log...",
        )

    # Check if user exists in database
    user_data = user_collection.find_one({"_id": ObjectId(to_encode["user_id"])})

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating activity log...",
        )

    # Update request data
    to_encode.update(
        {
            "user_name": f"{user_data['first_name']} {user_data['last_name']}",
            "user_type": user_data["user_type"],
            "created_at": get_ph_datetime(),
        }
    )

    # Create new activity log
    new_activity_log = activity_logs_collection.insert_one(dict(to_encode))

    if not new_activity_log:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating activity log...",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Activity log created successfully"},
    )


async def delete_all_activity_logs():
    # Delete all activity logs
    deleted = activity_logs_collection.delete_many({})

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting activity logs...",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "All activity logs deleted successfully"},
    )
