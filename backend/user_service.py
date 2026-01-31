from sqlmodel import Session, select
from models.users import User, UserCreate
from models.task import Task
from db_init import register_models
from typing import List, Optional


def create_user(db_session: Session, user_data: UserCreate) -> User:
    """
    Create a new user in the database.
    """
    # Register models to ensure foreign key relationships are recognized
    register_models()

    fake_hashed_password = f"hashed_{user_data.password}"  # Replace with actual hashing
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=fake_hashed_password
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    return db_user


def get_user_by_email(db_session: Session, email: str) -> Optional[User]:
    """
    Retrieve a user by email.
    """
    statement = select(User).where(User.email == email)
    user = db_session.exec(statement).first()
    return user


def get_user_tasks(db_session: Session, user_id: int) -> List[Task]:
    """
    Retrieve all tasks for a specific user.
    Because of the proper relationship setup, this should work without foreign key errors.
    """
    statement = select(Task).where(Task.user_id == user_id)
    tasks = db_session.exec(statement).all()
    return tasks