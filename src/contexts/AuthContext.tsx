import { createContext, useContext, useState, type ReactNode } from 'react';
import apiClient from '../services/apiClient.ts';
import type { LoginResponse } from '../types/auth.ts';

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  updateUser: (userData: Partial<LoginResponse>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const storedAuth = localStorage.getItem('auth');

    if (storedAuth) {
      try {
        const userData: LoginResponse = JSON.parse(storedAuth);
        apiClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${userData.accessToken}`;
        return userData;
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('auth');
        return null;
      }
    }
    return null;
  });

  const handleSetUser = (userData: LoginResponse | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('auth', JSON.stringify(userData));
      apiClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${userData.accessToken}`;
    } else {
      localStorage.removeItem('auth');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const login = (userData: LoginResponse) => {
    handleSetUser(userData);
  };

  const logout = () => {
    handleSetUser(null);
  };

  const updateUser = (userData: Partial<LoginResponse>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      handleSetUser(updatedUser);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
