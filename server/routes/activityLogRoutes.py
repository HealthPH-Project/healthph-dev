from fastapi import APIRouter
from controllers.activityLogController import create_activity_log, fetch_activity_logs, delete_all_activity_logs

router = APIRouter()

router.add_api_route("", methods=["GET"], endpoint=fetch_activity_logs)
    
router.add_api_route("", methods=["POST"], endpoint=create_activity_log)

router.add_api_route("", methods=["DELETE"], endpoint=delete_all_activity_logs)