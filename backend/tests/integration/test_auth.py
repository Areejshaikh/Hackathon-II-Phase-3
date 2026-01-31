import pytest
from fastapi.testclient import TestClient
from backend.main import app
from db import engine
from models import SQLModel
from sqlmodel import Session, select
from backend.models.users import User
from utils.auth import hash_password


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        # Create tables
        SQLModel.metadata.create_all(engine)
        yield test_client


def test_signup(client):
    import uuid
    # Test user registration with unique email
    unique_email = f"test_{uuid.uuid4()}@example.com"
    response = client.post("/auth/signup", json={
        "email": unique_email,
        "password": "testpassword",
        "first_name": "Test",
        "last_name": "User"
    })
    assert response.status_code == 200

    data = response.json()
    assert "id" in data
    assert data["email"] == unique_email
    assert data["first_name"] == "Test"


def test_login(client):
    import uuid
    # First register a user with unique email
    unique_email = f"login_{uuid.uuid4()}@example.com"
    signup_response = client.post("/auth/signup", json={
        "email": unique_email,
        "password": "password123",
        "first_name": "Login",
        "last_name": "Test"
    })
    assert signup_response.status_code == 200

    # Test login
    response = client.post("/auth/login", json={
        "email": unique_email,
        "password": "password123"
    })
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == unique_email


def test_login_invalid_credentials(client):
    # Test login with wrong password
    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_logout(client):
    # Test logout endpoint
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logged out successfully"


def test_get_current_user(client):
    import uuid
    # First register and login to get a token
    unique_email = f"profile_{uuid.uuid4()}@example.com"
    signup_response = client.post("/auth/signup", json={
        "email": unique_email,
        "password": "password123",
        "first_name": "Profile",
        "last_name": "Test"
    })
    assert signup_response.status_code == 200

    login_response = client.post("/auth/login", json={
        "email": unique_email,
        "password": "password123"
    })
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Test getting current user with valid token
    response = client.get("/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == unique_email
    assert data["first_name"] == "Profile"


def test_update_profile(client):
    import uuid
    # First register and login to get a token
    unique_email = f"update_{uuid.uuid4()}@example.com"
    signup_response = client.post("/auth/signup", json={
        "email": unique_email,
        "password": "password123",
        "first_name": "Update",
        "last_name": "Original"
    })
    assert signup_response.status_code == 200

    login_response = client.post("/auth/login", json={
        "email": unique_email,
        "password": "password123"
    })
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Test updating profile
    response = client.put("/auth/profile", json={
        "first_name": "Updated",
        "last_name": "Name"
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200

    data = response.json()
    assert data["first_name"] == "Updated"
    assert data["last_name"] == "Name"