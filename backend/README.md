# Todo Backend API

This is a secure backend API for managing user tasks with JWT authentication and user-specific data isolation.

## Features

- JWT-based authentication for all API endpoints
- Secure CRUD operations for tasks
- User-specific data isolation (users can only access their own tasks)
- RESTful API design
- Automatic API documentation via FastAPI
- Rate limiting to prevent abuse
- Security headers for enhanced protection
- Comprehensive logging for monitoring

## Tech Stack

- Python 3.11+
- FastAPI
- SQLModel
- PostgreSQL (via Neon)
- JWT for authentication
- Bcrypt for password hashing
- Pydantic for data validation

## Installation

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` file
4. Run the application: `uvicorn main:app --reload`

## Environment Variables

Create a `.env` file in the backend root with the following variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-here
BETTER_AUTH_SECRET=your-better-auth-secret
DB_ECHO=False
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and get access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile

### Tasks
- `GET /tasks` - Get all tasks for the authenticated user
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Security Features

- Rate limiting (60 requests per minute per IP)
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- Input validation via Pydantic models
- SQL injection prevention via SQLModel/SQLAlchemy
- Password hashing with bcrypt
- JWT token authentication
- User data isolation to prevent unauthorized access

## Development

- Run tests: `pytest`
- Format code: `black .`
- Check types: `mypy .`