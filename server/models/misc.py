from pydantic import BaseModel

class ContactUsRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    