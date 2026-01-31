from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional
from datetime import datetime, timedelta
from src.models.session import Session
import uuid


class SessionService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_session(self, user_id: str) -> Session:
        # Generate a unique token
        token = str(uuid.uuid4())
        
        # Set expiration time (e.g., 24 hours from now)
        expires_at = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        
        # Create the session object
        db_session = Session(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        
        self.session.add(db_session)
        await self.session.commit()
        await self.session.refresh(db_session)
        return db_session

    async def get_session_by_token(self, token: str) -> Optional[Session]:
        statement = select(Session).where(Session.token == token)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_session_by_user_id(self, user_id: str) -> Optional[Session]:
        statement = select(Session).where(Session.user_id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def delete_session(self, token: str) -> bool:
        statement = select(Session).where(Session.token == token)
        result = await self.session.execute(statement)
        db_session = result.scalar_one_or_none()

        if not db_session:
            return False

        await self.session.delete(db_session)
        await self.session.commit()
        return True

    async def is_valid_session(self, token: str) -> bool:
        session = await self.get_session_by_token(token)
        if not session:
            return False
        
        # Check if session hasn't expired
        return session.expires_at > datetime.utcnow()