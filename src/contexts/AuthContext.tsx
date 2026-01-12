import { createContext, useContext, useState, type ReactNode } from 'react';
import apiClient from '@/services/apiClient.ts';
import type { Token } from '@/types/auth';

interface AuthContextType {
  token: string | null;
  user: Token | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: Token | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      apiClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${storedToken}`;
      return storedToken;
    }
    return null;
  });

  const [user, setUserState] = useState<Token | null>(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('access_token', newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('access_token');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const setUser = (newUser: Token | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user_data', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user_data');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, setToken, setUser, logout }}
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
