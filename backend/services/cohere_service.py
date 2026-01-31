import os
from typing import Dict, Any, List, Optional
import cohere
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class CohereService:
    """
    Service class to handle interactions with the Cohere API for natural language processing
    """

    def __init__(self):
        """
        Initialize the Cohere client with the API key from environment variables
        """
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            # For development, we'll set a flag indicating the service is disabled
            self.enabled = False
            print("WARNING: COHERE_API_KEY environment variable is not set. Cohere service will be disabled.")
        else:
            self.enabled = True
            self.client = cohere.Client(api_key)

    def process_natural_language_command(self, user_input: str, user_id: str) -> Dict[str, Any]:
        """
        Process natural language input and determine the appropriate task operation

        Args:
            user_input (str): The natural language command from the user
            user_id (str): The ID of the user making the request

        Returns:
            Dict[str, Any]: A dictionary containing the action to perform and any relevant parameters
        """
        # If Cohere service is not enabled, return a default response
        if not self.enabled:
            # Simple rule-based parsing for development
            user_input_lower = user_input.lower()
            if any(word in user_input_lower for word in ['add', 'create', 'new']):
                return {
                    "action": "add_task",
                    "response_text": f"Adding a new task based on: {user_input}",
                    "parameters": {"title": user_input}
                }
            elif any(word in user_input_lower for word in ['list', 'show', 'all']):
                return {
                    "action": "list_tasks",
                    "response_text": "Showing all tasks",
                    "parameters": {}
                }
            elif any(word in user_input_lower for word in ['complete', 'done', 'finish']):
                return {
                    "action": "complete_task",
                    "response_text": "Completing a task",
                    "parameters": {}
                }
            elif any(word in user_input_lower for word in ['delete', 'remove']):
                return {
                    "action": "delete_task",
                    "response_text": "Deleting a task",
                    "parameters": {}
                }
            else:
                return {
                    "action": "unknown",
                    "response_text": f"I didn't understand your command: {user_input}. Please try rephrasing.",
                    "parameters": {}
                }

        # Define the prompt for the Cohere model
        prompt = f"""
        You are an AI assistant that interprets natural language commands for a todo list application.
        Based on the user's input, determine the appropriate action to take.

        Possible actions:
        1. "add_task" - Add a new task
        2. "list_tasks" - List all tasks
        3. "complete_task" - Mark a task as complete
        4. "delete_task" - Delete a task
        5. "update_task" - Update a task
        6. "unknown" - Command not recognized

        For "add_task", extract the task title and any description.
        For "complete_task", "delete_task", or "update_task", identify the task ID if specified.
        For "update_task", also identify what needs to be updated.

        Input: {user_input}

        Respond in JSON format with "action" and any additional parameters needed.
        """

        try:
            # Generate a response using Cohere
            response = self.client.generate(
                model='command',
                prompt=prompt,
                max_tokens=300,
                temperature=0.1,
                stop_sequences=['}']
            )

            # Extract the response text
            response_text = response.generations[0].text.strip()

            # Try to parse the response as JSON
            import json
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                # If parsing fails, create a default response
                result = {
                    "action": "unknown",
                    "response_text": f"I didn't understand your command: {user_input}. Please try rephrasing.",
                    "parameters": {}
                }

            return result

        except Exception as e:
            # Handle any errors from the Cohere API
            return {
                "action": "error",
                "response_text": f"Sorry, I encountered an error processing your request: {str(e)}",
                "parameters": {}
            }

    def generate_response(self, user_input: str, context: Optional[List[Dict[str, str]]] = None) -> str:
        """
        Generate a natural language response to the user based on their input

        Args:
            user_input (str): The user's message
            context (List[Dict[str, str]], optional): Previous conversation context

        Returns:
            str: The AI-generated response
        """
        # If Cohere service is not enabled, return a default response
        if not self.enabled:
            return f"Cohere service is not configured. Echo: {user_input}"

        # Build the prompt with context if provided
        if context:
            context_str = "\n".join([f"{item['role']}: {item['message']}" for item in context[-5:]])  # Use last 5 exchanges
            prompt = f"""
            Context:
            {context_str}

            User: {user_input}

            Assistant:"""
        else:
            prompt = f"""
            User: {user_input}

            Assistant:"""

        try:
            # Generate a response using Cohere
            response = self.client.generate(
                model='command',
                prompt=prompt,
                max_tokens=300,
                temperature=0.7
            )

            # Extract and return the response text
            return response.generations[0].text.strip()

        except Exception as e:
            return f"Sorry, I encountered an error generating a response: {str(e)}"


# Create a singleton instance of the CohereService
cohere_service = CohereService()