import pytest
from fastapi.testclient import TestClient
from backend.main import app
from db import engine
from models import SQLModel
from models.task import TaskStatus


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        # Create tables
        SQLModel.metadata.create_all(engine)
        yield test_client


def test_task_crud_operations(client):
    import uuid
    # First register and login to get a token
    unique_email = f"taskuser_{uuid.uuid4()}@example.com"
    signup_response = client.post("/auth/signup", json={
        "email": unique_email,
        "password": "password123",
        "first_name": "Task",
        "last_name": "User"
    })
    assert signup_response.status_code == 200

    login_response = client.post("/auth/login", json={
        "email": unique_email,
        "password": "password123"
    })
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Test creating a task
    create_response = client.post("/tasks/", json={
        "title": "Test Task",
        "description": "This is a test task",
        "status": "pending"
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    assert create_response.status_code == 200

    task_data = create_response.json()
    assert task_data["title"] == "Test Task"
    assert task_data["description"] == "This is a test task"
    assert task_data["status"] == "pending"
    assert "id" in task_data

    task_id = task_data["id"]

    # Test getting all tasks
    get_response = client.get("/tasks/", headers={
        "Authorization": f"Bearer {token}"
    })
    assert get_response.status_code == 200

    tasks = get_response.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id
    assert tasks[0]["title"] == "Test Task"

    # Test updating the task
    update_response = client.put(f"/tasks/{task_id}", json={
        "title": "Updated Task",
        "status": "in-progress"
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    assert update_response.status_code == 200

    updated_task = update_response.json()
    assert updated_task["title"] == "Updated Task"
    assert updated_task["status"] == "in-progress"

    # Test deleting the task
    delete_response = client.delete(f"/tasks/{task_id}", headers={
        "Authorization": f"Bearer {token}"
    })
    assert delete_response.status_code == 200

    # Verify the task is deleted by checking that it no longer appears in the list
    get_response_after_delete = client.get("/tasks/", headers={
        "Authorization": f"Bearer {token}"
    })
    assert get_response_after_delete.status_code == 200

    tasks_after_delete = get_response_after_delete.json()
    assert len(tasks_after_delete) == 0  # Task should be gone from the user's list


def test_task_authorization(client):
    import uuid
    # Register first user
    user1_email = f"user1_{uuid.uuid4()}@example.com"
    user1_signup = client.post("/auth/signup", json={
        "email": user1_email,
        "password": "password123",
        "first_name": "User",
        "last_name": "One"
    })
    assert user1_signup.status_code == 200

    user1_login = client.post("/auth/login", json={
        "email": user1_email,
        "password": "password123"
    })
    assert user1_login.status_code == 200
    user1_token = user1_login.json()["access_token"]

    # Register second user
    user2_email = f"user2_{uuid.uuid4()}@example.com"
    user2_signup = client.post("/auth/signup", json={
        "email": user2_email,
        "password": "password123",
        "first_name": "User",
        "last_name": "Two"
    })
    assert user2_signup.status_code == 200

    user2_login = client.post("/auth/login", json={
        "email": user2_email,
        "password": "password123"
    })
    assert user2_login.status_code == 200
    user2_token = user2_login.json()["access_token"]

    # User 1 creates a task
    create_response = client.post("/tasks/", json={
        "title": "User 1 Task",
        "description": "This is user 1's task",
        "status": "pending"
    }, headers={
        "Authorization": f"Bearer {user1_token}"
    })
    assert create_response.status_code == 200
    task_data = create_response.json()
    task_id = task_data["id"]
    assert task_id is not None

    # User 2 should not be able to access user 1's task
    access_response = client.put(f"/tasks/{task_id}", json={
        "title": "Attempt to update user 1's task"
    }, headers={
        "Authorization": f"Bearer {user2_token}"
    })
    assert access_response.status_code == 403  # Forbidden

    # Clean up: delete the task with user 1's token
    delete_response = client.delete(f"/tasks/{task_id}", headers={
        "Authorization": f"Bearer {user1_token}"
    })
    assert delete_response.status_code == 200