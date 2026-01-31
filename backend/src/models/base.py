from sqlmodel import SQLModel
from typing import List
import uuid
from datetime import datetime
from pydantic import BaseModel


def generate_uuid():
    return str(uuid.uuid4())


class BaseSQLModel(SQLModel):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BaseResponse(BaseModel):
    success: bool
    message: str = ""


class PaginatedResponse(BaseModel):
    total: int
    limit: int
    offset: int
    has_more: bool