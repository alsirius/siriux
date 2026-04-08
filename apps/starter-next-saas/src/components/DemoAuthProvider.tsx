'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Global SSR-safe useContext wrapper
const safeUseContext = <T,>(context: React.Context<T>): T => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // During SSR, return default values
    return defaultAuthContext as T;
  }
  
  const contextValue = useContext(context);
  if (contextValue === undefined || contextValue === null) {
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Create a default context value for SSR
const defaultAuthContext: AuthContextType = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  updateProfile: async () => {}
};

// Only create context on client side
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const DemoAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const generateTokens = (userId: string): AuthTokens => {
    return {
      accessToken: `demo_access_${userId}_${Date.now()}`,
      refreshToken: `demo_refresh_${userId}_${Date.now()}`,
    };
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo users
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'admin@siriux.dev',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@siriux.dev',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'manager@siriux.dev',
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const foundUser = demoUsers.find(u => u.email === email);
    
    if (foundUser) {
      // Check password (hardcoded for demo)
      const validPasswords: Record<string, string> = {
        'admin@siriux.dev': 'admin123',
        'user@siriux.dev': 'user123',
        'manager@siriux.dev': 'manager123'
      };
      
      if (validPasswords[email] !== password) {
        throw new Error('Invalid credentials');
      }
      const userTokens = generateTokens(foundUser.id);
      setUser(foundUser);
      setTokens(userTokens);
      
      // Store in localStorage for persistence
      localStorage.setItem('demo_tokens', JSON.stringify(userTokens));
      localStorage.setItem('demo_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userTokens = generateTokens(newUser.id);
    setUser(newUser);
    setTokens(userTokens);
    
    // Store in localStorage
    localStorage.setItem('demo_tokens', JSON.stringify(userTokens));
    localStorage.setItem('demo_user', JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('demo_tokens');
    localStorage.removeItem('demo_user');
  };

  const refreshToken = async (): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTokens = generateTokens(user.id);
    setTokens(newTokens);
    localStorage.setItem('demo_tokens', JSON.stringify(newTokens));
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem('demo_user', JSON.stringify(updatedUser));
  };

  // Check for stored auth data on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('demo_tokens');
    const storedUser = localStorage.getItem('demo_user');
    
    if (storedTokens && storedUser) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        const parsedUser = JSON.parse(storedUser);
        
        setTokens(parsedTokens);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('demo_tokens');
        localStorage.removeItem('demo_user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the safe useContext wrapper
export const useDemoAuth = (): AuthContextType => {
  return safeUseContext(AuthContext);
};
