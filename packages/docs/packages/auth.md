# @siriux/auth

JWT-based authentication middleware for Node.js applications.

## 🚀 Installation

```bash
npm install @siriux/auth
```

## 📋 Prerequisites

You need a user database with at least these columns:

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Basic Setup

```typescript
import { createAuthMiddleware, createDefaultAuthConfig } from '@siriux/auth';

// Configure authentication
const authConfig = createDefaultAuthConfig({
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  tokenExpiry: '24h',
  refreshExpiry: '7d'
});

// Create middleware instance
const auth = createAuthMiddleware(authConfig);

// Use in Express app
app.use('/api/protected', auth.tokenAuth);
app.use('/api/admin', auth.tokenAuth, auth.adminAuth);
```

## 🛡️ Middleware Options

### tokenAuth
Verifies JWT tokens and attaches user to request.

```typescript
app.get('/api/profile', auth.tokenAuth, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### adminAuth
Requires admin role.

```typescript
app.delete('/api/users/:id', auth.tokenAuth, auth.adminAuth, (req, res) => {
  // Only admins can access
});
```

### roleAuth
Requires specific role.

```typescript
app.get('/api/manager-data', auth.tokenAuth, auth.roleAuth(UserRole.MANAGER), (req, res) => {
  // Only managers can access
});
```

### optionalAuth
Optional authentication - doesn't fail if no token.

```typescript
app.get('/api/public-data', auth.optionalAuth, (req, res) => {
  // req.user might be undefined
  const data = req.user ? getUserData(req.user.userId) : getPublicData();
  res.json(data);
});
```

## 🔑 Token Generation

```typescript
// Generate tokens for authenticated user
const user = {
  id: 'user-123',
  email: 'user@example.com',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date()
};

const tokens = auth.generateTokenPair(user);
// Returns: { accessToken: string, refreshToken: string }

// Verify refresh token
const decoded = auth.verifyRefreshToken(tokens.refreshToken);
// Returns: { userId: string, type: 'refresh' }
```

## 🗄️ Database Schema Requirements

### Required User Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string/uuid | Unique user identifier |
| email | string | User email (must be unique) |
| password | string | Hashed password (bcrypt) |
| role | enum | User role: 'user' or 'admin' |
| createdAt | timestamp | Account creation time |
| updatedAt | timestamp | Last update time |

### Example User Entity

```typescript
interface User {
  id: string;
  email: string;
  password: string; // Hashed with bcrypt
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Environment Variables

```bash
# Required
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Optional
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
JWT_ISSUER=siriux
JWT_AUDIENCE=siriux-users
```

## 📝 Complete Example

```typescript
import express from 'express';
import { createAuthMiddleware, createDefaultAuthConfig, UserRole } from '@siriux/auth';

const app = express();

// Auth configuration
const auth = createAuthMiddleware(createDefaultAuthConfig({
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!
}));

// Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Find user in database
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 3. Generate tokens
  const tokens = auth.generateTokenPair(user);
  
  res.json({ user, tokens });
});

// Protected routes
app.get('/api/profile', auth.tokenAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/admin', auth.tokenAuth, auth.adminAuth, (req, res) => {
  res.json({ message: 'Admin only' });
});

app.listen(3000);
```

## 🔧 API Reference

### Functions

#### createAuthMiddleware(config)
Creates authentication middleware instance.

#### createDefaultAuthConfig(overrides)
Creates default configuration with optional overrides.

### Types

#### AuthConfig
```typescript
interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  tokenExpiry?: string;
  refreshExpiry?: string;
  issuer?: string;
  audience?: string;
}
```

#### UserRole
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}
```

## 🚨 Security Notes

- Always use strong JWT secrets
- Hash passwords with bcrypt
- Use HTTPS in production
- Implement rate limiting
- Validate input data
- Set appropriate token expiry times
