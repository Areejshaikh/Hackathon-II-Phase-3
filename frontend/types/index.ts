// Type definitions for the Todo application

export interface User {
  id: string;
  email: string;
  name?: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}