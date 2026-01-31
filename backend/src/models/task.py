from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from src.models.base import generate_uuid
from typing import Optional, TYPE_CHECKING
from enum import Enum
from sqlalchemy import ForeignKey

if TYPE_CHECKING:
    from .user import User


class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In-Progress"
    COMPLETED = "Completed"


class TaskCategory(str, Enum):
    PERSONAL = "Personal"
    WORK = "Work"
    URGENT = "Urgent"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    category: TaskCategory = Field(default=TaskCategory.PERSONAL)
    due_date: Optional[datetime] = None
    priority: int = Field(default=3, ge=1, le=5)


class TaskCreateBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None  # Make status optional in creation
    category: Optional[TaskCategory] = None  # Make category optional in creation
    due_date: Optional[datetime] = None
    priority: Optional[int] = Field(default=3, ge=1, le=5)  # Make priority optional with default


class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: str = Field(default_factory=generate_uuid, primary_key=True)
    user_id: str = Field(foreign_key="users.id")  # Foreign key is only on the table model
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to User with module-qualified string
    user: Optional["User"] = Relationship(back_populates="tasks", sa_relationship_kwargs={"lazy": "select"})


class TaskCreate(TaskCreateBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    category: Optional[TaskCategory] = None
    due_date: Optional[datetime] = None
    priority: Optional[int] = Field(default=None, ge=1, le=5)


class TaskRead(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime