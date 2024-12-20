# Create a dictionary of a single User
def individual_user(user) -> dict:
    return {
        "id": str(user["_id"]),
        "region": user["region"],
        "accessible_regions": str(user["accessible_regions"]).split(","),
        "organization": user["organization"],
        "email": user["email"],
        "first_name": user["first_name"] or "",
        "last_name": user["last_name"] or "",
        "is_disabled": user["is_disabled"],
        "user_type": user["user_type"],
        "created_at": str(user["created_at"]) if "created_at" in user.keys() else "",
        "updated_at": str(user["updated_at"]) if "updated_at" in user.keys() else "",
    }

# Create a list of User dictionaries
def list_users(users) -> list:
    return [individual_user(user) for user in users]
