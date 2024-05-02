from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from bson import ObjectId
from datetime import datetime
import re
from pymongo import ReturnDocument
from typing_extensions import Annotated

from helpers.authHelpers import verify_password, generate_hashed_password
from helpers.sendMail import (
    mail_verified,
    mail_add_user,
    mail_add_admin,
    mail_add_superadmin,
    mail_delete_account,
)
from config.database import user_collection
from models.user import (
    CreateUserRequest,
    UpdatePersonalInfo,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UserInDB,
    VerifyUserRequest,
    SuperadminResult,
)
from middleware.requireAuth import require_auth
from middleware.requireAdmin import require_admin
from middleware.requireSuperadmin import require_superadmin
from schema.userSchema import individual_user, list_users

"""
@desc     Update personal information of user
route     PUT api/users/update-personal-information
@access   Private
"""


async def update_personal_info(data: UpdatePersonalInfo):
    errors = []

    # Check if there are missing fields
    if (
        not data.first_name
        or not data.last_name
        or not data.region
        or not data.organization
    ):
        if not data.first_name:
            errors.append({"field": "first_name", "error": "Must provide first name"})
        if not data.last_name:
            errors.append({"field": "last_name", "error": "Must provide last name"})
        if not data.region:
            errors.append({"field": "region", "error": "Must choose region"})
        if not data.organization:
            errors.append(
                {"field": "organization", "error": "Must provide organization"}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if user exists and verify password
    user_data = user_collection.find_one({"_id": ObjectId(data.id)})

    if not user_data:
        errors.append(
            {
                "field": "error",
                "error": "Error updating personal information. Please try again later.",
            }
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    user = UserInDB(**user_data)

    # Check if region is valid
    regions = [
        "NCR",
        "I",
        "II",
        "III",
        "CAR",
        "IVA",
        "IVB",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
        "XIII",
        "BARMM",
        "ALL",
    ]
    if not data.region in regions:
        errors.append({"field": "region", "error": "Invalid selected region"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    new_user = user_collection.find_one_and_update(
        {"_id": ObjectId(data.id)},
        {
            "$set": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "region": data.region,
                "organization": data.organization,
                "updated_at": datetime.now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not new_user:
        errors.append(
            {"field": "error", "error": "Error updating personal information"}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Personal information updated successfully",
            "user": individual_user(new_user),
        },
    )


"""
@desc     Update email and reset verification of user
route     PUT api/users/update-email
@access   Private
"""


async def update_email(data: UpdateEmailRequest):
    # Check if there are missing fields
    errors = []

    # Check if there are missing fields
    if not data.email or not data.password:
        if not data.email:
            errors.append({"field": "email", "error": "Must provide new email"})
        if not data.password:
            errors.append(
                {"field": "password", "error": "Must provide current password"}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if user exists and verify password
    user_data = user_collection.find_one({"_id": ObjectId(data.id)})

    if not user_data:
        errors.append(
            {
                "field": "error",
                "error": "Error updating email. Please try again later.",
            }
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    user = UserInDB(**user_data)

    if data.email == user.email:
        errors.append(
            {"field": "email", "error": "New email is the same with current email"}
        )

    # Check if email address is valid
    email_regex = r"^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$"
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

    if not re.match(email_regex, data.email):
        errors.append({"field": "email", "error": "Must enter valid email address"})

    # Check if email already exists other than the user
    email_exists = user_collection.count_documents(
        {"email": data.email, "_id": {"$ne": ObjectId(data.id)}}
    )

    if email_exists > 0:
        errors.append(
            {
                "field": "email",
                "error": "Email address is already used",
            }
        )

    # Check if current password is correct
    if not verify_password(data.password, user.password):
        errors.append({"field": "password", "error": "Incorrect current password"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    new_user = user_collection.find_one_and_update(
        {"_id": ObjectId(data.id)},
        {
            "$set": {
                "email": data.email,
                "is_verified": False,
                "updated_at": datetime.now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not new_user:
        errors.append({"field": "error", "error": "Error updating email"})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Email updated successfully",
            "user": individual_user(new_user),
        },
    )


"""
@desc     Update password of user
route     PUT api/users/update-password
@access   Private
"""


async def update_password(data: UpdatePasswordRequest):
    errors = []

    # Check if there are missing fields
    if not data.current_password or not data.password or not data.re_password:
        if not data.current_password:
            errors.append(
                {"field": "current_password", "error": "Must provide current password"}
            )
        if not data.password:
            errors.append({"field": "password", "error": "Must provide new password"})
        if not data.re_password:
            errors.append(
                {"field": "re_password", "error": "Must confirm new password"}
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if user exists and verify password
    user_data = user_collection.find_one({"_id": ObjectId(data.id)})

    if not user_data:
        errors.append(
            {
                "field": "error",
                "error": "Error updating password. Please try again later.",
            }
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    user = UserInDB(**user_data)

    if not verify_password(data.current_password, user.password):
        errors.append(
            {"field": "current_password", "error": "Incorrect current password"}
        )

    pwd_regex = [
        r"\s",
        r"[a-z]",
        r"[A-Z]",
        r"\d",
        r"^.*[!@#$%^&*_-]+.*$",
        r"[^\ssa-zA-Z0-9!@#$%^&*_-]",
    ]

    if re.search(pwd_regex[0], data.password) or re.search(pwd_regex[5], data.password):
        errors.append(
            {"field": "password", "error": "Must follow the following requirements."}
        )
    else:
        for r in pwd_regex[1:5]:
            if not re.search(r, data.password):
                errors.append(
                    {
                        "field": "password",
                        "error": "Must follow the following requirements.",
                    }
                )
                break

    # Check if new password and confirm password matches
    if data.password != data.re_password:
        errors.append({"field": "re_password", "error": "Passwords do not match"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Generate new hashed password
    new_user = user_collection.find_one_and_update(
        {"_id": ObjectId(data.id)},
        {
            "$set": {
                "password": generate_hashed_password(data.password),
                "updated_at": datetime.now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not new_user:
        errors.append({"field": "error", "error": "Error updating password"})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Password updated successfully",
            "user": individual_user(new_user),
        },
    )


"""
@desc     Delete user
route     DELETE api/users/{id}
@access   Private
"""


async def delete_user(id: str, user_id: Annotated[str, Depends(require_auth)]):
    # Check if there is id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error deleting account...",
        )

    # Check if id is valid object ID
    if not ObjectId.is_valid(id) or not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error deleting account..."
        )

    # Check if user id exists in database
    user_data = user_collection.find_one({"_id": ObjectId(user_id)})

    if not (user_data):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Error deleting account..."
        )

    # Check if user is admin or user
    if user_data["user_type"] in ["USER", "ADMIN"]:
        # If user or admin, check if id and user_id matches
        if str(user_data["_id"]) != id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Error deleting account...",
            )

    deleted_user = user_collection.delete_one({"_id": ObjectId(id)})

    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error deleting account...",
        )

    result = mail_delete_account(deleted_user["email"])

    if not result:
        print("error mail")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Account deleted successfully",
        },
    )


"""
@desc     Fetch all users
route     GET api/users/
@access   Private
"""


async def fetch_users():
    users = list_users(
        user_collection.find({"user_type": "USER"}).sort([("created_at", -1)])
    )
    return users


"""
@desc     Fetch all admins and superadmins
route     GET api/users/admins/
@access   Private
"""


async def fetch_admins():
    admins = list_users(
        user_collection.find(
            {"$or": [{"user_type": "ADMIN"}, {"user_type": "SUPERADMIN"}]}
        ).sort([("user_type", -1), ("created_at", -1)])
    )
    return admins


"""
@desc     Verify users
route     PUT api/users/verify/{id}
@access   Private | ADMIN-SUPERADMIN
"""


async def verify_user(
    id: str, data: VerifyUserRequest, is_admin: Annotated[bool, Depends(require_admin)]
):
    # Check if user / verifier is an admin or superadmin
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to verify user.",
        )

    # Check if there is an id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify user.",
        )

    # Check if id is a valid ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify user.",
        )

    # Check if user exists with id
    user_data = user_collection.find_one({"_id": ObjectId(id)})

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist.",
        )

    # Update verify status of user
    new_user = user_collection.find_one_and_update(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "is_verified": data.verify_status,
                "updated_at": datetime.now(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    # If update failed
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify user.",
        )

    if data.verify_status:
        result = mail_verified(new_user["email"])

        if not result:
            print("error mail")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "User verified successfully",
            "user": individual_user(new_user),
        },
    )


"""
@desc     Create a user, admin, or superadmin
route     POST api/users
@access   Private | SUPERADMIN
"""


async def create_user(
    user: CreateUserRequest,
    is_admin: Annotated[SuperadminResult, Depends(require_admin)],
):
    errors = []
    # Check if user is an admin or superadmin
    if not is_admin:
        errors.append({"field": "snackbar", "error": "Not authorized to add a user."})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=errors,
        )

    # Check fields if empty
    if (
        not user.user_type
        or not user.region
        or not user.organization
        or not user.first_name
        or not user.last_name
        or not user.email
        or not user.password
    ):
        if not user.user_type:
            errors.append({"field": "user_type", "error": "Must choose user type"})

        if not user.region:
            errors.append({"field": "region", "error": "Must choose region"})

        if not user.organization:
            errors.append({"field": "organization", "error": "Must enter organization"})

        if not user.first_name:
            errors.append({"field": "first_name", "error": "Must enter first name"})

        if not user.last_name:
            errors.append({"field": "last_name", "error": "Must enter last name"})

        if not user.email:
            errors.append({"field": "email", "error": "Must enter email address"})

        if not user.password:
            errors.append({"field": "password", "error": "Must enter password"})

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if user type is valid
    if not user.user_type in ["USER", "ADMIN", "SUPERADMIN"]:
        errors.append({"field": "user_type", "error": "Invalid user type"})

    # Check if region is valid
    regions = [
        "NCR",
        "I",
        "II",
        "III",
        "CAR",
        "IVA",
        "IVB",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
        "XIII",
        "BARMM",
        "ALL",
    ]
    if not user.region in regions:
        errors.append({"field": "region", "error": "Invalid selected region"})

    # Check if email address is valid
    email_regex = r"^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$"
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

    if not re.match(email_regex, user.email):
        errors.append({"field": "email", "error": "Must enter valid email address"})

    # Check if email address is already used
    existing_email = user_collection.count_documents({"email": user.email})

    if existing_email > 0:
        errors.append({"field": "email", "error": "Email address is already used"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    to_encode = dict(user).copy()
    to_encode.update({"is_verified": True})
    to_encode.update({"password": generate_hashed_password(to_encode["password"])})

    new_user = user_collection.insert_one(dict(to_encode))

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating admin...",
        )

    if user.user_type == "USER":
        regions = {
            "NCR": "National Capital Region",
            "I": "Region I",
            "II": "Region II",
            "III": "Region III",
            "CAR": "Cordillera Administrative Region (CAR)",
            "IVA": "Region IV-A (CALABARZON)",
            "IVB": "Region IV-B (MIMAROPA)",
            "V": "Region V",
            "VI": "Region VI",
            "VII": "Region VII",
            "VIII": "Region VIII",
            "IX": "Region IX",
            "X": "Region X",
            "XI": "Region XI",
            "XII": "Region XII",
            "XIII": "Region XIII",
            "BARMM": "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
        }
        result = mail_add_user(
            user.email,
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "region": regions[user.region],
                "organization": user.organization,
                "email": user.email,
                "password": user.password,
            },
        )
    elif user.user_type == "ADMIN":
        result = mail_add_admin(
            user.email, {"email": user.email, "password": user.password}
        )
    elif user.user_type == "SUPERADMIN":
        result = mail_add_superadmin(
            user.email, {"email": user.email, "password": user.password}
        )

    if not result:
        print("Failed. Email not sent.")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "User created successfully"},
    )


"""
@desc     Delete Users
route     DELETE api/users/admins/{id}
@access   Private | SUPERADMIN
"""


async def delete_users(
    id: str, is_admin: Annotated[SuperadminResult, Depends(require_admin)]
):
    # Check if user / verifier is an admin or superadmin
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to delete user.",
        )

    # Check if there is an id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user.",
        )

    # Check if id is a valid ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user.",
        )

    # Check if user exists with id
    user_data = user_collection.find_one({"_id": ObjectId(id)})

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist.",
        )

    deleted_user = user_collection.find_one_and_delete({"_id": ObjectId(id)})

    # If deletion failed
    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user.",
        )

    result = mail_delete_account(deleted_user["email"])

    if not result:
        print("error mail")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "User deleted successfully",
            "user": individual_user(deleted_user),
        },
    )

"""
@desc     Delete Admins
route     DELETE api/users/admins/{id}
@access   Private | SUPERADMIN
"""


async def delete_admin(
    id: str, is_superadmin: Annotated[SuperadminResult, Depends(require_superadmin)]
):
    # Check if user / verifier is an admin or superadmin
    if not is_superadmin.result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized to delete admin.",
        )

    # Check if there is an id
    if not id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete admin.",
        )

    # Check if id is a valid ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete admin.",
        )

    if id == is_superadmin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete own account.",
        )

    # Check if user exists with id
    user_data = user_collection.find_one({"_id": ObjectId(id)})

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin does not exist.",
        )

    deleted_user = user_collection.find_one_and_delete({"_id": ObjectId(id)})

    # If deletion failed
    if not deleted_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete admin.",
        )

    result = mail_delete_account(deleted_user["email"])

    if not result:
        print("error mail")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "User deleted successfully",
            "user": individual_user(deleted_user),
        },
    )
