from dotenv import dotenv_values

config_dotenv = dotenv_values()

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing_extensions import Annotated
from jose import JWTError, jwt
from models.auth import TokenData
import os
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/authenticate")

async def require_auth(token: Annotated[str, Depends(oauth2_scheme)]):
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
        
        return token_data.id

    except JWTError:
        raise credential_exception

