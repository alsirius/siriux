// Core Siriux contracts and interfaces
export * from './types';

// Re-export mock database functionality
export { 
  MockDatabase,
  MockUser,
  MockSession
} from './mock/mockDatabase';
export {
  MockDatabaseFactory,
  DatabaseType
} from './mock/mockDatabaseFactory';
export { InMemoryMockDatabase } from './mock/inMemoryMockDatabase';

// Re-export Snowflake database
export {
  SnowflakeDatabase,
  getSnowflakeConfig
} from './databases/snowflakeDatabase';

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
      emailVerification: true,
      auditLogging: false,
      analytics: false
    }
  };

  return { ...defaultConfig, ...overrides };
};
