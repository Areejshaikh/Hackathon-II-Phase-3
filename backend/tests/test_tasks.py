import pytest
from fastapi.testclient import TestClient
from backend.main import app
from db import engine
from models import SQLModel


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        # Create tables
        SQLModel.metadata.create_all(engine)
        yield test_client


def test_root_endpoint(client):
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "online"
    assert "message" in data


def test_error_handlers(client):
    """Test error handlers"""
    # Test 404 error handler
    response = client.get("/nonexistent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "Not found"