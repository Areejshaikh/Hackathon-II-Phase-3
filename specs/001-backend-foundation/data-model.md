# Data Model: Backend Foundation

## Overview
This document describes the data models for the backend foundation, focusing on the Task entity and its relationship to users. The models are designed to support JWT-based authentication and user-specific data isolation.

## Task Model

### Fields
- **id** (Integer, Primary Key, Auto-generated)
  - Unique identifier for each task
  - Auto-incrementing integer value

- **title** (String, Required)
  - Brief title or subject of the task
  - Maximum length: 255 characters

- **description** (String, Optional)
  - Detailed description of the task
  - Maximum length: 1000 characters

- **completed** (Boolean)
  - Status indicating whether the task is completed
  - Default value: False

- **user_id** (Integer, Required, Foreign Key)
  - Reference to the user who owns this task
  - Links to the User model's id field

- **created_at** (DateTime, Required)
  - Timestamp when the task was created
  - Automatically set when record is created

- **updated_at** (DateTime, Required)
  - Timestamp when the task was last updated
  - Automatically updated when record is modified

### Relationships
- **user** (Many-to-One)
  - Each task belongs to one user
  - Access the user who owns the task via the user relationship

### Validation Rules
- Title must be between 1 and 255 characters
- User ID must reference an existing user
- Completed status must be a boolean value
- Created and updated timestamps are automatically managed

## User Model

### Fields
- **id** (Integer, Primary Key, Auto-generated)
  - Unique identifier for each user
  - Auto-incrementing integer value

- **email** (String, Required, Unique)
  - Email address of the user
  - Used for identification and authentication
  - Maximum length: 255 characters

- **hashed_password** (String, Required)
  - Hashed password for authentication
  - Stored securely using bcrypt hashing

- **created_at** (DateTime, Required)
  - Timestamp when the user account was created
  - Automatically set when record is created

- **updated_at** (DateTime, Required)
  - Timestamp when the user account was last updated
  - Automatically updated when record is modified

### Relationships
- **tasks** (One-to-Many)
  - Each user can have many tasks
  - Access all tasks owned by a user via the tasks relationship

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Password must be hashed before storing
- Created and updated timestamps are automatically managed

## Database Schema

### Tables
```
users
-----
id (PK)           INTEGER
email             VARCHAR(255) UNIQUE NOT NULL
hashed_password   VARCHAR(255) NOT NULL
created_at        TIMESTAMP NOT NULL
updated_at        TIMESTAMP NOT NULL

tasks
-----
id (PK)           INTEGER
title             VARCHAR(255) NOT NULL
description       TEXT
completed         BOOLEAN DEFAULT FALSE
user_id (FK)      INTEGER NOT NULL
created_at        TIMESTAMP NOT NULL
updated_at        TIMESTAMP NOT NULL

Foreign Key Constraints:
- tasks.user_id REFERENCES users.id ON DELETE CASCADE
```

### Indexes
- Index on `users.email` for efficient user lookup
- Index on `tasks.user_id` for efficient user-specific queries
- Index on `tasks.created_at` for chronological sorting

## State Transitions

### Task State Transitions
- **Incomplete → Complete**: When a user marks a task as completed
- **Complete → Incomplete**: When a user unmarks a completed task
- **Created**: When a new task is added to the system
- **Deleted**: When a user removes a task from the system

## Security Considerations

### Data Isolation
- All queries must be filtered by the authenticated user's ID
- Cross-user access to tasks must be prevented at the application level
- Foreign key constraints ensure referential integrity

### Access Control
- Only the owner of a task can view, modify, or delete it
- Authentication must be validated before any data access
- User ID must be extracted from JWT token for all requests