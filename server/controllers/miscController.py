import os
import re
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.misc import ContactUsRequest
from helpers.sendMail import mail_contact_us


async def contact_us(data: ContactUsRequest):
    errors = []

    # Check fields if empty
    if not data.name or not data.email or not data.subject or not data.message:
        if not data.name:
            errors.append({"field": "name", "error": "Must provide name"})

        if not data.email:
            errors.append({"field": "email", "error": "Must provide email address"})

        if not data.subject:
            errors.append({"field": "subject", "error": "Must provide subject"})

        if not data.message:
            errors.append({"field": "message", "error": "Must provide message"})

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    # Check if email address is valid
    email_regex = r"^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$"
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"

    if not re.match(email_regex, data.email):
        errors.append({"field": "email", "error": "Must provide valid email address"})

    if len(errors) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )

    result = mail_contact_us(
        os.getenv("SMTP_SENDER_EMAIL"),
        {
            "name": data.name,
            "email": data.email,
            "subject": data.subject,
            "message_body": data.message,
        },
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=[
                {
                    "field": "error",
                    "error": "Failed to send message. Please try again later.",
                }
            ],
        )

    if result:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "User created successfully"},
        )
