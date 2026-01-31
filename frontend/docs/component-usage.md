# Component Usage Guidelines

## Authentication Components

### AuthProvider
Wraps the application to provide authentication context to all components.

```jsx
import { AuthProvider } from '../components/AuthProvider';

export default function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### useAuth Hook
Access authentication state and functions in components.

```jsx
import { useAuth } from '../components/AuthProvider';

export default function MyComponent() {
  const { isLoggedIn, isLoading, login, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? <button onClick={logout}>Logout</button> : <div>Not logged in</div>}
    </div>
  );
}
```

## Navigation Components

### Navbar
A responsive navigation bar with glassmorphism effect.

```jsx
import Navbar from '../components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
```

### ProtectedRoute
Protect routes that require authentication.

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute fallbackUrl="/auth/signin">
      <div>
        {/* Protected content */}
      </div>
    </ProtectedRoute>
  );
}
```

## Form Components

### TaskForm
Form for creating new tasks.

```jsx
<TaskForm onTaskCreated={(newTask) => setTasks([...tasks, newTask])} />
```

### TaskItem
Display and manage individual tasks.

```jsx
<TaskItem
  task={task}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

## Styling Guidelines

### Colors
- Primary: `indigo-600` for buttons and highlights
- Background: `dark-bg` (deep dark slate #020617)
- Text: `slate-100` for primary, `slate-300` for secondary
- Glass containers: Use `glass-container` class with backdrop blur

### Glassmorphism Effect
Apply the glass effect using the utility class:

```jsx
<div className="glass-container p-6 rounded-xl border border-slate-700/50">
  {/* Content */}
</div>
```

### Responsive Design
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach with progressive enhancement
- Flexible grids and containers that adapt to screen size

## Animations
- Use Framer Motion for entrance animations
- Keep animations subtle and purposeful
- Ensure animations don't impact performance