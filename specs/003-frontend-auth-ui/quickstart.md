# Quickstart Guide: Todo Web UI with Better Auth Integration

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to the backend API (FastAPI server running)
- Better Auth secret key

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your_better_auth_secret_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Running the Application

### Development
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production
```bash
npm run build
npm run start
```

## API Usage

### Authentication
1. Navigate to the signup page to create a new account:
```
http://localhost:3000/signup
```

2. Login with your credentials:
```
http://localhost:3000/login
```

### Using the Application
Once logged in, you can:
- View your task list on the dashboard
- Create new tasks using the task form
- Update task status (mark as completed)
- Delete tasks

## API Client Integration

The application uses a centralized API client located at `/lib/api.ts` that automatically handles:
- JWT token attachment to requests
- Error handling
- Loading states

Example usage in a component:
```typescript
import { getTasks, createTask } from '../lib/api';

// Get user's tasks
const tasks = await getTasks();

// Create a new task
const newTask = await createTask({
  title: 'New task',
  description: 'Task description',
  status: 'pending'
});
```

## Testing
Run the test suite:
```bash
npm run test
# or
npm run test:watch  # for watch mode
```

## Building for Production
```bash
npm run build
```

## Deployment
The application is configured for deployment to Vercel, Netlify, or similar platforms that support Next.js applications.