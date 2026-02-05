from typing import Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.user import User


class UserService:
    """
    Service class to handle user-related operations, including fetching user information
    for personalized greetings.
    """

    async def get_user_by_id(self, user_id: str, db_session: AsyncSession) -> Optional[User]:
        """
        Retrieve a user by their ID from the database

        Args:
            user_id (str): The ID of the user to retrieve
            db_session (AsyncSession): Database session to use for the query

        Returns:
            User: The user object if found, None otherwise
        """
        statement = select(User).where(User.id == user_id)
        result = await db_session.execute(statement)
        user = result.scalar_one_or_none()
        return user

    async def get_user_full_name(self, user_id: str, db_session: AsyncSession) -> Optional[str]:
        """
        Get the full name of a user by their ID

        Args:
            user_id (str): The ID of the user
            db_session (AsyncSession): Database session to use for the query

        Returns:
            str: The user's full name if available, None otherwise
        """
        user = await self.get_user_by_id(user_id, db_session)
        if user:
            # Combine first name and last name if available, otherwise use email or username
            full_name_parts = []
            if hasattr(user, 'first_name') and user.first_name:
                full_name_parts.append(user.first_name)
            if hasattr(user, 'last_name') and user.last_name:
                full_name_parts.append(user.last_name)

            if full_name_parts:
                return " ".join(full_name_parts)
            elif hasattr(user, 'name') and user.name:
                return user.name
            else:
                return user.email.split('@')[0]  # Use part of email before @ as name
        return None

    async def get_user_email(self, user_id: str, db_session: AsyncSession) -> Optional[str]:
        """
        Get the email of a user by their ID

        Args:
            user_id (str): The ID of the user
            db_session (AsyncSession): Database session to use for the query

        Returns:
            str: The user's email if available, None otherwise
        """
        user = await self.get_user_by_id(user_id, db_session)
        if user:
            return user.email
        return None

    async def get_personalized_greeting(self, user_id: str, db_session: AsyncSession) -> str:
        """
        Generate a personalized greeting for the user

        Args:
            user_id (str): The ID of the user
            db_session (AsyncSession): Database session to use for the query

        Returns:
            str: A personalized greeting in the format "Hi [name] ([email])"
        """
        name = await self.get_user_full_name(user_id, db_session)
        email = await self.get_user_email(user_id, db_session)

        if name and email:
            return f"Hi {name} ({email})"
        elif email:
            # Use part of email as name if full name not available
            name_part = email.split('@')[0]
            return f"Hi {name_part} ({email})"
        else:
            # Fallback to generic greeting
            return "Hi there! Welcome back."


# Create a singleton instance of the UserService
user_service = UserService()