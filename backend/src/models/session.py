from sqlmodel import Field, SQLModel
from datetime import datetime
from src.models.base import generate_uuid
from typing import Optional


class SessionBase(SQLModel):
    user_id: str
    token: str = Field(unique=True, nullable=False)
    expires_at: datetime
    last_accessed_at: Optional[datetime] = None


class Session(SessionBase, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)