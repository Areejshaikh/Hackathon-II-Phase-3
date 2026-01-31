from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Dict, Any
from pydantic import BaseModel
from src.database.session import get_async_session
from src.models.user import UserCreate, UserRead
from src.services.user_service import UserService, verify_password, get_password_hash
from src.services.auth import create_access_token
from datetime import timedelta
import os

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", response_model=Dict[str, Any])
async def register(user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    user_service = UserService(session)
    
    try:
        # Create the user
        db_user = await user_service.create_user(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": db_user.id},
            expires_delta=timedelta(minutes=30)  # Token expires in 30 minutes
        )
        
        # Return success response
        return {
            "success": True,
            "message": "User registered successfully",
            "data": {
                "id": db_user.id,
                "email": db_user.email,
                "first_name": db_user.first_name,
                "last_name": db_user.last_name,
                "created_at": db_user.created_at
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    except ValueError as e:
        # User already exists
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Dict[str, Any])
async def login(credentials: LoginRequest, session: AsyncSession = Depends(get_async_session)):
    user_service = UserService(session)

    # Get user by email
    user = await user_service.get_user_by_email(credentials.email)

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=30)  # Token expires in 30 minutes
    )

    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        },
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout():
    # In a real implementation, you would invalidate the token
    # For now, we'll just return a success message
    return {
        "success": True,
        "message": "Logged out successfully"
    }


@router.get("/me", response_model=Dict[str, Any])
async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    user_service = UserService(session)

    # Get user by ID from token
    user = await user_service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "success": True,
        "data": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }


@router.put("/profile", response_model=Dict[str, Any])
async def update_profile(
    request: Request,
    first_name: str = None,
    last_name: str = None,
    session: AsyncSession = Depends(get_async_session)
):
    # Get user_id from JWT middleware
    user_id = getattr(request.state, 'user_id', None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )

    from src.models.user import UserUpdate

    user_service = UserService(session)

    # Create update object
    user_update = UserUpdate(first_name=first_name, last_name=last_name)

    # Update user
    updated_user = await user_service.update_user(user_id, user_update)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "id": updated_user.id,
            "email": updated_user.email,
            "first_name": updated_user.first_name,
            "last_name": updated_user.last_name,
            "updated_at": updated_user.updated_at
        }
    }