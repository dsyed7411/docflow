import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem('docflow_user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('docflow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          const userObj: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            createdAt: profile.createdAt,
          };
          setUser(userObj);
          localStorage.setItem('docflow_user', JSON.stringify(userObj));
        } catch (error) {
          console.error('Failed to restore session:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('docflow_token', data.token);
    localStorage.setItem('docflow_user', JSON.stringify(data.user));
  };

  const login = async (email: string, pass: string) => {
    try {
      const response = await authService.login({ email, password: pass });
      handleAuthSuccess(response);
      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const response = await authService.register({ name, email, password: pass });
      handleAuthSuccess(response);
      toast.success('Account created successfully!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('docflow_token');
    localStorage.removeItem('docflow_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
