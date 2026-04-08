'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Global SSR-safe useContext wrapper
const safeUseContext = <T,>(context: React.Context<T | undefined>): T => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // During SSR, return default values
    return defaultAuthContext as T;
  }
  
  const contextValue = useContext(context);
  if (contextValue === undefined) {
    // If context is undefined, return default values instead of throwing error
    return defaultAuthContext as T;
  }
  return contextValue;
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

// Create a default context value for SSR
const defaultAuthContext: AuthContextType = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  updateProfile: async () => {}
};

// Only create context on client side
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
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user && !!tokens;

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('siriux_tokens');
    const storedUser = localStorage.getItem('siriux_user');

    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);
        
        // Check if tokens are still valid
        if (parsedTokens.accessToken) {
          setTokens(parsedTokens);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('siriux_tokens');
        localStorage.removeItem('siriux_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      setUser(data.user);
      setTokens(data.tokens);
      
      localStorage.setItem('siriux_tokens', JSON.stringify(data.tokens));
      localStorage.setItem('siriux_user', JSON.stringify(data.user));
      
      onAuthChange?.(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      setUser(data.user);
      setTokens(data.tokens);
      
      localStorage.setItem('siriux_tokens', JSON.stringify(data.tokens));
      localStorage.setItem('siriux_user', JSON.stringify(data.user));
      
      onAuthChange?.(data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('siriux_tokens');
    localStorage.removeItem('siriux_user');
    onAuthChange?.(null);
  };

  const refreshToken = async () => {
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
      
      setTokens(data.tokens);
      localStorage.setItem('siriux_tokens', JSON.stringify(data.tokens));
      
      return data.tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const updatedUser = await response.json();
      
      setUser(updatedUser);
      localStorage.setItem('siriux_user', JSON.stringify(updatedUser));
      
      onAuthChange?.(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    loading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the safe useContext wrapper
export const useAuth = (): AuthContextType => {
  return safeUseContext(AuthContext);
};
