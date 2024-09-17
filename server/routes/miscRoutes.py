from fastapi import APIRouter
from controllers.miscController import contact_us

router = APIRouter()

# POST      /contact-us
router.add_api_route("/contact-us", methods=["POST"], endpoint=contact_us)