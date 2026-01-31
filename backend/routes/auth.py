import logging
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from backend.models.users import User, UserCreate, UserRead, UserUpdate
from utils.auth import hash_password, verify_password, create_access_token, get_current_user, get_current_user_from_better_auth
from db import get_session

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Login ke liye Pydantic Model (JSON support ke liye)
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserRead)
async def register(user: UserCreate, session: AsyncSession = Depends(get_session)):
    logger.info(f"Registration attempt for email: {user.email}")

    # 1. Check if user exists
    result = await session.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        logger.warning(f"Registration failed: Email already registered: {user.email}")
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # 2. Hash Password and Save
    hashed = hash_password(user.password)
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed
    )

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    logger.info(f"User registered successfully: {db_user.id}")
    return db_user

@router.post("/login")
async def login(credentials: LoginRequest, session: AsyncSession = Depends(get_session)):
    logger.info(f"Login attempt for email: {credentials.email}")

    result = await session.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        logger.warning(f"Login failed for email: {credentials.email}")
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    token = create_access_token(data={"sub": str(user.id)})
    logger.info(f"Login successful for user: {user.id}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserRead.model_validate(user)
    }


@router.post("/logout")
async def logout():
    """Logout endpoint - clears token on frontend"""
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserRead)
async def get_current_user_profile(current_user: User = Depends(get_current_user_from_better_auth)):
    """Get current user profile."""
    return current_user


@router.put("/profile", response_model=UserRead)
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user_from_better_auth),
    session: AsyncSession = Depends(get_session)
):
    """Update user profile."""
    # Update only provided fields
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        if field == "password":
            # Hash the password if updating
            setattr(current_user, "hashed_password", hash_password(value))
        else:
            setattr(current_user, field, value)

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user