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
)

router = APIRouter()

router.add_api_route(
    "/update-personal-information", methods=["PUT"], endpoint=update_personal_info
)

router.add_api_route("/update-email", methods=["PUT"], endpoint=update_email)

router.add_api_route("/update-password", methods=["PUT"], endpoint=update_password)

router.add_api_route("/delete/{id}", methods=["DELETE"], endpoint=delete_users)

router.add_api_route("/{id}", methods=["DELETE"], endpoint=delete_user)

router.add_api_route("", methods=["GET"], endpoint=fetch_users)

router.add_api_route("", methods=["POST"], endpoint=create_user)

router.add_api_route("/disable/{id}", methods=["PUT"], endpoint=set_disable_status)

router.add_api_route("/admins", methods=["GET"], endpoint=fetch_admins)

router.add_api_route("/admins/{id}", methods=["DELETE"], endpoint=delete_admin)