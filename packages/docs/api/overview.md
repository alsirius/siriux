# API Overview

Complete API documentation for all Siriux packages.

## Core Packages

### [@siriux/core](../packages/core.md)
Type contracts, interfaces, and utilities for the Siriux platform.

### [@siriux/auth](../packages/auth.md)
JWT authentication middleware and utilities.

### [@siriux/ui](../packages/ui.md)
React UI components and authentication context.

### [@siriux/access-control](../packages/access-control.md)
Role-based access control and security guards.

### [@siriux/logging](../packages/logging.md)
Structured logging with correlation IDs.

### [@siriux/config](../packages/config.md)
Environment configuration and validation.

## Quick Reference

### Authentication Flow

```typescript
import { createAuthMiddleware } from '@siriux/auth';

const auth = createAuthMiddleware({
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET
});

// Protect routes
app.use('/api/protected', auth.tokenAuth);
```

### UI Components

```typescript
import { AuthProvider, LoginForm, Icon } from '@siriux/ui';

function App() {
  return (
    <AuthProvider>
      <LoginForm />
      <Icon name="user" size="md" />
    </AuthProvider>
  );
}
```

### Access Control

```typescript
import { createRBAC, RoleGuard } from '@siriux/access-control';

const rbac = createRBAC({
  roles: ['user', 'admin'],
  permissions: {
    'read:users': ['user', 'admin'],
    'write:users': ['admin']
  }
});
```

For detailed package-specific documentation, see the individual package pages.
