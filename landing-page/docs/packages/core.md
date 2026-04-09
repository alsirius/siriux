# @siriux/core

Core utilities, database abstractions, and mock systems for the Siriux platform.

## 🚀 Installation

```bash
npm install @siriux/core
```

## 📋 Overview

@siriux/core provides the fundamental infrastructure for all Siriux packages, including:
- **Multi-database support** (In-memory, SQLite, Snowflake)
- **Mock systems** for development and testing
- **Core TypeScript interfaces** and contracts
- **Database factory** with auto-detection
- **Audit logging** and statistics

## 🗄️ Database System

### Multi-Database Support

@siriux/core supports multiple database backends with a unified API:

```typescript
import { MockDatabaseFactory, DatabaseType } from '@siriux/core';

// Automatic database selection
const database = await MockDatabaseFactory.createWithAutoDetection();

// Manual selection
const database = await MockDatabaseFactory.create({
  type: DatabaseType.SNOWFLAKE_REAL
});
```

### Database Types

| Type | Description | Use Case | Setup |
|------|-------------|----------|-------|
| **IN_MEMORY** | Fast in-memory database | Development, testing, demos | ❌ None |
| **SQLITE** | File-based SQL database | Local development, small apps | ❌ None |
| **SNOWFLAKE_MOCK** | Simulated Snowflake | Enterprise demos, sales | ❌ None |
| **SNOWFLAKE_REAL** | Real Snowflake connection | Production, enterprise | ✅ Credentials |

### Database Configuration

```bash
# Environment variables
MOCK_DB_TYPE=in-memory|sqlite|snowflake-mock|snowflake-real

# Real Snowflake (optional)
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
SNOWFLAKE_USERNAME=your-username
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_WAREHOUSE=DEMO_WAREHOUSE
SNOWFLAKE_SCHEMA=SIRIUX_DEMO
```

### Database Interface

```typescript
interface MockDatabase {
  initialize(): Promise<void>;
  getUserByEmail(email: string): Promise<any>;
  getUserById(id: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  createSession(data: any): Promise<any>;
  getSessionByToken(token: string): Promise<any>;
  deleteSession(token: string): Promise<void>;
  logAudit(entry: any): Promise<void>;
  getStats(): Promise<any>;
  getAuditLogs(userId?: string): Promise<any[]>;
  reset(): Promise<void>;
  close(): Promise<void>;
  healthCheck(): Promise<any>;
}
```

## 🎭 Mock Systems

### In-Memory Database

```typescript
import { InMemoryMockDatabase } from '@siriux/core';

const database = new InMemoryMockDatabase();
await database.initialize();

// Zero setup, fastest performance
const user = await database.getUserByEmail('admin@siriux.dev');
```

### Snowflake Database

```typescript
import { SnowflakeDatabase, getSnowflakeConfig } from '@siriux/core';

// Real Snowflake connection
const snowflakeConfig = getSnowflakeConfig();
const database = new SnowflakeDatabase(snowflakeConfig);
await database.initialize();

// Production queries
const result = await database.execute(`
  SELECT * FROM USERS WHERE ROLE = 'admin'
`);
```

### Smart Auto-Detection

```typescript
// Automatically chooses best database based on environment
const database = await MockDatabaseFactory.createWithAutoDetection();

// Development: Uses in-memory database
// Production: Uses real Snowflake (if configured)
// Demo: Uses Snowflake mock for enterprise features
```

## 🏗️ Core Contracts

### User & Authentication

#### UserRole
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager'
}
```

#### AuthenticatedUser
```typescript
interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

#### JwtPayload
```typescript
interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
```

### Database Contracts

#### DatabaseConfig
```typescript
interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql' | 'snowflake';
  connection: string;
  options?: Record<string, any>;
}
```

### Mock Database Types

#### DatabaseType
```typescript
enum DatabaseType {
  IN_MEMORY = 'in-memory',
  SQLITE = 'sqlite',
  SNOWFLAKE_MOCK = 'snowflake-mock',
  SNOWFLAKE_REAL = 'snowflake-real'
}
```

#### MockDatabaseConfig
```typescript
interface MockDatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  options?: Record<string, any>;
}
```

## 🔧 Usage Examples

### Quick Start with Mock Database

```typescript
import { MockDatabaseFactory, DatabaseType } from '@siriux/core';

// Works immediately - no setup required
const database = await MockDatabaseFactory.create({
  type: DatabaseType.IN_MEMORY
});

await database.initialize();

// User operations
const user = await database.getUserByEmail('admin@siriux.dev');
const newUser = await database.createUser({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'New',
  lastName: 'User',
  role: 'user'
});

// Session management
const session = await database.createSession({
  userId: user.id,
  accessToken: 'mock-token',
  refreshToken: 'mock-refresh',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
});
```

### Real Snowflake Integration

```typescript
import { SnowflakeDatabase, getSnowflakeConfig } from '@siriux/core';

// Configure environment variables
process.env.SNOWFLAKE_ACCOUNT = 'your-account.snowflakecomputing.com';
process.env.SNOWFLAKE_USERNAME = 'your-username';
process.env.SNOWFLAKE_PASSWORD = 'your-password';

// Connect to real Snowflake
const config = getSnowflakeConfig();
const database = new SnowflakeDatabase(config);
await database.initialize();

// Real SQL queries
const stats = await database.getStats();
const logs = await database.getAuditLogs();
const health = await database.healthCheck();
```

### Smart Database Selection

```typescript
import { createSmartDatabase } from '@siriux/core';

// Automatically detects environment
const database = await createSmartDatabase();

// Falls back gracefully
if (process.env.NODE_ENV === 'development') {
  // Uses in-memory database
} else if (process.env.SNOWFLAKE_ACCOUNT) {
  // Uses real Snowflake
} else {
  // Uses Snowflake mock for demos
}
```

### Audit Logging

```typescript
// Log user actions
await database.logAudit({
  userId: user.id,
  action: 'LOGIN_SUCCESS',
  resource: 'auth',
  metadata: JSON.stringify({ ip: '127.0.0.1' })
});

// Retrieve audit logs
const logs = await database.getAuditLogs(user.id);
const allLogs = await database.getAuditLogs();
```

### Database Statistics

```typescript
const stats = await database.getStats();
console.log({
  totalUsers: stats.totalUsers,
  totalSessions: stats.totalSessions,
  totalAuditLogs: stats.totalAuditLogs,
  usersByRole: stats.usersByRole,
  databaseType: stats.databaseType
});
```

## 🔄 Advanced Features

### Database Factory

```typescript
import { MockDatabaseFactory } from '@siriux/core';

// Get supported database types
const types = MockDatabaseFactory.getSupportedTypes();

// Get database information
const info = MockDatabaseFactory.getDatabaseInfo(DatabaseType.SNOWFLAKE_REAL);
console.log(info.features); // ['Real Snowflake connection', 'Production queries', ...]
```

### Health Checks

```typescript
const health = await database.healthCheck();
if (health.status === 'healthy') {
  console.log('Database is ready');
} else {
  console.error('Database issues:', health.error);
}
```

### Database Reset

```typescript
// Reset demo data (useful for testing)
await database.reset();

// Close connection
await database.close();
```

## � Why @siriux/core Matters

### 1. **Zero-Friction Development**
- Works immediately without database setup
- Falls back gracefully when configuration missing
- Perfect for demos, testing, and prototyping

### 2. **Enterprise Ready**
- Real Snowflake integration for production
- Complete audit logging and compliance
- Multi-database support for different use cases

### 3. **Type Safety**
- Full TypeScript support throughout
- Consistent interfaces across all databases
- Compile-time error checking

### 4. **Developer Experience**
- Auto-detection of best database option
- Comprehensive error handling
- Rich logging and statistics

## 🚨 Best Practices

### 1. **Use Smart Database Selection**
```typescript
// ✅ Good - automatic detection
const database = await createSmartDatabase();

// ❌ Avoid hardcoding
const database = new InMemoryMockDatabase();
```

### 2. **Handle Configuration Gracefully**
```typescript
try {
  const config = getSnowflakeConfig();
  const database = new SnowflakeDatabase(config);
} catch (error) {
  console.warn('Snowflake not configured, using mock database');
  const database = new SnowflakeMockDatabase();
}
```

### 3. **Use Environment Variables**
```typescript
// .env file
MOCK_DB_TYPE=snowflake-real
SNOWFLAKE_ACCOUNT=your-account
SNOWFLAKE_WAREHOUSE=DEMO_WAREHOUSE
```

### 4. **Leverage Mock System for Testing**
```typescript
// Tests run immediately without external dependencies
const mockDatabase = new InMemoryMockDatabase();
await mockDatabase.initialize();
// Run your tests...
await mockDatabase.reset(); // Clean state for next test
```

## 🎯 Use Cases

### **Development & Testing**
```typescript
// Zero setup required
const database = await MockDatabaseFactory.create({
  type: DatabaseType.IN_MEMORY
});
```

### **Enterprise Demos**
```typescript
// Impressive Snowflake features without account
const database = await MockDatabaseFactory.create({
  type: DatabaseType.SNOWFLAKE_MOCK
});
```

### **Production Applications**
```typescript
// Real Snowflake with enterprise features
const database = await MockDatabaseFactory.create({
  type: DatabaseType.SNOWFLAKE_REAL
});
```

### **Multi-Tenant SaaS**
```typescript
// Different databases per tenant
const tenantDatabase = await MockDatabaseFactory.create({
  type: tenant.config.databaseType,
  connectionString: tenant.config.connectionString
});
```

@siriux/core provides the foundation for building scalable, enterprise-ready applications with zero development friction. 🚀
