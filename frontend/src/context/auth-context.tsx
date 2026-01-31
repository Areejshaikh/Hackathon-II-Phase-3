// frontend/src/context/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('authToken');
  
  const fetchUser = async () => {
    try {
      // Direct call karein, apiClient khud localStorage se token utha lega (jaisa aapki api.ts mein likha hai)
      const userData: any = await apiClient.getCurrentUser();
      
      // Check karein ke data kis format mein hai
      if (userData) {
        // Agar backend { success: true, data: { user } } bhej raha hai
        const user = userData.data || userData; 
        setUser(user);
      }
    } catch (error: any) {
      console.error("Auth verification failed:", error);
      // Sirf 401 par remove karein, warna network issue bhi ho sakta hai
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchUser();
  } else {
    setLoading(false);
  }
}, []); // Empty dependency array to prevent infinite loop

  // frontend/src/context/auth-context.tsx

const login = async (email: string, password: string) => {
  try {
    const response: any = await apiClient.login({ email, password });

    if (response && response.access_token) {
      // 1. Token save karein
      localStorage.setItem('authToken', response.access_token); // 'authToken' key use karein
      // 2. User state update karein
      setUser(response.user || response.data?.user);

      return response;
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
  const register = async (userData: { email: string; password: string; first_name?: string; last_name?: string }) => {
    const response: any = await apiClient.register(userData);

    if (response && response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      setUser(response.user || response.data?.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to invalidate session if needed
      await apiClient.logout().catch(() => {
        // If logout API fails, continue with client-side cleanup anyway
        console.warn('Logout API call failed, proceeding with local cleanup');
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clean up local storage and state
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};