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

# POST      /auth/authenticate
router.add_api_route("/authenticate", methods=["POST"], endpoint=authenticate_user)

# POST      /auth/verify-code
router.add_api_route("/verify-code", methods=["POST"], endpoint=verify_otp_code)

# POST      /auth/resend-otp-code
router.add_api_route("/resend-otp-code", methods=["POST"], endpoint=resend_otp_code)

# POST      /auth/forgot-password
router.add_api_route("/forgot-password", methods=["POST"], endpoint=forgot_password)

# POST      /auth/verify-reset-password
router.add_api_route(
    "/verify-reset-password", methods=["POST"], endpoint=verify_reset_password
)

# POST      /auth/reset-password
router.add_api_route("/reset-password", methods=["POST"], endpoint=reset_password)
