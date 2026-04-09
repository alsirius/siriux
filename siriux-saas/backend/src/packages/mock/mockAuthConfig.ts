import { AuthConfig } from '../types';

// Simple in-memory database interface
interface MockDatabase {
  initialize(): Promise<void>;
  getUserByEmail(email: string): Promise<any>;
  createSession(data: any): Promise<any>;
  getSessionByToken(token: string): Promise<any>;
  deleteSession(token: string): Promise<void>;
}

export interface MockAuthConfig extends AuthConfig {
  mockMode: boolean;
  mockDatabase?: MockDatabase;
  autoInitialize?: boolean;
}

export const createMockAuthConfig = (overrides: Partial<MockAuthConfig> = {}): MockAuthConfig => {
  const config: MockAuthConfig = {
    // Basic auth config
    jwtSecret: 'mock-jwt-secret-change-in-production',
    jwtRefreshSecret: 'mock-refresh-secret-change-in-production',
    tokenExpiry: '24h',
    refreshExpiry: '7d',
    
    // Mock-specific config
    mockMode: true,
    mockDatabase: undefined, // Will be set later
    autoInitialize: true,
    
    // Override with provided options
    ...overrides
  };

  // Auto-initialize mock database if enabled
  if (config.autoInitialize && config.mockDatabase) {
    config.mockDatabase.initialize().catch((error: any) => {
      console.error('Failed to initialize mock database:', error);
    });
  }

  return config;
};

// Default mock config
export const defaultMockAuthConfig = createMockAuthConfig();

// Environment detection
export const isMockMode = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.SIRIUX_MOCK_MODE === 'true' ||
    (typeof globalThis !== 'undefined' && 
     'location' in globalThis && 
     (globalThis as any).location.pathname.includes('/demo'))
  );
};

// Smart config creation
export const createSmartAuthConfig = (userConfig: Partial<AuthConfig> = {}): AuthConfig => {
  if (isMockMode()) {
    console.log('🎭 Using mock authentication mode');
    return createMockAuthConfig(userConfig);
  }
  
  console.log('🔐 Using production authentication mode');
  return {
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-in-production',
    tokenExpiry: process.env.JWT_EXPIRY || '24h',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    ...userConfig
  };
};
