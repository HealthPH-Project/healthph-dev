from fastapi import APIRouter
from controllers.authController import (
    authenticate_user,
    forgot_password,
    resend_otp_code,
    verify_otp_code,
    verify_reset_password,
    reset_password,
)

router = APIRouter()

router.add_api_route("/authenticate", methods=["POST"], endpoint=authenticate_user)

router.add_api_route("/verify-code", methods=["POST"], endpoint=verify_otp_code)

router.add_api_route("/resend-otp-code", methods=["POST"], endpoint=resend_otp_code)

router.add_api_route("/forgot-password", methods=["POST"], endpoint=forgot_password)

router.add_api_route(
    "/verify-reset-password", methods=["POST"], endpoint=verify_reset_password
)

router.add_api_route("/reset-password", methods=["POST"], endpoint=reset_password)
