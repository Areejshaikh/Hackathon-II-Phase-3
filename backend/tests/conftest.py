import pytest
from db import engine
from models import SQLModel


@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    # Create all tables before tests run
    SQLModel.metadata.create_all(engine)
    
    yield
    
    # Optionally drop tables after tests are done
    # SQLModel.metadata.drop_all(engine)