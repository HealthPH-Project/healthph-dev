# Create a dictionary of a single Activity Log
def individual_activity_log(log) -> dict:
    return {
        "id": str(log["_id"]),
        "user_id": str(log["_id"]),
        "user_name": log['user_name'] ,
        "user_type": log["user_type"] ,
        "entry": log["entry"],
        "module": log["module"],
        "created_at": str(log["created_at"]) if "created_at" in log.keys() else "",
    }

# Create a list of Activity Log dictionaries
def list_activity_logs(logs) -> list:
    return [individual_activity_log(log) for log in logs]
