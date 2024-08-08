from pydantic import BaseModel

class FetchPointsRequest(BaseModel):
    regions: str