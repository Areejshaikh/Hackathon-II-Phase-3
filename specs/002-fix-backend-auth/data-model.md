# Data Model: Fix Backend Errors and Implement Phase II Specifications

## Entities

### User
Represents an authenticated user with a unique ID
- **Fields**:
  - `id` (UUID/int): Unique identifier for the user
  - `email` (str): User's email address
  - `created_at` (datetime): Timestamp of user creation
  - `updated_at` (datetime): Timestamp of last update

### Task
Represents a to-do item with a title, description, status, and associated user ID
- **Fields**:
  - `id` (UUID/int): Unique identifier for the task
  - `title` (str): Title of the task (required)
  - `description` (str): Detailed description of the task (optional)
  - `status` (str): Status of the task (e.g., "pending", "in-progress", "completed")
  - `user_id` (UUID/int): Foreign key linking to the user who owns the task
  - `created_at` (datetime): Timestamp of task creation
  - `updated_at` (datetime): Timestamp of last update

### JWT Token
Authentication token containing user identity information
- **Fields**:
  - `token` (str): The JWT token string
  - `user_id` (UUID/int): The user ID embedded in the token
  - `expires_at` (datetime): Expiration timestamp of the token

## Relationships
- **User → Task**: One-to-many relationship (one user can have many tasks)
- **JWT Token → User**: Many-to-one relationship (many tokens can be associated with one user over time)

## Validation Rules
- **Task**:
  - Title must not be empty
  - User ID must reference an existing user
  - Status must be one of the allowed values: "pending", "in-progress", "completed"
  
- **User**:
  - Email must be a valid email format
  - Email must be unique

## State Transitions
- **Task Status**:
  - Can transition from "pending" to "in-progress" to "completed"
  - Can transition from "in-progress" back to "pending"
  - Can transition from "completed" back to "in-progress" if needed