from sqlmodel import SQLModel, Field, Column, DateTime
from typing import Optional
from datetime import datetime
import uuid


class Conversation(SQLModel, table=True):
    """
    Represents a user's chat session with the AI assistant
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Links to the user who owns this conversation
    title: Optional[str] = Field(default=None, max_length=200)  # Auto-generated title based on first message or topic
    created_at: Optional[datetime] = Field(sa_column=Column(DateTime(), default=datetime.utcnow))
    updated_at: Optional[datetime] = Field(sa_column=Column(DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow))
    is_active: bool = Field(default=True)  # Whether the conversation is currently active

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }