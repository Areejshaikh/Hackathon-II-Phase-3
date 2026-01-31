from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from src.models.base import generate_uuid
import uuid

if TYPE_CHECKING:
    from .task import Task

# --- Base Schema (Shared Fields) ---
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, nullable=False)
    first_name: Optional[str] = Field(default=None, alias="firstName")
    last_name: Optional[str] = Field(default=None, alias="lastName")
    is_active: bool = Field(default=True)

# --- Main Database Model ---
class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={
            "lazy": "select", 
            "cascade": "all, delete-orphan"
        }
    )

# --- Schema for Registration ---
class UserCreate(UserBase):
    password: str
    # model_config allow karta hai ke backend 'first_name' aur 'firstName' dono ko samajh sake
    model_config = {
        "populate_by_name": True
    }

# --- Schema for Profile Updates ---
class UserUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, alias="firstName")
    last_name: Optional[str] = Field(default=None, alias="lastName")
    email: Optional[str] = None
    password: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }

# --- Schema for API Responses ---
class UserRead(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime