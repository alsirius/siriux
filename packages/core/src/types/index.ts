// Core Siriux contracts and interfaces
// This is the stable center that all other packages depend on

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager' // Extended role for future use
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthenticatedUser;
  tokens?: AuthTokens;
  error?: string;
}

// Database contracts
export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  connection: string;
  options?: Record<string, any>;
}

// Configuration contracts
export interface BaseSiriuxConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  database: DatabaseConfig;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface FeatureFlags {
  mfa?: boolean;
  sso?: boolean;
  rbac?: boolean;
  emailVerification?: boolean;
  auditLogging?: boolean;
  analytics?: boolean;
}

export interface SiriuxConfig extends BaseSiriuxConfig {
  email?: EmailConfig;
  features?: FeatureFlags;
}

// Error handling contracts
export interface SiriuxError {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: SiriuxError;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
    timestamp: string;
  };
}

// Lifecycle hooks contracts
export interface LifecycleHooks {
  beforeAuth?: (credentials: LoginCredentials) => Promise<void>;
  afterAuth?: (user: AuthenticatedUser) => Promise<void>;
  beforeLogout?: (user: AuthenticatedUser) => Promise<void>;
  afterLogout?: (userId: string) => Promise<void>;
}

// Dependency injection contracts
export interface ServiceContainer {
  get<T>(key: string): T;
  register<T>(key: string, factory: () => T): void;
}

// Event system contracts
export interface EventBus {
  emit<T>(event: string, data: T): void;
  on<T>(event: string, handler: (data: T) => void): void;
  off<T>(event: string, handler: (data: T) => void): void;
}

// Logging contracts
export interface Logger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
}

// Plugin system contracts
export interface Plugin {
  name: string;
  version: string;
  initialize(container: ServiceContainer): Promise<void>;
  destroy(): Promise<void>;
}

export interface PluginManager {
  load(plugin: Plugin): Promise<void>;
  unload(pluginName: string): Promise<void>;
  getLoadedPlugins(): string[];
}
