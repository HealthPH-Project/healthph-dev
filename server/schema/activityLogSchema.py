def individual_activity_log(log) -> dict:
    user = log["user_data"][0]
    return {
        "id": str(log["_id"]),
        "user_id": str(log["_id"]),
        "user_name": f"{user['first_name']} {user['last_name']}",
        "user_type": user["user_type"],
        "entry": log["entry"],
        "module": log["module"],
        "created_at": str(log["created_at"]) if "created_at" in log.keys() else "",
    }


def list_activity_logs(logs) -> list:
    return [individual_activity_log(log) for log in logs]
