from pydantic import BaseModel
from datetime import datetime

class ActivityLog(BaseModel): 
    user_id: str
    entry: str
    module: str
    created_at: datetime = datetime.now()
    


"""
entry: description of action

Login, Add admin: <name of admin>, Verified User: <name of user>, Print: <what is printed>

module: what page
"""