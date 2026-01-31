# API Contract: Todo Frontend API Client

## Overview
Frontend API client for interacting with the Todo backend API. All requests require a valid JWT token in the Authorization header.

## Authentication
All endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Client Implementation (`/lib/api.ts`)

### Configuration
- Base URL: Retrieved from environment variables
- Default headers: Content-Type: application/json
- Authentication: JWT token automatically added to Authorization header

### Methods

#### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Request**:
- Method: GET
- Headers: 
  - Authorization: Bearer <token>
- Body: None

**Response**:
- Success: 200 OK with array of task objects
- Error: 401 Unauthorized if token invalid/expired

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const getTasks: () => Promise<Task[]>
```

#### POST /api/tasks
Create a new task for the authenticated user.

**Request**:
- Method: POST
- Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
- Body: 
```json
{
  "title": "Task title (required)",
  "description": "Task description (optional)",
  "status": "pending"
}
```

**Response**:
- Success: 201 Created with created task object
- Error: 400 Bad Request if validation fails
- Error: 401 Unauthorized if token invalid/expired

```typescript
const createTask: (taskData: { title: string; description?: string; status?: 'pending' | 'completed' }) => Promise<Task>
```

#### PUT /api/tasks/{taskId}
Update an existing task for the authenticated user.

**Request**:
- Method: PUT
- Headers: 
  - Authorization: Bearer <token>
  - Content-Type: application/json
- URL: `/api/tasks/{taskId}`
- Body: 
```json
{
  "title": "Updated title (optional)",
  "description": "Updated description (optional)",
  "status": "updated status (optional)"
}
```

**Response**:
- Success: 200 OK with updated task object
- Error: 400 Bad Request if validation fails
- Error: 401 Unauthorized if token invalid/expired
- Error: 404 Not Found if task doesn't exist

```typescript
const updateTask: (taskId: string, taskData: Partial<{ title: string; description?: string; status: 'pending' | 'completed' }>) => Promise<Task>
```

#### DELETE /api/tasks/{taskId}
Delete a task for the authenticated user.

**Request**:
- Method: DELETE
- Headers: 
  - Authorization: Bearer <token>
- URL: `/api/tasks/{taskId}`
- Body: None

**Response**:
- Success: 204 No Content
- Error: 401 Unauthorized if token invalid/expired
- Error: 404 Not Found if task doesn't exist

```typescript
const deleteTask: (taskId: string) => Promise<void>
```

## Error Handling

### Common Error Responses
- 401 Unauthorized: Invalid or expired JWT token
- 403 Forbidden: User attempting to access resources that don't belong to them
- 404 Not Found: Requested resource doesn't exist
- 422 Unprocessable Entity: Request validation failed
- 500 Internal Server Error: Unexpected server error

### Error Response Format
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

## Authentication Integration

### Token Management
- Tokens are retrieved from Better Auth client
- Tokens are automatically attached to all API requests
- Token refresh happens automatically when needed
- On token expiration, user is redirected to login page

### Better Auth Integration
- Better Auth client provides user session information
- Session information is used to determine authentication state
- Authentication state is passed to API client for token retrieval