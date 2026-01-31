# Quickstart Guide: Professional Todo SaaS Frontend Implementation

## Overview
This guide provides instructions for setting up and running the frontend of the Todo Pro application locally for development purposes.

## Prerequisites
- Node.js v18+ installed
- npm or yarn package manager
- Git
- Access to the backend API at http://localhost:8000/api/tasks

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend API URL and other configuration
```

## Configuration

### Frontend Configuration (.env)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Tailwind CSS Configuration (tailwind.config.js)
```js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
}
```

### PostCSS Configuration (postcss.config.js)
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Running the Application

### 1. Start the Frontend
```bash
# From the frontend directory
cd frontend

# Start the development server
npm run dev
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/tasks

## Running Tests

### Frontend Tests
```bash
# From the frontend directory
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reloading.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Linting
```bash
npm run lint
```
Checks for code style issues.

### Formatting
```bash
npm run format
```
Formats the code according to project standards.

## API Endpoints Used

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
- `PATCH /api/tasks/{id}/status` - Update task status

## Component Structure

### Landing Page Components
- `HeroSection` - Displays the main headline and CTA
- `FeaturesGrid` - Shows feature icons with descriptions
- `OnboardingSteps` - Explains the signup-to-productivity flow
- `Header` - Sticky header with navigation and auth buttons

### Dashboard Components
- `Sidebar` - Navigation sidebar with user profile
- `TaskSummaryCards` - Cards showing task counts (Total, Pending, Completed)
- `TaskList` - List of tasks with filtering options
- `TaskForm` - Form for creating/updating tasks
- `TaskTabs` - Tabs for filtering tasks by status

### Authentication Components
- `SignInForm` - Form for user sign-in
- `SignUpForm` - Form for user registration
- `ProtectedRoute` - Wrapper to protect authenticated routes
- `AuthHeader` - Header with logout button for authenticated users

## Troubleshooting

### Common Issues
1. **API Connection Error**: Ensure the backend server is running at http://localhost:8000
2. **JWT Authentication Failing**: Verify that the NEXTAUTH_SECRET is the same in both frontend and backend
3. **Styles Not Loading**: Check that Tailwind CSS is properly configured in tailwind.config.js
4. **Icons Not Showing**: Verify that lucide-react is properly installed and imported

### Development Tips
1. **Hot Reload**: Changes to components will automatically reload in the browser
2. **Console Errors**: Check browser console for API errors or component issues
3. **Network Tab**: Monitor API requests in browser dev tools to verify proper communication
4. **Environment Variables**: Ensure all required environment variables are set in .env file