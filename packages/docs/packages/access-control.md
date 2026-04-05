# @siriux/access-control

Role-based access control, permissions, and policies for Siriux applications.

## Installation

```bash
npm install @siriux/access-control
```

## Quick Start

```typescript
import { AccessControlManager } from '@siriux/access-control';

// Create access control manager
const accessControl = AccessControlManager.createDefault();

// Check permissions
const canAccess = await accessControl.can(
  Permission.READ_ALL_USERS,
  {
    userId: 'user-123',
    userRole: UserRole.ADMIN,
    resourceId: 'user-456'
  }
);

if (canAccess.granted) {
  // Allow access
}
```

## Features

- **Role-Based Permissions**: Define permissions by user roles
- **Policy Engine**: Configurable access policies with conditions
- **Security Guards**: Built-in guards for common security checks
- **Express Middleware**: Easy integration with Express applications
- **Type Safety**: Full TypeScript support

## Usage

### Basic Permission Checking

```typescript
import { AccessControlManager, Permission } from '@siriux/access-control';

const accessControl = new AccessControlManager({
  defaultRoles: [
    {
      role: UserRole.USER,
      permissions: [
        Permission.READ_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE
      ]
    },
    {
      role: UserRole.ADMIN,
      permissions: Object.values(Permission)
    }
  ],
  policies: [],
  guards: []
});

// Check if user can read their own profile
const result = await accessControl.can(
  Permission.READ_OWN_PROFILE,
  {
    userId: 'user-123',
    userRole: UserRole.USER,
    resourceId: 'user-123'
  }
);
```

### Using Guards

```typescript
import { OwnershipGuard, TimeGuard, IPGuard } from '@siriux/access-control';

// Check if user owns the resource
const ownershipCheck = await accessControl.can(
  Permission.UPDATE_OWN_CONTENT,
  {
    userId: 'user-123',
    userRole: UserRole.USER,
    resourceId: 'user-123:content-456' // Format: owner:resource
  },
  ['ownership'] // Apply ownership guard
);

// Check if access is during business hours
const timeCheck = await accessControl.can(
  Permission.READ_ALL_CONTENT,
  {
    userId: 'user-123',
    userRole: UserRole.USER
  },
  ['time'] // Apply time guard
);
```

### Express Middleware

```typescript
import express from 'express';
import { AccessControlManager, Permission } from '@siriux/access-control';

const app = express();
const accessControl = AccessControlManager.createDefault();

// Protect routes with middleware
app.get('/admin/users', 
  accessControl.createMiddleware({
    permission: Permission.READ_ALL_USERS,
    guards: ['role'],
    getResourceContext: (req) => ({
      requiredRole: UserRole.ADMIN
    })
  }),
  (req, res) => {
    // Only accessible by admins
    res.json({ users: [] });
  }
);

// Protect user-owned resources
app.put('/api/content/:id',
  accessControl.createMiddleware({
    permission: Permission.UPDATE_OWN_CONTENT,
    guards: ['ownership'],
    getResourceContext: (req) => ({
      resourceId: `user-${req.user.id}:content-${req.params.id}`
    })
  }),
  (req, res) => {
    // Only accessible by content owner
    res.json({ updated: true });
  }
);
```

### Custom Policies

```typescript
import { AccessControlManager } from '@siriux/access-control';

const accessControl = new AccessControlManager({
  policies: [
    {
      id: 'business-hours-only',
      name: 'Business Hours Only',
      description: 'Allow access only during business hours',
      permissions: [Permission.READ_ALL_CONTENT],
      conditions: [
        {
          field: 'context.time.hour',
          operator: 'gte',
          value: 9
        },
        {
          field: 'context.time.hour',
          operator: 'lte',
          value: 17
        }
      ]
    }
  ],
  defaultRoles: [],
  guards: []
});

// Check with time context
const result = await accessControl.can(
  Permission.READ_ALL_CONTENT,
  {
    userId: 'user-123',
    userRole: UserRole.USER,
    context: {
      time: { hour: 14 } // 2 PM
    }
  }
);
```

## Built-in Guards

### Ownership Guard
Checks if the user owns the resource.

```typescript
// Resource ID format: owner:resource-id
resourceId: 'user-123:content-456'
```

### Time Guard
Restricts access to business hours (9 AM - 6 PM).

### IP Guard
Whitelist/blacklist IP addresses.

### Role Guard
Hierarchical role checking (admin > manager > user).

### Resource State Guard
Check if resource state allows the action.

```typescript
// States that allow different actions
const allowedStates = {
  'read': ['active', 'archived', 'draft'],
  'update': ['active', 'draft'],
  'delete': ['active', 'draft']
};
```

## Custom Guards

```typescript
import { createCustomGuard } from '@siriux/access-control';

const customGuard = createCustomGuard(
  'custom-guard',
  async (request) => {
    // Your custom logic here
    const isAllowed = await checkCustomCondition(request);
    
    return {
      granted: isAllowed,
      reason: isAllowed ? 'Custom check passed' : 'Custom check failed'
    };
  }
);

accessControl.addGuard(customGuard);
```

## API Reference

### AccessControlManager

#### Constructor
```typescript
new AccessControlManager(config: AccessControlConfig)
```

#### Methods

- `can(permission, context, guards?)` - Check single permission
- `canAny(permissions, context, guards?)` - Check if any permission is granted
- `canAll(permissions, context, guards?)` - Check if all permissions are granted
- `createMiddleware(options)` - Create Express middleware
- `addPolicy(policy)` - Add custom policy
- `removePolicy(policyId)` - Remove policy
- `addGuard(guard)` - Add custom guard
- `removeGuard(guardName)` - Remove guard

### Permissions

All available permissions in the `Permission` enum:

```typescript
enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read:own:profile',
  UPDATE_OWN_PROFILE = 'update:own:profile',
  DELETE_OWN_ACCOUNT = 'delete:own:account',
  
  // Admin permissions
  READ_ALL_USERS = 'read:all:users',
  UPDATE_ALL_USERS = 'update:all:users',
  DELETE_ALL_USERS = 'delete:all:users',
  MANAGE_ROLES = 'manage:roles',
  
  // Content permissions
  READ_ALL_CONTENT = 'read:all:content',
  CREATE_CONTENT = 'create:content',
  UPDATE_OWN_CONTENT = 'update:own:content',
  UPDATE_ALL_CONTENT = 'update:all:content',
  DELETE_OWN_CONTENT = 'delete:own:content',
  DELETE_ALL_CONTENT = 'delete:all:content',
  
  // System permissions
  READ_SYSTEM_LOGS = 'read:system:logs',
  MANAGE_SYSTEM = 'manage:system',
  VIEW_ANALYTICS = 'view:analytics'
}
```

## Best Practices

1. **Principle of Least Privilege**: Grant only necessary permissions
2. **Resource Ownership**: Use ownership guard for user-owned resources
3. **Role Hierarchy**: Design roles with clear hierarchy
4. **Audit Logging**: Log all access control decisions
5. **Error Handling**: Provide clear error messages for denied access

## Examples

### Blog Application

```typescript
// Blog permissions
const blogPermissions = {
  author: [
    Permission.CREATE_CONTENT,
    Permission.UPDATE_OWN_CONTENT,
    Permission.DELETE_OWN_CONTENT
  ],
  editor: [
    Permission.READ_ALL_CONTENT,
    Permission.UPDATE_ALL_CONTENT
  ],
  admin: Object.values(Permission)
};

// Protect blog routes
app.post('/blog/posts', 
  accessControl.createMiddleware({
    permission: Permission.CREATE_CONTENT,
    guards: ['ownership']
  }),
  createPostHandler
);

app.put('/blog/posts/:id',
  accessControl.createMiddleware({
    permission: Permission.UPDATE_OWN_CONTENT,
    guards: ['ownership'],
    getResourceContext: (req) => ({
      resourceId: `user-${req.user.id}:post-${req.params.id}`
    })
  }),
  updatePostHandler
);
```

### E-commerce Platform

```typescript
// Product management
app.post('/admin/products',
  accessControl.createMiddleware({
    permission: Permission.CREATE_CONTENT,
    guards: ['role'],
    getResourceContext: (req) => ({
      requiredRole: UserRole.ADMIN
    })
  }),
  createProductHandler
);

// Order management
app.get('/orders/:id',
  accessControl.createMiddleware({
    permission: Permission.READ_OWN_CONTENT,
    guards: ['ownership'],
    getResourceContext: (req) => ({
      resourceId: `user-${req.user.id}:order-${req.params.id}`
    })
  }),
  getOrderHandler
);
```

## Security Considerations

- Always validate resource ownership
- Use HTTPS in production
- Implement rate limiting
- Log access control decisions
- Regularly review permissions and roles
- Use strong JWT secrets
- Implement proper session management
