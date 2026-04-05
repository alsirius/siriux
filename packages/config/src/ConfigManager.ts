import Joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';
import { 
  SiriuxConfig, 
  EnvironmentVariables, 
  ValidationResult, 
  ConfigLoaderOptions,
  DatabaseConfig,
  AuthConfig,
  LoggingConfig,
  FeatureFlags,
  AppConfig,
  ServerConfig
} from './types';

export class ConfigManager {
  private config: SiriuxConfig | null = null;
  private validationErrors: string[] = [];
  private validationWarnings: string[] = [];

  constructor(private options: ConfigLoaderOptions = {}) {
    this.loadEnvironment();
  }

  // Load configuration
  load(): SiriuxConfig {
    if (this.config) {
      return this.config;
    }

    this.config = this.buildConfig();
    
    if (this.options.validate !== false) {
      const validation = this.validate();
      if (!validation.valid) {
        throw new Error(`Configuration validation failed:\n${validation.errors.join('\n')}`);
      }
    }

    return this.config;
  }

  // Get configuration value by path
  get<T = any>(path: string): T {
    const config = this.load();
    return this.getNestedValue(config, path);
  }

  // Validate configuration
  validate(): ValidationResult {
    if (!this.config) {
      return { valid: false, errors: ['Configuration not loaded'], warnings: [] };
    }

    const schema = this.getConfigSchema();
    const { error, warning } = schema.validate(this.config, { 
      allowUnknown: true,
      stripUnknown: true 
    });

    this.validationErrors = error ? error.details.map(d => d.message) : [];
    this.validationWarnings = warning ? warning.details.map(d => d.message) : [];

    return {
      valid: this.validationErrors.length === 0,
      errors: this.validationErrors,
      warnings: this.validationWarnings
    };
  }

  // Reload configuration
  reload(): SiriuxConfig {
    this.config = null;
    this.validationErrors = [];
    this.validationWarnings = [];
    return this.load();
  }

  // Private methods
  private loadEnvironment(): void {
    const envFile = this.options.envFile || '.env';
    const envPath = path.resolve(process.cwd(), envFile);
    
    dotenv.config({ path: envPath });
  }

  private buildConfig(): SiriuxConfig {
    const env = process.env as any;

    return {
      app: this.buildAppConfig(env),
      server: this.buildServerConfig(env),
      database: this.buildDatabaseConfig(env),
      redis: this.buildRedisConfig(env),
      email: this.buildEmailConfig(env),
      storage: this.buildStorageConfig(env),
      auth: this.buildAuthConfig(env),
      logging: this.buildLoggingConfig(env),
      features: this.buildFeatureFlags(env),
      ...this.options.override
    };
  }

  private buildAppConfig(env: any): AppConfig {
    return {
      name: env.APP_NAME || 'Siriux App',
      version: env.APP_VERSION || '1.0.0',
      environment: env.NODE_ENV || 'development',
      url: env.APP_URL || 'http://localhost:3000',
      supportEmail: env.SUPPORT_EMAIL || 'support@example.com',
      timezone: env.TIMEZONE || 'UTC',
      currency: env.CURRENCY || 'USD',
      locale: env.LOCALE || 'en-US'
    };
  }

  private buildServerConfig(env: any): ServerConfig {
    return {
      port: parseInt(env.PORT || '3000'),
      host: env.HOST || 'localhost',
      cors: {
        origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
        credentials: env.CORS_CREDENTIALS === 'true'
      },
      rateLimit: env.RATE_LIMIT_WINDOW_MS && env.RATE_LIMIT_MAX ? {
        windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
        max: parseInt(env.RATE_LIMIT_MAX)
      } : undefined,
      compression: env.COMPRESSION !== 'false',
      helmet: env.HELMET !== 'false'
    };
  }

  private buildDatabaseConfig(env: any): DatabaseConfig {
    return {
      type: (env.DB_TYPE as any) || 'postgresql',
      host: env.DB_HOST || 'localhost',
      port: parseInt(env.DB_PORT || '5432'),
      database: env.DB_NAME || 'siriux',
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      ssl: env.DB_SSL === 'true',
      pool: {
        min: parseInt(env.DB_POOL_MIN || '2'),
        max: parseInt(env.DB_POOL_MAX || '10'),
        idle: parseInt(env.DB_POOL_IDLE || '10000')
      }
    };
  }

  private buildRedisConfig(env: any) {
    if (!env.REDIS_HOST) return undefined;
    
    return {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT || '6379'),
      password: env.REDIS_PASSWORD,
      db: parseInt(env.REDIS_DB || '0'),
      keyPrefix: env.REDIS_KEY_PREFIX || 'siriux:'
    };
  }

  private buildEmailConfig(env: any) {
    if (!env.EMAIL_PROVIDER) return undefined;

    const baseConfig = {
      from: {
        email: env.EMAIL_FROM_EMAIL || 'noreply@example.com',
        name: env.EMAIL_FROM_NAME || 'Siriux App'
      },
      replyTo: env.EMAIL_REPLY_TO_EMAIL ? {
        email: env.EMAIL_REPLY_TO_EMAIL,
        name: env.EMAIL_REPLY_TO_NAME || env.EMAIL_FROM_NAME
      } : undefined
    };

    switch (env.EMAIL_PROVIDER) {
      case 'smtp':
        return {
          ...baseConfig,
          provider: 'smtp' as const,
          smtp: {
            host: env.SMTP_HOST!,
            port: parseInt(env.SMTP_PORT || '587'),
            secure: env.SMTP_SECURE === 'true',
            auth: {
              user: env.SMTP_USER!,
              pass: env.SMTP_PASS!
            }
          }
        };
      
      case 'sendgrid':
        return {
          ...baseConfig,
          provider: 'sendgrid' as const,
          sendgrid: {
            apiKey: env.SENDGRID_API_KEY!
          }
        };
      
      case 'ses':
        return {
          ...baseConfig,
          provider: 'ses' as const,
          ses: {
            region: env.SES_REGION!,
            accessKeyId: env.SES_ACCESS_KEY_ID!,
            secretAccessKey: env.SES_SECRET_ACCESS_KEY!
          }
        };
      
      default:
        return undefined;
    }
  }

  private buildStorageConfig(env: any) {
    if (!env.STORAGE_PROVIDER) return undefined;

    switch (env.STORAGE_PROVIDER) {
      case 'local':
        return {
          provider: 'local' as const,
          local: {
            path: env.STORAGE_LOCAL_PATH || './uploads'
          }
        };
      
      case 's3':
        return {
          provider: 's3' as const,
          s3: {
            bucket: env.AWS_S3_BUCKET!,
            region: env.AWS_REGION!,
            accessKeyId: env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY!
          }
        };
      
      default:
        return undefined;
    }
  }

  private buildAuthConfig(env: any): AuthConfig {
    return {
      jwtSecret: env.JWT_SECRET || 'your-super-secret-jwt-key',
      jwtRefreshSecret: env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
      jwtExpiry: env.JWT_EXPIRY || '24h',
      jwtRefreshExpiry: env.JWT_REFRESH_EXPIRY || '7d',
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      bcryptRounds: parseInt(env.BCRYPT_ROUNDS || '12'),
      maxLoginAttempts: parseInt(env.MAX_LOGIN_ATTEMPTS || '5'),
      lockoutDuration: parseInt(env.LOCKOUT_DURATION || '900000'), // 15 minutes
      passwordPolicy: {
        minLength: parseInt(env.PASSWORD_MIN_LENGTH || '8'),
        requireUppercase: env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
        requireLowercase: env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
        requireNumbers: env.PASSWORD_REQUIRE_NUMBERS !== 'false',
        requireSymbols: env.PASSWORD_REQUIRE_SYMBOLS !== 'false'
      }
    };
  }

  private buildLoggingConfig(env: any): LoggingConfig {
    return {
      level: (env.LOG_LEVEL as any) || 'info',
      format: (env.LOG_FORMAT as any) || 'json',
      transports: [
        {
          type: 'console' as const
        },
        ...(env.LOG_FILE ? [{
          type: 'file' as const,
          options: { filename: env.LOG_FILE }
        }] : [])
      ]
    };
  }

  private buildFeatureFlags(env: any): FeatureFlags {
    return {
      authentication: env.ENABLE_AUTH !== 'false',
      userManagement: env.ENABLE_USER_MANAGEMENT !== 'false',
      analytics: env.ENABLE_ANALYTICS === 'true',
      blog: env.ENABLE_BLOG === 'true',
      marketplace: env.ENABLE_MARKETPLACE === 'true',
      forums: env.ENABLE_FORUMS === 'true',
      events: env.ENABLE_EVENTS === 'true',
      newsletter: env.ENABLE_NEWSLETTER === 'true',
      payments: env.ENABLE_PAYMENTS === 'true',
      notifications: env.ENABLE_NOTIFICATIONS === 'true',
      apiRateLimiting: env.ENABLE_RATE_LIMITING !== 'false',
      auditLogging: env.ENABLE_AUDIT_LOGGING === 'true',
      multiTenant: env.ENABLE_MULTI_TENANT === 'true',
      whiteLabel: env.ENABLE_WHITE_LABEL === 'true'
    };
  }

  private getConfigSchema(): Joi.ObjectSchema {
    return Joi.object({
      app: Joi.object({
        name: Joi.string().required(),
        version: Joi.string().required(),
        environment: Joi.string().valid('development', 'staging', 'production').required(),
        url: Joi.string().uri().required(),
        supportEmail: Joi.string().email().required(),
        timezone: Joi.string().required(),
        currency: Joi.string().required(),
        locale: Joi.string().required()
      }).required(),

      server: Joi.object({
        port: Joi.number().port().required(),
        host: Joi.string().required(),
        cors: Joi.object({
          origin: Joi.alternatives().try(
            Joi.string().uri(),
            Joi.array().items(Joi.string().uri())
          ).required(),
          credentials: Joi.boolean().required()
        }).required(),
        rateLimit: Joi.object({
          windowMs: Joi.number().required(),
          max: Joi.number().required()
        }).optional(),
        compression: Joi.boolean().required(),
        helmet: Joi.boolean().required()
      }).required(),

      database: Joi.object({
        type: Joi.string().valid('postgresql', 'mysql', 'sqlite', 'mongodb').required(),
        host: Joi.string().required(),
        port: Joi.number().required(),
        database: Joi.string().required(),
        username: Joi.string().optional(),
        password: Joi.string().optional(),
        ssl: Joi.boolean().optional(),
        pool: Joi.object({
          min: Joi.number().required(),
          max: Joi.number().required(),
          idle: Joi.number().required()
        }).required()
      }).required(),

      auth: Joi.object({
        jwtSecret: Joi.string().min(32).required(),
        jwtRefreshSecret: Joi.string().min(32).required(),
        jwtExpiry: Joi.string().required(),
        jwtRefreshExpiry: Joi.string().required(),
        issuer: Joi.string().optional(),
        audience: Joi.string().optional(),
        bcryptRounds: Joi.number().min(10).max(15).required(),
        maxLoginAttempts: Joi.number().min(1).required(),
        lockoutDuration: Joi.number().min(0).required(),
        passwordPolicy: Joi.object({
          minLength: Joi.number().min(6).required(),
          requireUppercase: Joi.boolean().required(),
          requireLowercase: Joi.boolean().required(),
          requireNumbers: Joi.boolean().required(),
          requireSymbols: Joi.boolean().required()
        }).required()
      }).required(),

      logging: Joi.object({
        level: Joi.string().valid('error', 'warn', 'info', 'debug').required(),
        format: Joi.string().valid('json', 'simple').required(),
        transports: Joi.array().items(
          Joi.object({
            type: Joi.string().valid('console', 'file', 'http').required(),
            options: Joi.object().optional()
          })
        ).required()
      }).required(),

      features: Joi.object({
        authentication: Joi.boolean().required(),
        userManagement: Joi.boolean().required(),
        analytics: Joi.boolean().required(),
        blog: Joi.boolean().required(),
        marketplace: Joi.boolean().required(),
        forums: Joi.boolean().required(),
        events: Joi.boolean().required(),
        newsletter: Joi.boolean().required(),
        payments: Joi.boolean().required(),
        notifications: Joi.boolean().required(),
        apiRateLimiting: Joi.boolean().required(),
        auditLogging: Joi.boolean().required(),
        multiTenant: Joi.boolean().required(),
        whiteLabel: Joi.boolean().required()
      }).required()
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Default config manager instance
export const config = new ConfigManager();

// Utility functions
export function createConfig(options?: ConfigLoaderOptions): ConfigManager {
  return new ConfigManager(options);
}

export function loadConfig(options?: ConfigLoaderOptions): SiriuxConfig {
  return new ConfigManager(options).load();
}
