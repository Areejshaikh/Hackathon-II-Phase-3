from typing import Generator, AsyncGenerator
from src.database.session import AsyncSessionLocal, get_async_session
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from sqlmodel import select
from src.models.user import User
from src.services.auth import verify_token
import os

SECRET_KEY = os.getenv("SECRET_KEY", "uG4GOZ-kL2sN6ULOMSIZV_NKHx3KAW1LFffSSy5IjrY")
ALGORITHM = "HS256"


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


def get_current_user(token: str = Depends(verify_token)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # In a real implementation, you would fetch the user from the database
    # For now, we'll just return the user_id
    return {"id": user_id}