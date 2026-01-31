import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from unittest.mock import patch

from main import app
from models.conversation import Conversation
from models.message import Message
from src.models.task import Task, TaskStatus


@pytest.fixture
def client():
    """Create a test client for the FastAPI app"""
    with TestClient(app) as test_client:
        yield test_client


def test_user_isolation_for_conversations(client: TestClient):
    """Test that users cannot access other users' conversations"""
    # Mock JWT token for user1
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user1"}

        # Create a conversation for user1
        response = client.post(
            "/api/user1/chat",
            json={"message": "Hello", "conversation_id": None},
            headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        data = response.json()
        conversation_id = data["conversation_id"]

    # Now try to access that conversation as user2
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user2"}

        response = client.post(
            f"/api/user2/chat",
            json={"message": "Try to access other user's conversation", "conversation_id": conversation_id},
            headers={"Authorization": "Bearer fake_token"}
        )

        # Should get a 404 since user2 doesn't have access to user1's conversation
        assert response.status_code == 404


def test_user_isolation_for_tasks(client: TestClient):
    """Test that users cannot access other users' tasks through chat commands"""
    # Create a task for user1
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user1"}

        # Add a task as user1
        response = client.post(
            "/api/user1/chat",
            json={"message": "Add a task for user 1", "conversation_id": None},
            headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200

    # Now try to list tasks as user2
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user2"}

        response = client.post(
            "/api/user2/chat",
            json={"message": "List my tasks", "conversation_id": None},
            headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        data = response.json()

        # The response should indicate user2 has no tasks
        # (since we only created tasks for user1)
        assert "You don't have any tasks yet" in data["response"] or "don't have any tasks" in data["response"].lower()


def test_user_id_validation(client: TestClient):
    """Test that user_id in URL must match JWT token"""
    # Try to access user2's chat endpoint with user1's token
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user1"}  # Token says user1

        response = client.post(
            "/api/user2/chat",  # URL says user2
            json={"message": "Trying to access as wrong user", "conversation_id": None},
            headers={"Authorization": "Bearer fake_token"}
        )

        # Should get 403 Forbidden
        assert response.status_code == 403
        assert "Forbidden" in response.json()["detail"]


def test_multiple_users_isolation(client: TestClient):
    """Test user isolation with multiple users performing operations"""
    users = ["user1", "user2", "user3"]

    # Create tasks for each user separately
    for user_id in users:
        with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
            mock_jwt.return_value = {"user_id": user_id}

            # Add a unique task for each user
            response = client.post(
                f"/api/{user_id}/chat",
                json={"message": f"Add a task for {user_id}", "conversation_id": None},
                headers={"Authorization": "Bearer fake_token"}
            )

            assert response.status_code == 200

    # Verify each user can only see their own tasks
    for user_id in users:
        with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
            mock_jwt.return_value = {"user_id": user_id}

            # Ask each user to list their tasks
            response = client.post(
                f"/api/{user_id}/chat",
                json={"message": "List my tasks", "conversation_id": None},
                headers={"Authorization": "Bearer fake_token"}
            )

            assert response.status_code == 200
            data = response.json()

            # Each user should only see their own tasks, not others'
            # The response should not contain tasks belonging to other users
            for other_user in users:
                if other_user != user_id:
                    assert other_user not in data["response"] or f"task for {other_user}" not in data["response"].lower()


def test_cross_user_conversation_access(client: TestClient):
    """Test that users cannot access each other's conversations"""
    # Create a conversation for user1
    user1_conversation_id = None
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user1"}

        response = client.post(
            "/api/user1/chat",
            json={"message": "Starting a conversation", "conversation_id": None},
            headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        user1_conversation_id = response.json()["conversation_id"]

    # Try to access that conversation as user2
    with patch('src.middleware.jwt_middleware.JWTBearer.__call__') as mock_jwt:
        mock_jwt.return_value = {"user_id": "user2"}

        response = client.post(
            "/api/user2/chat",
            json={"message": "Trying to access user1's conversation", "conversation_id": user1_conversation_id},
            headers={"Authorization": "Bearer fake_token"}
        )

        # Should get 404 since user2 doesn't have access to user1's conversation
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()