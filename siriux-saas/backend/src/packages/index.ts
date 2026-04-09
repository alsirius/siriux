// Core exports
export * from './types';

// Main config manager
export { ConfigManager, config, createConfig, loadConfig, createDefaultConfig, SiriuxConfig } from './ConfigManager';

// Logger
export { createLogger, SiriuxLogger } from './SiriuxLogger';
export type { Logger } from './types';

// Auth
export * from './middleware';

export function createDefaultAuthConfig(config?: any): any {
  return {
    jwtSecret: config?.jwtSecret || 'default-secret',
    jwtRefreshSecret: config?.jwtRefreshSecret || 'default-refresh-secret',
    jwtExpiry: config?.jwtExpiry || '24h',
    bcryptRounds: config?.bcryptRounds || 10
  };
}

export function createAuthMiddleware(config?: any): any {
  return {
    tokenAuth: (req: any, res: any, next: any) => {
      // Real auth middleware will be implemented
      next();
    }
  };
}

// Database
export { PostgresDatabase, getPostgresConfig } from './types';

// Version information
export const SIRIUX_CONFIG_VERSION = '1.0.0';
