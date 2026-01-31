# Data Model: Todo Web UI with Better Auth Integration

## Entities

### User
Represents an authenticated user with a unique ID, email, and authentication state
- **Fields**:
  - `id` (string): Unique identifier for the user
  - `email` (string): User's email address
  - `name` (string, optional): User's display name
  - `isLoggedIn` (boolean): Current authentication status
  - `isLoading` (boolean): Authentication state loading status

### Task
Represents a to-do item with a title, description, status (pending/completed), and associated user ID
- **Fields**:
  - `id` (string): Unique identifier for the task
  - `title` (string): Title of the task (required)
  - `description` (string, optional): Detailed description of the task
  - `status` (string): Status of the task ("pending" or "completed")
  - `userId` (string): ID of the user who owns the task
  - `createdAt` (Date): Timestamp of task creation
  - `updatedAt` (Date): Timestamp of last update

### Authentication State
Represents the current authentication status of the user (logged in, logged out, loading)
- **Fields**:
  - `user` (User, optional): The authenticated user object
  - `isLoading` (boolean): Whether authentication state is being determined
  - `isLoggedIn` (boolean): Whether the user is currently logged in

## Relationships
- **User → Task**: One-to-many relationship (one user can have many tasks)
- **Authentication State → User**: One-to-one relationship (the current auth state relates to one user)

## Validation Rules
- **Task**:
  - Title must not be empty
  - UserId must match the authenticated user's ID
  - Status must be one of the allowed values: "pending", "completed"
  
- **User**:
  - Email must be a valid email format

## State Transitions
- **Task Status**:
  - Can transition from "pending" to "completed"
  - Can transition from "completed" back to "pending"