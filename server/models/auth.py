from pydantic import BaseModel
from typing import Union
from typing_extensions import Annotated
from fastapi.param_functions import Body
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: str | None = None


class OAuth2PasswordRequestFormJSON:
    def __init__(
        self,
        *,
        grant_type: Annotated[Union[str, None], Body(pattern="password")] = None,
        email: Annotated[str, Body()],
        password: Annotated[str, Body()],
        scope: Annotated[str, Body()] = "",
        client_id: Annotated[Union[str, None], Body()] = None,
        client_secret: Annotated[Union[str, None], Body()] = None,
    ):
        self.grant_type = grant_type
        self.email = email
        self.password = password
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret

class OTPCodeRequest(BaseModel):
    email: str
    otp_code: str
    
class OTPCode(BaseModel):
    otp_code: str
    otp_expiry: datetime

class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyResetPasswordToken(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    password: str
    re_password: str
