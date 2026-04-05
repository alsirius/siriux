'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'manager';
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Demo users database
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@siriux.dev',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const
  },
  {
    id: '2',
    email: 'user@siriux.dev',
    password: 'user123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user' as const
  },
  {
    id: '3',
    email: 'manager@siriux.dev',
    password: 'manager123',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager' as const
  }
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const DemoAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  // Generate mock tokens
  const generateTokens = (userData: User): AuthTokens => ({
    accessToken: `mock_access_token_${userData.id}_${Date.now()}`,
    refreshToken: `mock_refresh_token_${userData.id}_${Date.now()}`
  });

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in demo database
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (!demoUser) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      
      const userData: User = {
        id: demoUser.id,
        email: demoUser.email,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        role: demoUser.role
      };
      
      const tokenData = generateTokens(userData);
      
      setUser(userData);
      setTokens(tokenData);
      
      // Store in localStorage for persistence
      localStorage.setItem('demo_tokens', JSON.stringify(tokenData));
      localStorage.setItem('demo_user', JSON.stringify(userData));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, just create a new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user'
      };
      
      const tokenData = generateTokens(newUser);
      
      setUser(newUser);
      setTokens(tokenData);
      
      localStorage.setItem('demo_tokens', JSON.stringify(tokenData));
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('demo_tokens');
    localStorage.removeItem('demo_user');
  };

  const refreshToken = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const tokenData = generateTokens(user);
      setTokens(tokenData);
      localStorage.setItem('demo_tokens', JSON.stringify(tokenData));
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for stored auth data on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('demo_tokens');
    const storedUser = localStorage.getItem('demo_user');
    
    if (storedTokens && storedUser) {
      try {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Clear invalid stored data
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
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useDemoAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};
