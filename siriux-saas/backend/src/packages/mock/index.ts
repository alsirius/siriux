// Mock authentication system for development and testing
export * from './mockAuthConfig';
export * from './mockAuthService';
export * from './mockAuthMiddleware';

// Quick setup helpers
export { createMockAuthConfig, defaultMockAuthConfig, isMockMode, createSmartAuthConfig } from './mockAuthConfig';
export { MockAuthService } from './mockAuthService';
export { MockAuthMiddleware, createMockAuthMiddleware } from './mockAuthMiddleware';
