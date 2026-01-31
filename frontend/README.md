# Todo Frontend Application

This is a Next.js application for the Todo Web UI with Better Auth Integration.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Create a `.env.local` file in the frontend directory with the following content:
   ```
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   BETTER_AUTH_SECRET=your_better_auth_secret_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. Open your browser to http://localhost:3000 to view the application

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs the linter

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and API client
- `types/` - TypeScript type definitions

## Features

- Secure authentication with Better Auth
- Task management (Create, Read, Update, Delete)
- Responsive UI with Tailwind CSS
- JWT token handling for API requests
- User isolation (users can only access their own tasks)