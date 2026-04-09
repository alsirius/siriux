# @siriux/config

Environment variables management and validation for Siriux applications.

## Installation

```bash
npm install @siriux/config
```

## Quick Start

```typescript
import { ConfigManager } from '@siriux/config';

// Load configuration
const config = new ConfigManager().load();

// Access configuration values
const dbConfig = config.get('database');
const port = config.get('server.port');
const jwtSecret = config.get('auth.jwtSecret');
```

## Features

- **Environment Variable Loading**: Automatic .env file loading
- **Schema Validation**: Joi-based configuration validation
- **Type Safety**: Full TypeScript interfaces
- **Feature Flags**: Easy feature toggling
- **Multiple Environments**: Development, staging, production support
- **Hot Reload**: Configuration reloading without restart

## Usage

### Basic Configuration

```typescript
import { ConfigManager } from '@siriux/config';

// Create config manager
const config = new ConfigManager({
  envFile: '.env.local',
  validate: true
});

// Load configuration
const appConfig = config.load();

// Access values
console.log(appConfig.database.host);
console.log(appConfig.auth.jwtSecret);
console.log(appConfig.features.authentication);
```

### Environment Variables

Create a `.env` file:

```bash
# App Configuration
NODE_ENV=development
PORT=3000
HOST=localhost
APP_URL=http://localhost:3000

# Database
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=siriux
DB_USERNAME=postgres
DB_PASSWORD=password

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Features
ENABLE_AUTH=true
ENABLE_ANALYTICS=false
ENABLE_BLOG=true
```

### Access Configuration

```typescript
import { config } from '@siriux/config';

// Get nested values
const dbHost = config.get('database.host');
const jwtExpiry = config.get('auth.jwtExpiry');
const authEnabled = config.get('features.authentication');

// Get entire section
const dbConfig = config.get('database');
const authConfig = config.get('auth');
```

### Configuration Validation

```typescript
const config = new ConfigManager({
  validate: true
});

try {
  const appConfig = config.load();
  console.log('Configuration is valid');
} catch (error) {
  console.error('Configuration validation failed:', error.message);
}
```

### Custom Overrides

```typescript
const config = new ConfigManager({
  override: {
    database: {
      host: 'custom-db-host',
      port: 5433
    },
    features: {
      analytics: true
    }
  }
});

const appConfig = config.load();
```

## Configuration Schema

### Application Configuration

```typescript
interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  url: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  locale: string;
}
```

### Server Configuration

```typescript
interface ServerConfig {
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
```

### Database Configuration

```typescript
interface DatabaseConfig {
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
```

### Authentication Configuration

```typescript
interface AuthConfig {
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
```

### Feature Flags

```typescript
interface FeatureFlags {
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
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `localhost` |
| `DB_TYPE` | Database type | `postgresql` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `siriux` |
| `JWT_SECRET` | JWT secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_URL` | Application URL | `http://localhost:3000` |
| `SUPPORT_EMAIL` | Support email | `support@example.com` |
| `JWT_EXPIRY` | JWT token expiry | `24h` |
| `JWT_REFRESH_EXPIRY` | JWT refresh expiry | `7d` |
| `ENABLE_AUTH` | Enable authentication | `true` |
| `ENABLE_ANALYTICS` | Enable analytics | `false` |
| `ENABLE_BLOG` | Enable blog | `false` |

### Database Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_SSL` | Use SSL connection | `false` |
| `DB_POOL_MIN` | Min pool connections | `2` |
| `DB_POOL_MAX` | Max pool connections | `10` |
| `DB_POOL_IDLE` | Pool idle timeout | `10000` |

### Redis Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host | - |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `REDIS_DB` | Redis database | `0` |
| `REDIS_KEY_PREFIX` | Key prefix | `siriux:` |

### Email Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_PROVIDER` | Email provider | - |
| `SMTP_HOST` | SMTP host | - |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `SENDGRID_API_KEY` | SendGrid API key | - |

## Advanced Usage

### Multiple Environment Files

```typescript
// Development
const devConfig = new ConfigManager({
  envFile: '.env.development'
});

// Production
const prodConfig = new ConfigManager({
  envFile: '.env.production'
});

// Custom
const customConfig = new ConfigManager({
  envFile: '.env.custom'
});
```

### Configuration Reloading

```typescript
const config = new ConfigManager();

// Initial load
const appConfig = config.load();

// Reload later
const newConfig = config.reload();
```

### Validation Results

```typescript
const config = new ConfigManager();
const validation = config.validate();

if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
  console.warn('Configuration warnings:', validation.warnings);
}
```

### Custom Validation Schema

```typescript
import Joi from 'joi';

const customConfig = new ConfigManager({
  validate: true,
  // Custom validation logic can be added here
});
```

## Examples

### Web Application

```typescript
import express from 'express';
import { ConfigManager } from '@siriux/config';

const app = express();
const config = new ConfigManager().load();

// Use configuration
app.listen(config.server.port, config.server.host, () => {
  console.log(`Server running on ${config.server.host}:${config.server.port}`);
  console.log(`Environment: ${config.app.environment}`);
  console.log(`Database: ${config.database.type}://${config.database.host}:${config.database.port}`);
});

// Feature flags
if (config.features.authentication) {
  // Setup authentication routes
}

if (config.features.analytics) {
  // Setup analytics tracking
}
```

### Database Connection

```typescript
import { ConfigManager } from '@siriux/config';
import { Pool } from 'pg';

const config = new ConfigManager().load();
const dbConfig = config.database;

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  ssl: dbConfig.ssl,
  max: dbConfig.pool?.max,
  min: dbConfig.pool?.min,
  idleTimeoutMillis: dbConfig.pool?.idle
});
```

### Email Service

```typescript
import { ConfigManager } from '@siriux/config';
import nodemailer from 'nodemailer';

const config = new ConfigManager().load();
const emailConfig = config.email;

if (emailConfig?.provider === 'smtp') {
  const transporter = nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    auth: {
      user: emailConfig.smtp.auth.user,
      pass: emailConfig.smtp.auth.pass
    }
  });
}
```

## Best Practices

### 1. Environment File Management

```bash
# .env.example (commit to repo)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
JWT_SECRET=your-secret-here

# .env.local (don't commit)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
JWT_SECRET=actual-secret-key
```

### 2. Use Type-Safe Access

```typescript
// Good
const dbConfig = config.get<DatabaseConfig>('database');

// Avoid
const dbHost = config.get('database.host') as string;
```

### 3. Validate in Production

```typescript
const config = new ConfigManager({
  validate: process.env.NODE_ENV === 'production'
});
```

### 4. Use Feature Flags

```typescript
if (config.features.analytics) {
  // Initialize analytics
}

if (config.features.multiTenant) {
  // Setup multi-tenancy
}
```

### 5. Secure Sensitive Data

```typescript
// Never log sensitive configuration
console.log('Database host:', config.database.host); // ✅ OK
console.log('Database password:', config.database.password); // ❌ Bad
```

## Security Considerations

- Never commit `.env` files with secrets
- Use strong JWT secrets (minimum 32 characters)
- Enable SSL in production databases
- Use environment-specific configurations
- Regularly rotate secrets and passwords
- Implement proper access control for configuration
