# Quickstart Guide: Todo Backend API

## Prerequisites
- Python 3.11+
- pip package manager
- Neon PostgreSQL database instance
- Better Auth secret key

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
BETTER_AUTH_SECRET=your_jwt_secret_key_here
```

## Running the Application

### Development
```bash
uvicorn backend.main:app --reload --port 8000
```

### Production
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## API Usage

### Authentication
1. Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

2. Login to get JWT token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Using the API
Include the JWT token in the Authorization header for all requests:

```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Testing
Run the test suite:
```bash
pytest
```

## Database Migrations
Apply database migrations:
```bash
# This would be implemented based on your migration tool
```