// Authentication types
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthenticatedUser;
  tokens?: AuthTokens;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// Logging types
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  HTTP = 'http',
  VERBOSE = 'verbose',
  SILLY = 'silly'
}

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  service: string;
  environment: string;
  correlationId?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  version?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: any;
  };
}

export interface LoggerConfig {
  level: LogLevel;
  service: string;
  environment: string;
  outputs: LogOutput[];
  format?: LogFormat;
  metadata?: Record<string, any>;
  version?: string;
  correlationIdHeader?: string;
  userIdHeader?: string;
  requestIdHeader?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
  filePath?: string;
  maxFileSize?: string | number;
  maxFiles?: string | number;
  transports?: any[];
}

export interface LogMeta {
  [key: string]: any;
}

export interface CorrelationContext {
  correlationId: string;
  userId?: string;
  requestId?: string;
  startTime?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  metadata?: Record<string, any>;
  memoryUsage?: any;
  cpuUsage?: any;
  customMetrics?: any;
}

export enum LogOutput {
  CONSOLE = 'console',
  FILE = 'file',
  DATABASE = 'database',
  CLOUD = 'cloud'
}

export enum LogFormat {
  JSON = 'json',
  SIMPLE = 'simple'
}

export interface Logger {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta | Error): void;
  http(message: string, meta?: LogMeta): void;
  verbose(message: string, meta?: LogMeta): void;
  silly(message: string, meta?: LogMeta): void;
  child(meta: LogMeta): Logger;
  setCorrelationContext(context: Partial<CorrelationContext>): void;
  getCorrelationContext(): CorrelationContext | undefined;
  clearCorrelationContext(): void;
  logPerformance(operation: string, metrics: PerformanceMetrics): void;
}

export interface Formatter {
  format(entry: LogEntry): string;
}

// Database classes
export class PostgresDatabase {
  constructor(config: DatabaseConfig) {
    // Mock implementation
  }

  async initialize(): Promise<void> {
    // Mock initialization
  }

  async getUserById(id: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async getUserByEmail(email: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async createUser(userData: any): Promise<any> {
    // Mock implementation
    return null;
  }

  async updateUser(id: string, updates: any): Promise<any> {
    // Mock implementation
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async getAllUsers(): Promise<any[]> {
    // Mock implementation
    return [];
  }

  async getUsersByStatus(status: string): Promise<any[]> {
    // Mock implementation
    return [];
  }

  async getRoleById(id: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async getRoleByName(name: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async createRole(roleData: any): Promise<any> {
    // Mock implementation
    return null;
  }

  async updateRole(id: string, updates: any): Promise<any> {
    // Mock implementation
    return null;
  }

  async deleteRole(id: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async getAllRoles(): Promise<any[]> {
    // Mock implementation
    return [];
  }

  async getInvitationById(id: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async getInvitationByCode(code: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async createInvitation(invitationData: any, createdBy?: string): Promise<any> {
    // Mock implementation
    return null;
  }

  async updateInvitation(id: string, updates: any): Promise<any> {
    // Mock implementation
    return null;
  }

  async deleteInvitation(id: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async getAllInvitations(): Promise<any[]> {
    // Mock implementation
    return [];
  }

  async markInvitationAsUsed(id: string, usedBy: string): Promise<any> {
    // Mock implementation
    return null;
  }
}

export function getPostgresConfig(): DatabaseConfig {
  return {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'siriux',
    username: 'postgres',
    password: 'password'
  };
}

// Main configuration interface
export interface SiriuxConfig {
  app: {
    name: string;
    version: string;
    description: string;
    environment: string;
  };
  server: {
    port: number;
    host: string;
    cors: boolean;
    helmet: boolean;
  };
  database: DatabaseConfig;
  auth: {
    jwtSecret: string;
    jwtExpiry: string;
    bcryptRounds: number;
    jwtRefreshSecret?: string;
  };
  logging: {
    level: string;
    service: string;
    environment: string;
  };
  features: {
    enableRegistration: boolean;
    enableEmailVerification: boolean;
    enablePasswordReset: boolean;
    enableSocialLogin: boolean;
    enableAuditLogs: boolean;
    enableRateLimiting: boolean;
  };
}

// Configuration schema types
export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idle: number;
  };
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'ses' | 'mailgun';
  from: {
    email: string;
    name: string;
  };
  replyTo?: {
    email: string;
    name: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
  ses?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  mailgun?: {
    domain: string;
    apiKey: string;
  };
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'gcs' | 'azure';
  local?: {
    path: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  gcs?: {
    bucket: string;
    projectId: string;
    keyFilename: string;
  };
  azure?: {
    accountName: string;
    accountKey: string;
    container: string;
  };
}

export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiry: string;
  jwtRefreshExpiry: string;
  issuer?: string;
  audience?: string;
  bcryptRounds: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'simple';
  transports: Array<{
    type: 'console' | 'file' | 'http';
    options?: Record<string, any>;
  }>;
}

export interface FeatureFlags {
  authentication: boolean;
  userManagement: boolean;
  analytics: boolean;
  blog: boolean;
  marketplace: boolean;
  forums: boolean;
  events: boolean;
  newsletter: boolean;
  payments: boolean;
  notifications: boolean;
  apiRateLimiting: boolean;
  auditLogging: boolean;
  multiTenant: boolean;
  whiteLabel: boolean;
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  compression: boolean;
  helmet: boolean;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  url: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  locale: string;
}


// Environment variable schema
export interface EnvironmentVariables {
  // App
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: string;
  HOST: string;
  
  // Database
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_SSL?: string;
  
  // Redis
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  REDIS_PASSWORD?: string;
  REDIS_DB?: string;
  
  // Auth
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRY?: string;
  JWT_REFRESH_EXPIRY?: string;
  
  // Email
  EMAIL_PROVIDER?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SENDGRID_API_KEY?: string;
  SES_REGION?: string;
  SES_ACCESS_KEY_ID?: string;
  SES_SECRET_ACCESS_KEY?: string;
  
  // Storage
  STORAGE_PROVIDER?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;
  
  // Features
  ENABLE_AUTH?: string;
  ENABLE_ANALYTICS?: string;
  ENABLE_BLOG?: string;
  
  // Support
  SUPPORT_EMAIL?: string;
  APP_URL?: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Configuration loader options
export interface ConfigLoaderOptions {
  envFile?: string;
  override?: Partial<SiriuxConfig>;
  validate?: boolean;
}
