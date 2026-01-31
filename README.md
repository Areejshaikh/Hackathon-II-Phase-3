# Todo Pro - Premium SaaS-style Todo Application

Welcome to Todo Pro, a premium SaaS-style todo application built with Next.js, FastAPI, and modern web technologies.

## Features

- **Landing Page**: Attractive landing page with hero section, features grid, and onboarding steps
- **Authentication**: Secure user registration and login with JWT-based session management
- **Dashboard**: Professional dashboard with sidebar navigation and task management
- **Task Management**: Create, view, update, and delete tasks with status tracking and filtering
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices
- **Modern UI**: "Slate & Indigo" color palette with subtle animations and clean design

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python 3.11, SQLModel, PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Styling**: Tailwind CSS with "Slate & Indigo" theme

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.11+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details and other configurations
   ```

6. Run the application:
   ```bash
   python -m uvicorn src.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL and other configurations
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
todo-pro/
├── backend/
│   ├── src/
│   │   ├── models/      # Data models
│   │   ├── services/    # Business logic
│   │   ├── api/         # API endpoints
│   │   ├── database/    # Database configuration
│   │   └── main.py      # Application entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utilities and API client
│   │   ├── styles/      # Global styles
│   │   └── types/       # TypeScript types
│   ├── package.json
│   └── tailwind.config.js
└── specs/               # Feature specifications
    └── 004-saas-todo-app/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout and invalidate session
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task
- `DELETE /api/tasks/{id}` - Delete a specific task
- `PATCH /api/tasks/{id}/status` - Update task status
- `GET /api/tasks/categories` - Get task categories with counts
- `GET /api/tasks/stats` - Get task statistics

## Contributing

We welcome contributions to Todo Pro! Please see our contributing guidelines for more information.

## License

This project is licensed under the MIT License.