'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

// Simple context like ticket-mix - no SSR-safe wrappers
const AuthContext = createContext<AuthContextType>({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  updateProfile: async () => {}
});

export const useDemoAuth = () => useContext(AuthContext);

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('demo_tokens', JSON.stringify(userTokens));
        localStorage.setItem('demo_user', JSON.stringify(foundUser));
      }
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_tokens', JSON.stringify(userTokens));
      localStorage.setItem('demo_user', JSON.stringify(newUser));
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_tokens');
      localStorage.removeItem('demo_user');
    }
  };

  const refreshToken = async (): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTokens = generateTokens(user.id);
    setTokens(newTokens);
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_tokens', JSON.stringify(newTokens));
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    }
  };

  // Check for stored auth data on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
