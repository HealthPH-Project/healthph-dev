from fastapi import APIRouter
from controllers.miscController import contact_us

router = APIRouter()

router.add_api_route("/contact-us", methods=["POST"], endpoint=contact_us)