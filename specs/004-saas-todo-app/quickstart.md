# Quickstart Guide: Todo Pro - Premium SaaS-style Todo Application

## Overview
This guide provides instructions for setting up and running the Todo Pro application locally for development purposes.

## Prerequisites
- Node.js v18+ installed
- Python 3.11+ installed
- PostgreSQL (or access to Neon PostgreSQL)
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database connection details and Better Auth secret
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend API URL and other configuration
```

## Configuration

### Backend Configuration (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_pro_dev
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### Frontend Configuration (.env)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Running the Application

### 1. Start the Backend
```bash
# From the backend directory
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run database migrations
python -m alembic upgrade head

# Start the backend server
python -m uvicorn src.main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
# From the frontend directory
cd frontend

# Start the development server
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend API Docs: http://localhost:8000/docs

## Running Tests

### Backend Tests
```bash
# From the backend directory
cd backend
source venv/bin/activate

# Run all tests
pytest

# Run tests with coverage
pytest --cov=src
```

### Frontend Tests
```bash
# From the frontend directory
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Database Migrations
```bash
# Generate a new migration
python -m alembic revision --autogenerate -m "migration message"

# Apply migrations
python -m alembic upgrade head

# Downgrade to a previous version
python -m alembic downgrade -1
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout and invalidate session
- `GET /api/auth/me` - Get current user info (requires JWT)

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task
- `DELETE /api/tasks/{id}` - Delete a specific task
- `GET /api/tasks/search?q={query}` - Search tasks by keyword
- `GET /api/tasks?category={category}` - Filter tasks by category
- `GET /api/tasks?status={status}` - Filter tasks by status

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Ensure PostgreSQL is running and credentials in `.env` are correct
2. **JWT Authentication Failing**: Verify that `BETTER_AUTH_SECRET` is the same in both frontend and backend
3. **Frontend Cannot Connect to Backend**: Check that both services are running and CORS settings are configured correctly

### Resetting Development Data
```bash
# Reset database (WARNING: This will delete all data)
python -m alembic downgrade base
python -m alembic upgrade head
```