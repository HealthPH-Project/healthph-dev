from datetime import datetime
from fastapi import APIRouter
from controllers.miscController import contact_us

router = APIRouter()

router.add_api_route("/contact-us", methods=["POST"], endpoint=contact_us)


async def test_time():
    return {"time": datetime.now()}


router.add_api_route("/test-time", methods=["GET"], endpoint=test_time)
