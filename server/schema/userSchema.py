def individual_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "region": user["region"],
        "organization": user["organization"],
        "email": user["email"],
        "first_name": user["first_name"] or "",
        "last_name": user["last_name"] or "",
        "is_verified": user["is_verified"],
        "user_type": user["user_type"],
        "created_at": str(user["created_at"]) if "created_at" in user.keys() else "",
        "updated_at": str(user["updated_at"]) if "updated_at" in user.keys() else "",
    }


def list_users(users) -> list:
    return [individual_user(user) for user in users]
