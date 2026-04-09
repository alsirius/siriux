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
  private config: DatabaseConfig;
  private pool: any; // Will be replaced with actual pg Pool

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.pool = null;
  }

  async initialize(): Promise<void> {
    // TODO: Implement real PostgreSQL connection
    // For now, we'll create a placeholder that can be easily replaced
    console.log('Initializing PostgreSQL database with config:', {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database
    });
    
    // In production, this would be:
    // const { Pool } = require('pg');
    // this.pool = new Pool({
    //   host: this.config.host,
    //   port: this.config.port,
    //   database: this.config.database,
    //   user: this.config.username,
    //   password: this.config.password,
    //   ssl: this.config.ssl
    // });
    // await this.pool.connect();
  }

  async getUserById(id: string): Promise<any> {
    // TODO: Implement real query
    // const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    // return result.rows[0];
    console.log(`Getting user by ID: ${id}`);
    return null;
  }

  async getUserByEmail(email: string): Promise<any> {
    // TODO: Implement real query
    // const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    // return result.rows[0];
    console.log(`Getting user by email: ${email}`);
    return null;
  }

  async createUser(userData: any): Promise<any> {
    // TODO: Implement real query
    // const result = await this.pool.query(
    //   'INSERT INTO users (email, first_name, last_name, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
    //   [userData.email, userData.firstName, userData.lastName, userData.role, userData.isActive]
    // );
    // return result.rows[0];
    console.log(`Creating user:`, userData);
    return null;
  }

  async updateUser(id: string, updates: any): Promise<any> {
    // TODO: Implement real query
    console.log(`Updating user ${id}:`, updates);
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    // TODO: Implement real query
    console.log(`Deleting user: ${id}`);
    return true;
  }

  async getAllUsers(): Promise<any[]> {
    // TODO: Implement real query
    console.log('Getting all users');
    return [];
  }

  async getUsersByStatus(status: string): Promise<any[]> {
    // TODO: Implement real query
    console.log(`Getting users by status: ${status}`);
    return [];
  }

  async getRoleById(id: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Getting role by ID: ${id}`);
    return null;
  }

  async getRoleByName(name: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Getting role by name: ${name}`);
    return null;
  }

  async createRole(roleData: any): Promise<any> {
    // TODO: Implement real query
    console.log(`Creating role:`, roleData);
    return null;
  }

  async updateRole(id: string, updates: any): Promise<any> {
    // TODO: Implement real query
    console.log(`Updating role ${id}:`, updates);
    return null;
  }

  async deleteRole(id: string): Promise<boolean> {
    // TODO: Implement real query
    console.log(`Deleting role: ${id}`);
    return true;
  }

  async getAllRoles(): Promise<any[]> {
    // TODO: Implement real query
    console.log('Getting all roles');
    return [];
  }

  async getInvitationById(id: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Getting invitation by ID: ${id}`);
    return null;
  }

  async getInvitationByCode(code: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Getting invitation by code: ${code}`);
    return null;
  }

  async createInvitation(invitationData: any, createdBy?: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Creating invitation:`, invitationData, 'by:', createdBy);
    return null;
  }

  async updateInvitation(id: string, updates: any): Promise<any> {
    // TODO: Implement real query
    console.log(`Updating invitation ${id}:`, updates);
    return null;
  }

  async deleteInvitation(id: string): Promise<boolean> {
    // TODO: Implement real query
    console.log(`Deleting invitation: ${id}`);
    return true;
  }

  async getAllInvitations(): Promise<any[]> {
    // TODO: Implement real query
    console.log('Getting all invitations');
    return [];
  }

  async markInvitationAsUsed(id: string, usedBy: string): Promise<any> {
    // TODO: Implement real query
    console.log(`Marking invitation ${id} as used by ${usedBy}`);
    return null;
  }
}

export function getPostgresConfig(): DatabaseConfig {
  return {
    type: 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'siriux',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true'
  };
}

export function getSnowflakeConfig(): DatabaseConfig {
  return {
    type: 'snowflake',
    host: process.env.SNOWFLAKE_HOST || 'snowflakecomputing.com',
    port: 443,
    database: process.env.SNOWFLAKE_DATABASE || 'siriux',
    username: process.env.SNOWFLAKE_USERNAME || 'user',
    password: process.env.SNOWFLAKE_PASSWORD || 'password',
    ssl: true,
    account: process.env.SNOWFLAKE_ACCOUNT || 'account',
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'warehouse',
    schema: process.env.SNOWFLAKE_SCHEMA || 'public',
    role: process.env.SNOWFLAKE_ROLE || 'default'
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
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
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
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
    transports: Array<{
      type: 'console' | 'file' | 'http';
      options?: Record<string, any>;
    }>;
  };
  features: {
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
  };
}

// Configuration schema types
export interface DatabaseConfig {
  type: 'postgresql' | 'snowflake' | 'mongodb';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  // Snowflake specific
  account?: string;
  warehouse?: string;
  schema?: string;
  role?: string;
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
  description: string;
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
