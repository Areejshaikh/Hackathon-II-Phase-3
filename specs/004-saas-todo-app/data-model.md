# Data Model: Todo Pro - Premium SaaS-style Todo Application

## Overview
This document defines the data models for the Todo Pro application based on the entities identified in the feature specification.

## Entity Models

### User
Represents a registered user of the Todo Pro application with authentication credentials and profile information.

**Fields:**
- `id` (UUID/String): Unique identifier for the user
- `email` (String): User's email address (unique, required)
- `password_hash` (String): Hashed password (required, stored securely)
- `first_name` (String): User's first name (optional)
- `last_name` (String): User's last name (optional)
- `created_at` (DateTime): Timestamp when the user account was created
- `updated_at` (DateTime): Timestamp when the user account was last updated
- `is_active` (Boolean): Whether the account is active (default: true)

**Validation Rules:**
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum strength requirements
- Email and password are required for account creation

**Relationships:**
- One-to-many with Task (a user can have many tasks)

### Task
Represents a task item with properties such as title, description, status (Pending, In-Progress, Completed), category (Personal, Work, Urgent), and creation/modification timestamps.

**Fields:**
- `id` (UUID/String): Unique identifier for the task
- `title` (String): Task title (required, max 200 characters)
- `description` (Text): Detailed description of the task (optional)
- `status` (Enum): Task status (values: "Pending", "In-Progress", "Completed"; default: "Pending")
- `category` (Enum): Task category (values: "Personal", "Work", "Urgent"; default: "Personal")
- `due_date` (DateTime): Optional deadline for the task
- `priority` (Integer): Priority level (1-5, default: 3)
- `created_at` (DateTime): Timestamp when the task was created
- `updated_at` (DateTime): Timestamp when the task was last updated
- `user_id` (UUID/String): Reference to the user who owns this task (required)

**Validation Rules:**
- Title is required and must be between 1-200 characters
- Status must be one of the allowed values
- Category must be one of the allowed values
- Due date must be a future date if provided
- Priority must be between 1-5
- User_id must reference an existing user

**Relationships:**
- Many-to-one with User (many tasks belong to one user)

### Session
Represents an active user session managed via JWT tokens.

**Fields:**
- `id` (UUID/String): Unique identifier for the session
- `user_id` (UUID/String): Reference to the user associated with this session (required)
- `token` (String): JWT token identifier (required, unique)
- `expires_at` (DateTime): Expiration timestamp for the session
- `created_at` (DateTime): Timestamp when the session was created
- `last_accessed_at` (DateTime): Timestamp when the session was last used

**Validation Rules:**
- Token must be unique across all sessions
- User_id must reference an existing user
- Expires_at must be in the future
- Token is required for session creation

**Relationships:**
- Many-to-one with User (many sessions can belong to one user)

### Category
Represents a classification for tasks (Personal, Work, Urgent).

**Note:** This entity is represented as an enum in the Task model rather than a separate table, as it has a fixed set of values that rarely change.

**Values:**
- Personal
- Work
- Urgent

### Status
Represents the current state of a task (Pending, In-Progress, Completed).

**Note:** This entity is represented as an enum in the Task model rather than a separate table, as it has a fixed set of values that rarely change.

**Values:**
- Pending
- In-Progress
- Completed

## State Transitions

### Task Status Transitions
Tasks can transition between statuses according to the following rules:
- From "Pending" to "In-Progress" when user starts working on the task
- From "In-Progress" to "Completed" when user finishes the task
- From "Completed" to "In-Progress" if the task needs more work
- From "In-Progress" to "Pending" if the task is paused
- From "Completed" to "Pending" if the task needs to be redone

## Database Constraints

### Indexes
- Index on `users.email` for fast authentication lookups
- Index on `tasks.user_id` for efficient user-specific queries
- Index on `sessions.token` for fast session validation
- Composite index on `sessions.user_id` and `sessions.expires_at` for session management

### Foreign Keys
- `tasks.user_id` references `users.id`
- `sessions.user_id` references `users.id`

### Data Integrity
- Cascade delete for tasks when a user is deleted (to maintain data isolation)
- Prevent deletion of users if they have active sessions (optional, depending on requirements)