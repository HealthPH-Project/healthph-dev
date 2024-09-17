from fastapi import APIRouter
from controllers.userController import (
    set_disable_status,
    update_personal_info,
    update_email,
    update_password,
    delete_user,
    fetch_users,
    create_user,
    delete_users,
    fetch_admins,
    delete_admin,
    update_user,
)

router = APIRouter()

# PUT       /users/updated-personal-information
router.add_api_route(
    "/update-personal-information", methods=["PUT"], endpoint=update_personal_info
)

# PUT       /users/update-email
router.add_api_route("/update-email", methods=["PUT"], endpoint=update_email)

# PUT       /users/update-password
router.add_api_route("/update-password", methods=["PUT"], endpoint=update_password)

# DELETE    /users/delete/{id}
router.add_api_route("/delete/{id}", methods=["DELETE"], endpoint=delete_users)

# DELETE    /users/{id}
router.add_api_route("/{id}", methods=["DELETE"], endpoint=delete_user)

# GET       /users/
router.add_api_route("", methods=["GET"], endpoint=fetch_users)

# POST      /users/
router.add_api_route("", methods=["POST"], endpoint=create_user)

# PUT       /users/disable/{id}
router.add_api_route("/disable/{id}", methods=["PUT"], endpoint=set_disable_status)

# PUT       /users/update/{id}
router.add_api_route("/update/{id}", methods=["PUT"], endpoint=update_user)

# GET       /users/admins
router.add_api_route("/admins", methods=["GET"], endpoint=fetch_admins)

# DELETE    /users/admins/{id}
router.add_api_route("/admins/{id}", methods=["DELETE"], endpoint=delete_admin)
