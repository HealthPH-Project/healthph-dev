from jose import jwt
from datetime import datetime, timedelta, timezone
import os

# Password hashing
from passlib.context import CryptContext

from models.auth import OTPCode
from helpers.miscHelpers import get_ph_datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import bcrypt
import secrets

from dotenv import dotenv_values

config_dotenv = dotenv_values()

# Checks if input password and hashed password matches
def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )

# For hashing password to be stored in database
def generate_hashed_password(password: str):
    salt = bcrypt.gensalt(10)
    return (bcrypt.hashpw(password.encode("utf-8"), (salt))).decode("utf-8")


# For authentication / authorization
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = get_ph_datetime() + expires_delta
    else:
        expire = get_ph_datetime() + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        os.getenv("SECRET_KEY"),
        algorithm=os.getenv("ALGORITHM"),
    )

    return encoded_jwt


# For resetting password
def create_reset_password_token(email: str):
    return jwt.encode(
        {"sub": email, "exp": get_ph_datetime() + timedelta(minutes=10)},
        key=os.getenv("FORGOT_PWD_SECRET_KEY"),
        algorithm=os.getenv("ALGORITHM"),
    )

# For 2-step verification
def generate_otp_code():
    return OTPCode(
        otp_code=f"{secrets.randbelow(999999):06d}",
        otp_expiry=get_ph_datetime() + timedelta(minutes=10),
    )


# print(generate_hashed_password("Pass123!"))
# 2b$10$jgHncmAMGVhlKwSPGWJe1.ICnbQx5ZW6YBva.Z.9.w5nIua.QCkjW
