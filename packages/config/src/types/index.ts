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

export interface SiriuxConfig {
  app: AppConfig;
  server: ServerConfig;
  database: DatabaseConfig;
  redis?: RedisConfig;
  email?: EmailConfig;
  storage?: StorageConfig;
  auth: AuthConfig;
  logging: LoggingConfig;
  features: FeatureFlags;
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
