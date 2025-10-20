import { useState, useEffect, type ReactNode } from 'react';
import { authApi, tokenManager } from '../api';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User, LoginFormData, RegisterFormData } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      
      // Store token
      tokenManager.setToken(response.data.token);
      
      // Set user data
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(data);
      
      // Store token
      tokenManager.setToken(response.data.token);
      
      // Set user data
      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    tokenManager.clearToken();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      const token = tokenManager.getToken();
      
      if (token) {
        try {
          // Verify token and get user data
          const response = await authApi.me();
          setUser(response.data);
        } catch {
          // Token is invalid, clear it
          tokenManager.clearToken();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

