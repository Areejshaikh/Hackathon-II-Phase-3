# API Contract: Todo Backend API with JWT Authentication

## Overview
RESTful API for managing user tasks with JWT-based authentication. All endpoints require a valid JWT token in the Authorization header.

## Authentication
All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Base URL
```
https://api.example.com/api
```

## Common Headers
- `Authorization: Bearer <token>` - Required for all endpoints except authentication
- `Content-Type: application/json` - For POST/PUT requests

## Endpoints

### Authentication

#### POST /auth/login
Login with credentials and receive a JWT token.

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### POST /auth/register
Register a new user account.

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Tasks

#### GET /tasks
Retrieve all tasks for the authenticated user.

Response (200 OK):
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the backend implementation",
    "status": "pending",
    "user_id": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "title": "Review code",
    "description": "Review pull requests",
    "status": "in-progress",
    "user_id": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
]
```

#### POST /tasks
Create a new task for the authenticated user.

Request:
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "pending"
}
```

Response (201 Created):
```json
{
  "id": 3,
  "title": "New task",
  "description": "Task description",
  "status": "pending",
  "user_id": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### PUT /tasks/{task_id}
Update an existing task for the authenticated user.

Request:
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed"
}
```

Response (200 OK):
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed",
  "user_id": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

#### DELETE /tasks/{task_id}
Delete a task for the authenticated user.

Response (204 No Content)

## Error Responses

### 401 Unauthorized
Returned when no valid JWT token is provided or the token is expired.

```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
Returned when a user attempts to access resources that don't belong to them.

```json
{
  "detail": "Not authorized to access this resource"
}
```

### 404 Not Found
Returned when the requested resource doesn't exist.

```json
{
  "detail": "Item not found"
}
```

### 422 Unprocessable Entity
Returned when request validation fails.

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Field required",
      "type": "value_error.missing"
    }
  ]
}
```