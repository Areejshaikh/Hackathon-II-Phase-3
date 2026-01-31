from sqlmodel import SQLModel
from .models.users import User
from .models.task import Task


def register_models():
    """
    This function ensures that all models are registered with SQLModel's metadata.
    This is important to ensure foreign key relationships are properly recognized.
    """
    # Simply importing the models should register them with SQLModel
    # The key is that both models are imported and available when the engine is created
    pass


# You can also explicitly ensure the tables are created in the right order
def get_tables_to_create():
    """Return the tables in the order they should be created to respect foreign key constraints."""
    return [User, Task]