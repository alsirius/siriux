'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  apiBaseUrl?: string;
  onAuthChange?: (user: User | null) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  apiBaseUrl = '/api',
  onAuthChange
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('siriux_tokens');
    const storedUser = localStorage.getItem('siriux_user');

    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);
        setTokens(parsedTokens);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('siriux_tokens');
    localStorage.removeItem('siriux_user');
    onAuthChange?.(null);
  };

  const storeAuthData = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('siriux_tokens', JSON.stringify(tokenData));
    localStorage.setItem('siriux_user', JSON.stringify(userData));
    onAuthChange?.(userData);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      
      if (data.success && data.data?.user && data.data?.token) {
        // Handle legacy single token format
        const tokenData: AuthTokens = {
          accessToken: data.data.token,
          refreshToken: data.data.refreshToken || data.data.token
        };
        storeAuthData(data.data.user, tokenData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      
      if (data.success && data.data?.user && data.data?.token) {
        const tokenData: AuthTokens = {
          accessToken: data.data.token,
          refreshToken: data.data.refreshToken || data.data.token
        };
        storeAuthData(data.data.user, tokenData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearAuthData();
  };

  const refreshToken = async (): Promise<void> => {
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data?.token) {
        const newTokens: AuthTokens = {
          accessToken: data.data.token,
          refreshToken: data.data.refreshToken || tokens.refreshToken
        };
        setTokens(newTokens);
        localStorage.setItem('siriux_tokens', JSON.stringify(newTokens));
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      clearAuthData();
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user || !tokens) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${apiBaseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profile update failed');
      }

      const data = await response.json();
      
      if (data.success && data.data?.user) {
        const updatedUser = { ...user, ...data.data.user };
        setUser(updatedUser);
        localStorage.setItem('siriux_user', JSON.stringify(updatedUser));
        onAuthChange?.(updatedUser);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    loading: false,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
