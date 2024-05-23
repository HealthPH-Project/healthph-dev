from dotenv import dotenv_values

from models.user import AdminResult

config_dotenv = dotenv_values()

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing_extensions import Annotated
from jose import JWTError, jwt
from models.auth import TokenData
from config.database import user_collection
from bson import ObjectId
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/authenticate")


async def require_admin(token: Annotated[str, Depends(oauth2_scheme)]):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")],
        )

        id: str = payload.get("sub")

        if id is None:
            raise credential_exception

        token_data = TokenData(id=id)

        user_data = user_collection.find_one({"_id": ObjectId(token_data.id)})

        if user_data["user_type"] not in ["ADMIN", "SUPERADMIN"]:
            return AdminResult(result=False, id=token_data.id)

        return AdminResult(result=True, id=token_data.id)

    except JWTError:
        raise credential_exception
