import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string |null;
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

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('docflow_token')
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("========== AUTH INITIALIZATION ==========");
      console.log("Stored Token:", token);

      if (token) {
        try {
          console.log("Fetching user profile...");

          const profile = await authService.getProfile();

          console.log("Profile received:", profile);

          const userObj: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            createdAt: profile.createdAt,
          };

          setUser(userObj);
          localStorage.setItem('docflow_user', JSON.stringify(userObj));

          console.log("Session restored successfully.");
        } catch (error: any) {
          console.error("========== SESSION RESTORE FAILED ==========");
          console.error("Error:", error);
          console.error("Response:", error.response);
          console.error("Status:", error.response?.status);
          console.error("Data:", error.response?.data);

          logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    console.log("========== AUTH SUCCESS ==========");
    console.log("Token:", data.token);
    console.log("User:", data.user);

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem('docflow_token', data.token);
    localStorage.setItem('docflow_user', JSON.stringify(data.user));
  };

  const login = async (email: string, pass: string) => {
    console.log("========== LOGIN REQUEST ==========");
    console.log("Email:", email);

    try {
      const response = await authService.login({
        email,
        password: pass,
      });

      console.log("========== LOGIN SUCCESS ==========");
      console.log(response);

      handleAuthSuccess(response);

      toast.success(`Welcome back, ${response.user.name}!`);
    } catch (error: any) {
      console.error("========== LOGIN FAILED ==========");
      console.error("Full Error:", error);
      console.error("Response:", error.response);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      const msg =
        error.response?.data?.message || "Invalid email or password";

      console.error("Displayed Message:", msg);

      toast.error(msg);

      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string
  ) => {
    console.log("========== REGISTER REQUEST ==========");
    console.log({
      name,
      email,
    });

    try {
      const response = await authService.register({
        name,
        email,
        password: pass,
      });

      console.log("========== REGISTER SUCCESS ==========");
      console.log(response);

      handleAuthSuccess(response);

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("========== REGISTER FAILED ==========");
      console.error("Full Error:", error);
      console.error("Response:", error.response);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      const msg =
        error.response?.data?.message || "Registration failed";

      console.error("Displayed Message:", msg);

      toast.error(msg);

      throw error;
    }
  };

  const logout = () => {
    console.log("========== LOGOUT ==========");

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
