# Quickstart Guide: Backend Foundation

## Overview
This guide provides instructions for setting up, running, and testing the backend foundation for the Todo application with JWT authentication and SQLModel database integration.

## Prerequisites
- Python 3.11 or higher
- PostgreSQL (or access to a Neon PostgreSQL database)
- pip package manager
- Virtual environment tool (venv, conda, etc.)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Create a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi sqlmodel python-jose[cryptography] passlib[bcrypt] uvicorn psycopg2-binary python-multipart python-dotenv pytest httpx
```

### 4. Environment Configuration
Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost/dbname
BETTER_AUTH_SECRET=your-super-secret-jwt-signing-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Database Setup
Initialize the database tables:

```bash
# This would typically be done via a script or migration tool
python -c "
from backend.db import engine
from backend.models import SQLModel
SQLModel.metadata.create_all(engine)
"
```

## Running the Application

### Development Mode
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

### Production Mode
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## API Usage

### Authentication
All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

To obtain a JWT token, you would typically use an authentication endpoint (not covered in this foundation but would be implemented in a complete system).

### Example Requests

#### Get all tasks
```bash
curl -X GET "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Create a new task
```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Task",
    "description": "This is a sample task",
    "completed": false
  }'
```

#### Update a task
```bash
curl -X PUT "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "completed": true
  }'
```

#### Delete a task
```bash
curl -X DELETE "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Testing

### Running Tests
```bash
pytest backend/tests/
```

### Example Test
```python
def test_create_task(client, valid_token):
    response = client.post(
        "/api/tasks",
        headers={"Authorization": f"Bearer {valid_token}"},
        json={
            "title": "Test Task",
            "description": "This is a test task",
            "completed": False
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["completed"] is False
```

## Security Notes

1. Always validate JWT tokens before processing requests
2. Ensure all database queries are filtered by the authenticated user's ID
3. Store the `BETTER_AUTH_SECRET` securely and never commit it to version control
4. Use HTTPS in production to protect JWT tokens in transit
5. Implement proper rate limiting to prevent abuse

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Verify your `DATABASE_URL` is correct and the database server is accessible
2. **JWT Validation Errors**: Ensure the `BETTER_AUTH_SECRET` matches between token generation and validation
3. **CORS Errors**: If connecting from a frontend, ensure CORS settings allow your frontend origin
4. **Permission Errors**: Verify that users can only access their own tasks by checking the user_id in queries

### Debugging Tips

1. Enable detailed logging during development
2. Use the automatic API documentation at `/docs` to test endpoints
3. Check that environment variables are properly loaded
4. Verify that database migrations are applied correctly