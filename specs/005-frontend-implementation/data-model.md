# Data Model: Professional Todo SaaS Frontend Implementation

## Overview
This document defines the data models for the frontend of the Todo Pro application based on the entities identified in the feature specification. These models represent the data structures used in the frontend application and how they relate to the backend API.

## Entity Models

### User
Represents an authenticated user of the Todo Pro application with associated tasks and preferences.

**Fields:**
- `id` (string): Unique identifier for the user
- `email` (string): User's email address
- `first_name` (string): User's first name (optional)
- `last_name` (string): User's last name (optional)
- `created_at` (string): Timestamp when the user account was created
- `updated_at` (string): Timestamp when the user account was last updated

**Validation Rules:**
- Email must be a valid email format
- Email must be unique across all users

**Relationships:**
- One-to-many with Task (a user can have many tasks)

### Task
Represents a task item with properties such as title, description, status (Pending, In-Progress, Completed), category, and creation/modification timestamps.

**Fields:**
- `id` (string): Unique identifier for the task
- `title` (string): Task title (required, max 200 characters)
- `description` (string): Detailed description of the task (optional)
- `status` (string): Task status (values: "Pending", "In-Progress", "Completed"; default: "Pending")
- `category` (string): Task category (values: "Personal", "Work", "Urgent"; default: "Personal")
- `due_date` (string): Optional deadline for the task (ISO date string)
- `priority` (number): Priority level (1-5, default: 3)
- `created_at` (string): Timestamp when the task was created (ISO string)
- `updated_at` (string): Timestamp when the task was last updated (ISO string)
- `user_id` (string): Reference to the user who owns this task (required)

**Validation Rules:**
- Title is required and must be between 1-200 characters
- Status must be one of the allowed values
- Category must be one of the allowed values
- Due date must be a future date if provided
- Priority must be between 1-5

**Relationships:**
- Many-to-one with User (many tasks belong to one user)

### Session
Represents an active user session managed via JWT tokens.

**Fields:**
- `token` (string): JWT token identifier (required)
- `user_id` (string): Reference to the user associated with this session (required)
- `expires_at` (string): Expiration timestamp for the session (ISO string)
- `created_at` (string): Timestamp when the session was created (ISO string)

**Validation Rules:**
- Token must be valid JWT format
- User_id must reference an existing user
- Expires_at must be in the future

**Relationships:**
- Many-to-one with User (many sessions can belong to one user)

### Theme
Represents the visual styling of the application using the specified indigo & slate color palette.

**Fields:**
- `primary_color` (string): Primary color in hex format (e.g., "#4F46E5")
- `background_color` (string): Background color in hex format (e.g., "#020617")
- `card_color` (string): Card background color in hex format (e.g., "#1E293B")
- `theme_name` (string): Name of the theme (e.g., "Indigo & Slate")

**Validation Rules:**
- Colors must be valid hex color codes
- Theme name must be non-empty

**Relationships:**
- One-to-many with User (a theme can be used by many users)

## State Transitions

### Task Status Transitions
Tasks can transition between statuses according to the following rules:
- From "Pending" to "In-Progress" when user starts working on the task
- From "In-Progress" to "Completed" when user finishes the task
- From "Completed" to "In-Progress" if the task needs more work
- From "In-Progress" to "Pending" if the task is paused
- From "Completed" to "Pending" if the task needs to be redone

## API Data Structures

### Task Summary Card Data
Used for displaying task summary information on the dashboard:
- `total_tasks` (number): Total number of tasks
- `pending_tasks` (number): Number of pending tasks
- `completed_tasks` (number): Number of completed tasks
- `in_progress_tasks` (number): Number of in-progress tasks

### Filter Data
Used for filtering tasks by status:
- `status` (string): Filter by status ("All", "Pending", "In-Progress", "Completed")
- `category` (string): Filter by category ("All", "Personal", "Work", "Urgent")
- `search_query` (string): Filter by search query in title/description