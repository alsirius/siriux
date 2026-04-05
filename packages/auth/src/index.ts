// Core exports
export * from './types';
export * from './middleware';
export * from './mock';

// Re-export commonly used classes and functions
export { AuthenticationError, AuthMiddleware, createAuthMiddleware } from './middleware/auth';
export { UserRole, JwtPayload, AuthenticatedUser, AuthTokens, AuthConfig } from './types';

// Mock exports for development
export { 
  createMockAuthConfig, 
  defaultMockAuthConfig, 
  isMockMode, 
  createSmartAuthConfig,
  MockAuthService,
  MockAuthMiddleware,
  createMockAuthMiddleware 
} from './mock';

// Version information
export const SIRIUX_AUTH_VERSION = '1.0.0';

// Default configuration helper
import { AuthConfig } from './types';

export const createDefaultAuthConfig = (overrides: Partial<AuthConfig>): AuthConfig => {
  const defaultConfig: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    tokenExpiry: '24h',
    refreshExpiry: '7d',
    issuer: 'siriux',
    audience: 'siriux-users'
  };

  return { ...defaultConfig, ...overrides };
};
