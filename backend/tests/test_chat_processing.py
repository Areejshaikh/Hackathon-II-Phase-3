import pytest
from unittest.mock import Mock, patch
from services.cohere_service import CohereService


class TestCohereService:
    """Test class for Cohere service functionality"""

    @pytest.fixture
    def cohere_service(self):
        """Create a mock Cohere service for testing"""
        service = CohereService.__new__(CohereService)  # Create without calling __init__
        service.client = Mock()
        return service

    def test_process_add_task_command(self, cohere_service):
        """Test processing an 'add task' command"""
        # Mock the Cohere response
        mock_response = Mock()
        mock_response.generations = [Mock()]
        mock_response.generations[0].text = '{"action": "add_task", "parameters": {"title": "Buy groceries"}}'

        cohere_service.client.generate.return_value = mock_response

        result = cohere_service.process_natural_language_command("Add a task to buy groceries", "user123")

        assert result["action"] == "add_task"
        assert result["parameters"]["title"] == "Buy groceries"

    def test_process_list_tasks_command(self, cohere_service):
        """Test processing a 'list tasks' command"""
        # Mock the Cohere response
        mock_response = Mock()
        mock_response.generations = [Mock()]
        mock_response.generations[0].text = '{"action": "list_tasks", "parameters": {}}'

        cohere_service.client.generate.return_value = mock_response

        result = cohere_service.process_natural_language_command("Show me my tasks", "user123")

        assert result["action"] == "list_tasks"

    def test_process_complete_task_command(self, cohere_service):
        """Test processing a 'complete task' command"""
        # Mock the Cohere response
        mock_response = Mock()
        mock_response.generations = [Mock()]
        mock_response.generations[0].text = '{"action": "complete_task", "parameters": {"task_id": 1}}'

        cohere_service.client.generate.return_value = mock_response

        result = cohere_service.process_natural_language_command("Mark task 1 as complete", "user123")

        assert result["action"] == "complete_task"
        assert result["parameters"]["task_id"] == 1

    def test_generate_response(self, cohere_service):
        """Test generating a natural language response"""
        # Mock the Cohere response
        mock_response = Mock()
        mock_response.generations = [Mock()]
        mock_response.generations[0].text = "Sure, I can help you with that."

        cohere_service.client.generate.return_value = mock_response

        result = cohere_service.generate_response("Can you help me?")

        assert "help" in result.lower()

    def test_error_handling(self, cohere_service):
        """Test error handling when Cohere API fails"""
        # Mock an exception from the Cohere client
        cohere_service.client.generate.side_effect = Exception("API Error")

        result = cohere_service.process_natural_language_command("Test command", "user123")

        assert result["action"] == "error"
        assert "error" in result["response_text"].lower()