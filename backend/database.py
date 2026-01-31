from sqlalchemy import create_engine
from sqlmodel import SQLModel
from .db_init import get_tables_to_create


# Use SQLite for simplicity, but this could be changed to PostgreSQL, MySQL, etc.
DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_sjvwW8I4zORl@ep-square-boat-aho0nl6y-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    """
    Create database tables in the correct order to respect foreign key constraints.
    """
    # Import all models to ensure they're registered with SQLModel
    from models.users import User  # noqa: F401
    from models.task import Task  # noqa: F401

    # Create all tables
    SQLModel.metadata.create_all(engine)