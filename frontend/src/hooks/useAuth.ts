// frontend/src/hooks/useAuth.ts
// This file is deprecated. Use the context-based auth from '@/context/auth-context' instead.
// Keeping this file for backward compatibility until all references are updated.
console.warn('Using deprecated hook. Please migrate to context-based auth from "@/context/auth-context".');

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user info
      const fetchUser = async () => {
        try {
          const userData: any = await apiClient.getCurrentUser();
          setUser(userData.data);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response: any = await apiClient.login({ email, password });

    if (response.data && response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      setUser(response.data.user);
    }
  };

  const register = async (userData: { email: string; password: string; first_name?: string; last_name?: string }) => {
    const response: any = await apiClient.register(userData);

    if (response.data && response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      setUser(response.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };
};