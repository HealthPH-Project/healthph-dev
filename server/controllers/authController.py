from fastapi import Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing_extensions import Annotated
from datetime import datetime, timedelta
import re
import os
from dotenv import dotenv_values

config_dotenv = dotenv_values()

from config.database import user_collection
from models.auth import (
    TokenData,
    OAuth2PasswordRequestFormJSON,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyResetPasswordToken,
)
from models.user import User, UserInDB
from schema.userSchema import individual_user
from helpers.authHelpers import (
    verify_password,
    generate_hashed_password,
    create_access_token,
    create_reset_password_token,
)
from helpers.sendMail import mail_forgot_password, mail_registered


"""
@desc     Auth user / set token
route     POST api/auth/authenticate
@access   Public
"""


async def authenticate_user(
    response: Response, credentials: Annotated[OAuth2PasswordRequestFormJSON, Depends()]
):
    # Check if user submitted an email and password
    if not credentials.email or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Must provide both email address and password",
        )

    # Find user with {email} in database
    user_data = user_collection.find_one({"email": credentials.email})

    # Check if user with {email} exists
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = UserInDB(**user_data)

    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    )

    access_token = create_access_token(
        data={"sub": str(user_data["_id"])}, expires_delta=access_token_expires
    )

    # secure = True / https
    response = JSONResponse(
        content={
            "access_token": access_token,
            "token_type": "bearer",
            "user": individual_user(user_data),
        }
    )
    response.set_cookie(
        key="accesstoken", value=access_token, httponly=False, samesite="none"
    )

    return response


"""
@desc     Create user / set token
route     POST api/auth/register
@access   Public
"""


async def register_user(user: RegisterRequest):
    errors = []

    # Check fields if empty
    if (
        not user.department_level
        or not user.organization
        or not user.first_name
        or not user.last_name
        or not user.email
        or not user.password
        or not user.re_password
    ):
        if not user.department_level:
            errors.append(
                {"field": "department_level", "error": "Must choose department level"}
            )

        if not user.organization:
            errors.append({"field": "organization", "error": "Must enter organization"})

        if not user.first_name:
            errors.append({"field": "first_name", "error": "Must enter first name"})

        if not user.last_name:
            errors.append({"field": "last_name", "error": "Must enter last name"})

        if not user.email:
            errors.append({"field": "email", "error": "Must enter email address"})

        if not user.password:
            errors.append({"field": "password", "error": "Must enter password"})

        if not user.re_password:
            errors.append({"field": "re_password", "error": "Must confirm password"})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if department level is valid
    department_levels = ["national", "regional", "provincial", "city", "municipal"]
    if not user.department_level in department_levels:
        errors.append(
            {"field": "department_level", "error": "Invalid department level"}
        )

    # Check if email address is valid
    email_regex = r"^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$"
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

    if not re.match(email_regex, user.email):
        errors.append({"field": "email", "error": "Must enter valid email address"})

    # Check if email address is already used
    existing_email = user_collection.count_documents({"email": user.email})

    if existing_email > 0:
        errors.append({"field": "email", "error": "Email address is already used"})

    # Check if password and confirm password matches
    if user.password != user.re_password:
        errors.append({"field": "re_password", "error": "Passwords do not match"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    to_encode = dict(user).copy()

    to_encode.update({"password": generate_hashed_password(to_encode["password"])})
    to_encode.pop("re_password")

    new_user = user_collection.insert_one(dict(to_encode))

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating account...",
        )

    levels = {
        "national": "National Level Office",
        "regional": "Regional Level Office",
        "provincial": "Provincial Level Office",
        "city": "City Level Office",
        "municipal": "Municipal Level Office",
    }
    # Send reset password instructions thru email
    result = mail_registered(
        user.email,
        {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "department_level": levels[user.department_level],
            "organization": user.organization,
            "email": user.email,
        },
    )
    
    if not result:
        print("error")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Account created successfully"},
    )


"""
@desc     Create reset password link and send email to user
route     POST api/auth/forgot-password
@access   Public
"""


async def forgot_password(req: ForgotPasswordRequest):
    # Check if users with {email} exists in database
    user_data = user_collection.find_one({"email": req.email})

    # If not, raise error
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email address does not exists.",
        )

    # Create User variable
    user = User(**user_data)

    # Create unique reset password token using email
    reset_pwd_token = create_reset_password_token(email=user.email)

    # Create reset password link with token for client-side
    reset_pwd_link = (
        os.getenv("CLIENT_URL") + f"/reset-password/{reset_pwd_token}"
    )

    # Send reset password instructions thru email
    result = mail_forgot_password(
        user.email, {"first_name": user.first_name, "reset_pwd_link": reset_pwd_link}
    )

    if result:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Reset password instructions sent to email successfully."
            },
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error sending reset password link. Please try again later.",
        )


"""
@desc     Verify reset password link
route     POST api/auth/verify-reset-password
@access   Public
"""


async def verify_reset_password(data: VerifyResetPasswordToken):
    credential_exception = HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Invalid reset password link or reset password link expired",
    )

    token = data.token

    try:
        payload = jwt.decode(
            token,
            os.getenv("FORGOT_PWD_SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")],
        )

        email: str = payload.get("sub")

        if email is None:
            raise credential_exception
        
        return email

        token_data = TokenData(email=email)

        return token_data
    except JWTError:
        raise credential_exception


"""
@desc     Reset user password
route     POST api/auth/reset-password
@access   Public
"""


async def reset_password(req: ResetPasswordRequest):
    # Verify token if valid or not expired
    email = await verify_reset_password(
        VerifyResetPasswordToken(**{"token": req.token})
    )

    # If not, raise error
    if not email:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid reset password link or reset password link expired",
        )

    # Check if request contains password and confirm password
    if not req.password or not req.re_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing fields (password and/or confirm password)",
        )

    # Check if new password and confirm password matches
    if req.password != req.re_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match",
        )

    # Hash new password
    new_pwd = generate_hashed_password(req.password)

    # Check if user with {email} exists in database
    user_data = user_collection.find_one({"email": email})

    # If not, raise error
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid reset password link or reset password link expired",
        )

    # Create User variable
    user = User(**user_data)

    # Find user in database and update password with new hashed password
    user_collection.find_one_and_update(
        {"email": user.email},
        {"$set": {"password": new_pwd, "updated_at": datetime.now()}},
    )

    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "Password reset successful"}
    )
