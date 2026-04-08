# Siriux Packages - Complete Guide

## Overview

Siriux is a comprehensive SaaS development toolkit consisting of modular packages that work together to provide a complete foundation for building modern SaaS applications.

## Package Architecture

All Siriux packages are designed to be:

- **Modular**: Each package focuses on a specific concern
- **TypeScript-first**: Full type safety and IntelliSense support
- **Zero-dependency conflicts**: No internal package dependencies
- **Version-consistent**: All packages use the same version (v0.0.1)
- **Production-ready**: Battle-tested in real-world applications

## Available Packages

### @siriux/core v0.0.1

**Core interfaces, types, and database utilities**

```bash
npm install @siriux/core@0.0.1
```

#### Features

- **Type definitions** for common SaaS entities
- **Database interfaces** and mock implementations
- **Authentication middleware** for Express.js
- **Utility functions** for common operations

#### Key Exports

```typescript
// Types
import { User, Session, AuditLog } from '@siriux/core';

// Database
import { IMockDatabase, InMemoryMockDatabase } from '@siriux/core';

// Auth Middleware
import { authMiddleware } from '@siriux/core';
```

#### Usage Example

```typescript
import { InMemoryMockDatabase } from '@siriux/core';

// Initialize database
const db = new InMemoryMockDatabase();
await db.initialize();

// Create user
const user = await db.createUser({
  email: 'user@example.com',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe'
});

// Create session
const session = await db.createSession({
  userId: user.id,
  accessToken: 'jwt-token',
  expiresAt: '2024-01-01'
});
```

### @siriux/auth v0.0.1

**Authentication and authorization system**

```bash
npm install @siriux/auth@0.0.1
```

#### Features

- **JWT-based authentication** with refresh tokens
- **Mock authentication services** for development
- **Role-based access control** integration
- **Session management** utilities

#### Key Exports

```typescript
// Auth Service
import { AuthService } from '@siriux/auth';

// Mock Auth
import { MockAuthService } from '@siriux/auth';

// Auth Middleware
import { authMiddleware } from '@siriux/auth';
```

#### Usage Example

```typescript
import { MockAuthService } from '@siriux/auth';

const authService = new MockAuthService();

// Login
const { user, tokens } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Refresh token
const newTokens = await authService.refreshToken(refreshToken);

// Logout
await authService.logout(accessToken);
```

### @siriux/ui v0.0.1

**Modern React UI components**

```bash
npm install @siriux/ui@0.0.1
```

#### Features

- **SSR-safe components** with proper 'use client' directives
- **Authentication forms** (Login, Register, Forgot Password)
- **Layout components** (Header, Sidebar, Footer)
- **UI primitives** (Buttons, Cards, Inputs, Modals)
- **Theme support** with Tailwind CSS

#### Key Exports

```typescript
// Auth Components
import { LoginForm, RegisterForm, ForgotPasswordForm } from '@siriux/ui';

// Layout Components
import { Header, Sidebar, Footer } from '@siriux/ui';

// UI Components
import { Button, Card, Input, Modal } from '@siriux/ui';

// Auth Context
import { useAuth } from '@siriux/ui';
```

#### Usage Example

```typescript
import { LoginForm, useAuth } from '@siriux/ui';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### @siriux/access-control v0.0.1

**Role-based access control (RBAC)**

```bash
npm install @siriux/access-control@0.0.1
```

#### Features

- **Role-based permissions** system
- **Policy engine** for complex access rules
- **Access control guards** and middleware
- **Mock implementation** for development

#### Key Exports

```typescript
// Access Control Manager
import { AccessControlManager } from '@siriux/access-control';

// Policy Engine
import { PolicyEngine } from '@siriux/access-control';

// Guards
import { requireRole, requirePermission } from '@siriux/access-control';
```

#### Usage Example

```typescript
import { AccessControlManager } from '@siriux/access-control';

const acm = new AccessControlManager();

// Define roles and permissions
acm.defineRole('admin', ['read', 'write', 'delete']);
acm.defineRole('user', ['read']);

// Check permissions
const canDelete = acm.can(user, 'delete', 'resource');

// Use in middleware
const guard = requireRole('admin');
guard(req, res, next); // Will throw if user is not admin
```

### @siriux/config v0.0.1

**Configuration management system**

```bash
npm install @siriux/config@0.0.1
```

#### Features

- **Environment-based configuration**
- **Validation with Joi schemas**
- **Type-safe configuration access**
- **Mock configuration** for testing

#### Key Exports

```typescript
// Config Manager
import { ConfigManager } from '@siriux/config';

// Mock Config
import { MockConfigManager } from '@siriux/config';
```

#### Usage Example

```typescript
import { ConfigManager } from '@siriux/config';

const config = new ConfigManager();

// Load configuration
await config.load();

// Access configuration
const dbUrl = config.get('database.url');
const jwtSecret = config.get('auth.jwt.secret');

// Validate configuration
config.validate();
```

### @siriux/logging v0.0.1

**Structured logging system**

```bash
npm install @siriux/logging@0.0.1
```

#### Features

- **Structured logging** with correlation IDs
- **Multiple transports** (Console, File, Daily Rotate)
- **Log levels** and filtering
- **Mock logger** for testing

#### Key Exports

```typescript
// Logger
import { SiriuxLogger } from '@siriux/logging';

// Mock Logger
import { MockLogger } from '@siriux/logging';

// Formatters
import { JsonFormatter, SimpleFormatter } from '@siriux/logging';
```

#### Usage Example

```typescript
import { SiriuxLogger } from '@siriux/logging';

const logger = new SiriuxLogger({
  level: 'info',
  transports: ['console', 'file']
});

// Log with correlation ID
logger.info('User logged in', {
  userId: '123',
  correlationId: 'abc-123'
});

// Error logging
logger.error('Database connection failed', {
  error: errorMessage,
  stack: error.stack
});
```

### @siriux/docs v0.0.1

**Complete documentation and guides**

```bash
npm install @siriux/docs@0.0.1
```

#### Features

- **Comprehensive API documentation**
- **Setup guides** and tutorials
- **Best practices** and patterns
- **Code examples** and snippets

## Package Dependencies

### External Dependencies

Each package only depends on external, well-maintained npm packages:

- **@siriux/core**: bcryptjs, cors, dotenv, express, joi, jsonwebtoken, uuid, winston
- **@siriux/auth**: bcryptjs, cors, dotenv, express, joi, jsonwebtoken, uuid, winston
- **@siriux/ui**: @radix-ui/* components, class-variance-authority, clsx, lucide-react, tailwind-merge
- **@siriux/access-control**: joi
- **@siriux/config**: dotenv, joi
- **@siriux/logging**: uuid, winston, winston-daily-rotate-file

### Internal Dependencies

**Zero internal dependencies** - no Siriux package depends on another Siriux package. This ensures:

- **No version conflicts**
- **Independent versioning**
- **Flexible usage patterns**
- **Easy testing and mocking**

## Usage Patterns

### 1. Basic Setup

```typescript
// Install all packages
npm install @siriux/core@0.0.1 @siriux/auth@0.0.1 @siriux/ui@0.0.1 @siriux/access-control@0.0.1 @siriux/config@0.0.1 @siriux/logging@0.0.1

// Import what you need
import { InMemoryMockDatabase } from '@siriux/core';
import { MockAuthService } from '@siriux/auth';
import { LoginForm, useAuth } from '@siriux/ui';
import { AccessControlManager } from '@siriux/access-control';
import { ConfigManager } from '@siriux/config';
import { SiriuxLogger } from '@siriux/logging';
```

### 2. Express.js Integration

```typescript
import express from 'express';
import { authMiddleware } from '@siriux/core';
import { AccessControlManager } from '@siriux/access-control';
import { SiriuxLogger } from '@siriux/logging';

const app = express();
const logger = new SiriuxLogger();
const acm = new AccessControlManager();

// Auth middleware
app.use('/api', authMiddleware);

// Access control
app.use('/api/admin', acm.requireRole('admin'));

app.listen(3000);
```

### 3. React Integration

```typescript
import React from 'react';
import { LoginForm, RegisterForm, Header, Sidebar } from '@siriux/ui';
import { useAuth } from '@siriux/ui';

function App() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <Sidebar>
        {user ? <Dashboard /> : <LoginForm onLogin={login} />}
      </Sidebar>
    </div>
  );
}
```

### 4. Database Integration

```typescript
import { InMemoryMockDatabase, SQLiteMockDatabase } from '@siriux/core';

// Development
const devDb = new InMemoryMockDatabase();

// Production
const prodDb = new SQLiteMockDatabase({ path: './database.sqlite' });

// Use the same interface
const db = process.env.NODE_ENV === 'production' ? prodDb : devDb;
await db.initialize();
```

## Version Management

### Current Version: v0.0.1

All packages are versioned consistently:

- **Major version**: Breaking changes
- **Minor version**: New features (backward compatible)
- **Patch version**: Bug fixes (backward compatible)

### Version Strategy

1. **v0.0.1**: Initial clean release with no internal dependencies
2. **v0.1.0**: Add new features while maintaining compatibility
3. **v1.0.0**: Stable production release
4. **v2.0.0**: Major updates with breaking changes

### Updating Packages

```bash
# Update all packages to latest
npm update @siriux/core @siriux/auth @siriux/ui @siriux/access-control @siriux/config @siriux/logging

# Or update specific package
npm install @siriux/core@latest
```

## Testing

### Mock Implementations

All packages include mock implementations for testing:

```typescript
import { MockAuthService } from '@siriux/auth';
import { MockConfigManager } from '@siriux/config';
import { MockLogger } from '@siriux/logging';

// Use in tests
const mockAuth = new MockAuthService();
const mockConfig = new MockConfigManager();
const mockLogger = new MockLogger();
```

### Test Utilities

```typescript
// Test database
import { InMemoryMockDatabase } from '@siriux/core';

const testDb = new InMemoryMockDatabase();
await testDb.initialize();

// Test auth
import { MockAuthService } from '@siriux/auth';

const testAuth = new MockAuthService();
```

## Contributing

### Package Development

When contributing to Siriux packages:

1. **Follow the existing patterns** and conventions
2. **Add comprehensive tests** for new features
3. **Update TypeScript types** for all exports
4. **Document new features** with examples
5. **Maintain backward compatibility** when possible

### Publishing

Packages are published automatically:

1. **Update version** in package.json
2. **Run tests** to ensure quality
3. **Build packages** for distribution
4. **Publish to npm** with public access

## Support

### Documentation

- **API Reference**: Check each package's TypeScript definitions
- **Examples**: See the starter kit implementation
- **Guides**: Read the development documentation

### Community

- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Get help from other developers
- **Email Support**: support@siriux.dev

### Getting Help

1. **Read the documentation** first
2. **Check existing issues** on GitHub
3. **Ask in the community** Discord
4. **Contact support** for critical issues

## Roadmap

### v0.1.0 (Planned)

- **Enhanced UI components** with more variants
- **Advanced auth providers** (OAuth2, SAML)
- **Database migrations** system
- **Performance monitoring** integration

### v0.2.0 (Planned)

- **Real-time features** with WebSockets
- **Advanced analytics** and reporting
- **Multi-tenant support**
- **Internationalization** (i18n)

### v1.0.0 (Planned)

- **Production stability** guarantees
- **Long-term support** (LTS)
- **Enterprise features**
- **Professional support** options

---

**Built with passion for the SaaS development community** 

For more information, visit [https://siriux.dev](https://siriux.dev)
