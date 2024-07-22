from datetime import datetime, timedelta, timezone
from fastapi import APIRouter
from controllers.miscController import contact_us

router = APIRouter()

router.add_api_route("/contact-us", methods=["POST"], endpoint=contact_us)


async def test_time():
    ph_timezone = timezone(timedelta(hours=8))
    obj = {"datetime_now": datetime.now(), "datetime_ ph": datetime.now(ph_timezone)}
    return obj


router.add_api_route("/test-time", methods=["GET"], endpoint=test_time)
