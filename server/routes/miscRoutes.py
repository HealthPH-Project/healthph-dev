from fastapi import APIRouter
from controllers.miscController import contact_us, test_bigram

router = APIRouter()

# POST      /contact-us
router.add_api_route("/contact-us", methods=["POST"], endpoint=contact_us)

router.add_api_route("/test-bigram", methods=["GET"], endpoint=test_bigram)