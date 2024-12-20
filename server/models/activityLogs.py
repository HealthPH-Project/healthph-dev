from pydantic import BaseModel
from datetime import datetime

from helpers.miscHelpers import get_ph_datetime

class ActivityLog(BaseModel): 
    user_id: str
    entry: str
    module: str
    created_at: datetime = get_ph_datetime()
    