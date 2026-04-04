// Core exports
export * from './types';
export * from './auth/middleware';

// Re-export commonly used classes and functions
export { AuthenticationError, AuthMiddleware, createAuthMiddleware } from './auth/middleware';
export { UserRole, JwtPayload, AuthenticatedUser, AuthTokens, SiriuxConfig } from './types';

// Version information
export const SIRIUX_CORE_VERSION = '1.0.0';

// Default configuration helper
import { SiriuxConfig } from './types';

export const createDefaultConfig = (overrides: Partial<SiriuxConfig>): SiriuxConfig => {
  const defaultConfig: SiriuxConfig = {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    database: {
      type: 'sqlite',
      connection: './database.sqlite',
      options: {}
    },
    features: {
      mfa: false,
      sso: false,
      rbac: true,
      emailVerification: true
    }
  };

  return { ...defaultConfig, ...overrides };
};
