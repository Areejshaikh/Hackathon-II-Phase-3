# Quickstart Guide: Auth UI Enhancement

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- Git for version control
- Access to the backend API server

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install frontend dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Todo SaaS"
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

### 3. Run Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev

# The app will be available at http://localhost:3000
```

## Key Features Implementation

### Authentication Flow

1. **Login Process**:
   - Navigate to `/auth/signin`
   - Submit email and password
   - On success, user is redirected to `/dashboard`

2. **Signup Process**:
   - Navigate to `/auth/signup`
   - Submit registration details
   - On success, user is redirected to `/dashboard`

3. **Protected Routes**:
   - All routes under `/dashboard/*` are protected
   - Unauthenticated users are redirected to `/auth/signin`

### Navigation System

1. **Sticky Navbar**:
   - Available on all pages
   - Includes Home, Blog, Cart, Dashboard links
   - User profile dropdown with logout option

2. **Responsive Design**:
   - Mobile-friendly navigation with hamburger menu
   - Desktop navigation with full menu items

### Home Page Enhancement

1. **Animated Hero Section**:
   - Framer Motion animations
   - Engaging visual elements
   - Clear call-to-action button

2. **Smart Navigation Button**:
   - Checks authentication status
   - Redirects to dashboard if logged in
   - Redirects to signin if not logged in

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Testing the Implementation

### Manual Testing Steps

1. **Verify Authentication Flows**:
   - Test login with valid credentials → should redirect to dashboard
   - Test login with invalid credentials → should show error
   - Test signup flow → should redirect to dashboard
   - Test protected route access when unauthenticated → should redirect to signin

2. **Verify Navigation**:
   - Check sticky navbar on all pages
   - Test all navigation links
   - Verify user profile dropdown functionality
   - Test responsive navigation on mobile

3. **Verify UI Enhancements**:
   - Check animated hero section on home page
   - Verify glassmorphism effects in navbar
   - Test smart navigation button behavior
   - Confirm responsive design across screen sizes

### API Testing

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test registration endpoint
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","name":"New User"}'

# Test user info endpoint (with token)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Common Issues

1. **Auth API Endpoints Not Working**:
   - Verify backend server is running
   - Check `NEXT_PUBLIC_API_BASE_URL` in environment variables
   - Confirm endpoint paths match backend implementation

2. **Redirects Not Working**:
   - Check authentication state management
   - Verify router implementation in components
   - Ensure proper error handling

3. **UI Elements Not Styled Correctly**:
   - Confirm Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify glassmorphism classes are applied correctly

### Debugging Tips

1. Check browser console for JavaScript errors
2. Use browser dev tools to inspect network requests
3. Enable Next.js debug mode: `DEBUG=next:* npm run dev`
4. Verify API endpoints with tools like Postman