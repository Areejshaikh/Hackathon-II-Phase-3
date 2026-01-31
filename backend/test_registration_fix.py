#!/usr/bin/env python3
"""
Test script to verify that the user registration works without foreign key errors.
"""

import asyncio
from sqlmodel import select
from backend.db import get_session, create_db_and_tables
from backend.models.users import User, UserCreate
from backend.utils.auth import hash_password


async def test_user_creation():
    """Test that user creation works without foreign key errors."""
    print("Testing user creation...")

    # Create database tables
    await create_db_and_tables()

    # Create a session
    async for session in get_session():
        # Create a test user
        user_data = UserCreate(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            password="testpassword123"
        )

        # Check if user already exists
        existing_user = await session.exec(
            select(User).where(User.email == user_data.email)
        )
        existing_user = existing_user.first()

        if existing_user:
            print(f"User with email {user_data.email} already exists, skipping creation.")
        else:
            # Hash the password
            hashed_password = hash_password(user_data.password)

            # Create the user
            db_user = User(
                email=user_data.email,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                password_hash=hashed_password
            )

            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)

            print(f"Successfully created user: {db_user.email} with ID: {db_user.id}")

            # Verify the user was created
            retrieved_user = await session.exec(
                select(User).where(User.id == db_user.id)
            )
            retrieved_user = retrieved_user.first()

            if retrieved_user:
                print(f"User retrieved successfully: {retrieved_user.email}")

                # Test the relationship by checking if the user has tasks relationship
                print(f"User has {len(retrieved_user.tasks)} tasks")

            break  # Exit the session loop

    print("Test completed successfully!")


if __name__ == "__main__":
    asyncio.run(test_user_creation())