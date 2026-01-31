from sqlmodel import SQLModel, Field, Column, DateTime
from typing import Optional
from datetime import datetime
from sqlalchemy import JSON


class Message(SQLModel, table=True):
    """
    Represents individual messages within a conversation
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    role: str = Field(max_length=20)  # Either "user", "assistant", or "tool"
    content: str = Field(max_length=10000)  # The actual message content
    timestamp: Optional[datetime] = Field(sa_column=Column(DateTime(), default=datetime.utcnow))
    tool_call: Optional[dict] = Field(default=None, sa_column=Column(JSON))  # Contains tool name and parameters if this was a tool call
    tool_response: Optional[dict] = Field(default=None, sa_column=Column(JSON))  # Contains tool response if this is a tool result