# Getting Started

Welcome to Siriux! This guide will help you get up and running with the Siriux platform.

## 🎯 What is Siriux?

Siriux is a **modular SaaS platform toolkit** that helps you build scalable applications faster. Instead of a monolithic framework, Siriux provides focused packages that work together but can be used independently.

### 📦 Core Packages

- **@siriux/core** - Type contracts and interfaces with multi-database support
- **@siriux/auth** - JWT authentication middleware  
- **@siriux/ui** - React UI components
- **@siriux/access-control** - RBAC and permissions
- **@siriux/logging** - Multi-output logging system
- **@siriux/config** - Configuration management

### ❄️ Default Database: Real Snowflake

**Siriux now defaults to real Snowflake integration** for production-ready SaaS applications. The platform automatically falls back to mock databases if Snowflake credentials are not configured.

## 🚀 Quick Start

### 1. Installation

Choose the packages you need:

```bash
# Full stack (backend + frontend)
npm install @siriux/core @siriux/auth @siriux/access-control @siriux/config @siriux/logging

# Backend only
npm install @siriux/core @siriux/auth

# Frontend only  
npm install @siriux/core
```

### 2. Backend Setup (Express)

```typescript
// server.ts
import express from 'express';
import { createAuthMiddleware, createDefaultAuthConfig } from '@siriux/auth';

const app = express();

// Configure authentication
const auth = createAuthMiddleware(createDefaultAuthConfig({
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!
}));

// Protected route
app.get('/api/profile', auth.tokenAuth, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000);
```

### 3. Frontend Setup (React)

```typescript
// App.tsx
import React from 'react';
import { AuthProvider, LoginForm } from '@siriux/ui';

function App() {
  return (
    <AuthProvider>
      <LoginForm 
        onSuccess={(user, tokens) => {
          console.log('Logged in!', user);
        }}
      />
    </AuthProvider>
  );
}
```

## 🗄️ Database Setup

Siriux auth requires a user table. Here are examples for different databases:

### PostgreSQL

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MySQL

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### SQLite

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Environment Variables

Create a `.env` file:

```bash
# Required for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Database
DATABASE_URL=postgresql://user:password@localhost/siriux

# Optional
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
```

## 📋 Complete Example

Let's build a complete authentication system:

### Backend (server.ts)

```typescript
import express from 'express';
import bcrypt from 'bcryptjs';
import { createAuthMiddleware, createDefaultAuthConfig, UserRole } from '@siriux/auth';

const app = express();
app.use(express.json());

// Mock database (replace with real database)
const users: any[] = [];

// Auth middleware
const auth = createAuthMiddleware(createDefaultAuthConfig({
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!
}));

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(user);
    
    // Generate tokens
    const tokens = auth.generateTokenPair(user);
    
    res.json({ user: { ...user, password: undefined }, tokens });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const tokens = auth.generateTokenPair(user);
    
    res.json({ user: { ...user, password: undefined }, tokens });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected endpoint
app.get('/api/profile', auth.tokenAuth, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
```

### Frontend (App.tsx)

```typescript
import React from 'react';
import { AuthProvider, LoginForm, useAuth } from '@siriux/ui';

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm 
        onSuccess={(user, tokens) => {
          console.log('Logged in!', user);
          // Navigate to profile page
        }}
        onError={(error) => {
          console.error('Login failed:', error);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider apiBaseUrl="http://localhost:3001/api">
      <LoginPage />
    </AuthProvider>
  );
}

export default App;
```

## 🎯 Next Steps

Now that you have the basics:

1. **Experience the Demo** - Start the app with `npm run dev:all` and visit `http://localhost:3000/demo`
2. **[Database Integration](../packages/core.md#database-setup)** - Connect to a real database
3. **[Next.js Integration](#nextjs-integration)** - Use with Next.js applications  
4. **[API Reference](../api/overview.md)** - Detailed API documentation
5. **[Package Guides](../packages/overview.md)** - Individual package documentation

## 🚀 Demo Sandbox

Try the live demo with pre-configured accounts:

| Role | Email | Password |
|-------|--------|----------|
| Admin | admin@siriux.dev | admin123 |
| User | user@siriux.dev | user123 |
| Manager | manager@siriux.dev | manager123 |

**Demo Features:**
- JWT authentication with role-based access
- Pre-configured user accounts
- Session management and token handling
- Form validation and error handling
- Responsive design and accessibility

## 🎭 Mock Authentication System

Siriux includes a complete mock authentication system that works **without any backend setup**. Perfect for development, testing, and demos!

### **Automatic Mock Mode**

The system automatically detects when to use mock mode:

```typescript
import { createSmartAuthConfig, isMockMode } from '@siriux/auth';

// Automatically uses mock in development/demo
const config = createSmartAuthConfig();
console.log('Mock mode:', isMockMode()); // true in development
```

### **Zero Setup Required**

```bash
npm install @siriux/auth
npm install @siriux/ui

# Works immediately - no backend needed!
```

### **Complete API Compatibility**

Mock system provides **100% API compatibility** with real authentication:

```typescript
// Same API works in both mock and production
import { MockAuthService } from '@siriux/auth';

const authService = new MockAuthService();

// Login
const result = await authService.login({
  email: 'user@siriux.dev',
  password: 'user123'
});

// Token validation
const validation = await authService.validateToken(result.tokens?.accessToken);

// User profile
const profile = await authService.getUserProfile(result.user?.id);
```

### **🗄️ Multi-Database Mock System**

Siriux supports multiple database backends for development:

#### **1. In-Memory Database** (Default)
```bash
MOCK_DB_TYPE=in-memory
```
- ✅ Zero setup, fastest performance
- ✅ No external dependencies
- ✅ Auto-reset on restart
- ✅ Perfect for demos and testing

#### **2. SQLite Database**
```bash
MOCK_DB_TYPE=sqlite
```
- ✅ Persistent storage
- ✅ Real SQL queries
- ✅ ACID compliance
- ✅ Portable file-based database

#### **3. Snowflake Database**
```bash
MOCK_DB_TYPE=snowflake
SNOWFLAKE_WAREHOUSE=DEMO_WAREHOUSE
SNOWFLAKE_SCHEMA=SIRIUX_DEMO
```
- ✅ Cloud-native experience
- ✅ Enterprise features
- ✅ Data warehousing capabilities
- ✅ Perfect for enterprise demos

### **Complete Mock Ecosystem**

**All Siriux packages include comprehensive mock systems:**

#### **@siriux/core**
- 🗄️ Multi-database support (In-memory, SQLite, Snowflake)
- 🔍 User management with CRUD operations
- 🔐 Session handling with JWT tokens
- 📝 Complete audit logging system
- 📊 Statistics and health checks

#### **@siriux/auth**
- 🔐 Complete authentication service
- 🛡️ Role-based access control
- 🔄 Token refresh mechanism
- 📋 Express middleware integration
- 🎯 Smart environment detection

#### **@siriux/logging**
- 📝 Multi-output logging (console, file, database, cloud)
- 🔍 Structured logging with metadata
- 📊 Performance metrics and analytics
- 🔍 Log search and filtering
- 📈 Real-time log statistics

#### **@siriux/config**
- ⚙️ Multi-storage configuration (memory, file, database, cloud)
- 🔍 Configuration validation and type safety
- 🔄 Real-time configuration watchers
- 🔐 Secret management
- 📊 Configuration statistics

#### **@siriux/access-control**
- 🛡️ Role-based permissions (RBAC)
- 📋 Custom access rules engine
- 🔍 Resource-level access control
- 📝 Complete audit trail
- 📊 Access analytics and reporting

### **Express Integration**

Drop-in replacement for real services:

```typescript
import { 
  createMockAuthMiddleware,
  createMockLogger,
  createMockConfigManager,
  createMockAccessControl
} from '@siriux/auth';

const app = express();

// Authentication middleware
const auth = createMockAuthMiddleware();
auth.applyMockRoutes(app);

// Logging
const logger = createMockLogger({
  outputs: ['console', 'database'],
  enableMetrics: true
});

// Configuration
const config = createMockConfigManager({
  storage: 'database',
  enableValidation: true
});

// Access Control
const accessControl = createMockAccessControl({
  enableAuditLogging: true
});

// Protected routes with full mock ecosystem
app.get('/api/profile', auth.tokenAuth, async (req, res) => {
  await logger.logUserAction(req.user.id, 'profile_view');
  res.json({ user: req.user });
});

app.get('/api/admin/stats', 
  auth.tokenAuth, 
  auth.adminAuth, 
  async (req, res) => {
    const hasAccess = await accessControl.canAccess(
      req.user.id, 
      'system_stats', 
      'read'
    );
    
    if (hasAccess.allowed) {
      const stats = await accessControl.getAccessStats();
      res.json(stats);
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  }
);
```

### **Database Demo**

Try the interactive database demo:
```bash
# Visit the demo
http://localhost:3000/database-demo
```

Features:
- 🗃️ Switch between In-memory, SQLite, and Snowflake
- 🧪 Test user operations, sessions, and audit logging
- 📊 Real-time statistics and health checks
- 📋 Live activity logging
- ⚙️ Environment configuration examples

### **Environment Variables**

Create a `.env` file in the monorepo root:

```bash
# Copy the example environment file
cp .env.example .env

# Database type (defaults to real Snowflake)
MOCK_DB_TYPE=snowflake-real

# Your Snowflake Account
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
SNOWFLAKE_USERNAME=your-username
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_WAREHOUSE=SIRIUX_WAREHOUSE
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_DATABASE=SIRIUX_DEMO
SNOWFLAKE_ROLE=SIRIUX_ADMIN

# Authentication (for development)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Service configuration
LOG_LEVEL=debug|info|warn|error
LOG_OUTPUTS=console,file,database,cloud
CONFIG_STORAGE=memory|file|database,cloud
ACCESS_CONTROL_CACHING=true
```

### **Database Options**

Siriux supports multiple database backends:

| Type | Environment Variable | Use Case |
|-------|---------------------|-----------|
| **Real Snowflake** | `snowflake-real` (default) | Production SaaS |
| **Mock Snowflake** | `snowflake-mock` | Demos, testing |
| **In-Memory** | `in-memory` | Development, testing |
| **SQLite** | `sqlite` | Local development |

**Default Behavior:**
- 🔄 **Auto-detects** real Snowflake if credentials are present
- 🎭 **Falls back** to mock Snowflake for demos
- ⚡ **Uses in-memory** for fastest development

## ❄️ Snowflake Database Setup

### **Required SQL Commands**

Run these commands in your Snowflake account to set up the database structure:

#### **1. Create Database & Schema**
```sql
-- Create main database
CREATE DATABASE IF NOT EXISTS SIRIUX_DEMO;

-- Create schema
CREATE SCHEMA IF NOT EXISTS SIRIUX_DEMO.PUBLIC;

-- Use the new database/schema
USE DATABASE SIRIUX_DEMO;
USE SCHEMA PUBLIC;
```

#### **2. Create Warehouse**
```sql
-- Create warehouse for Siriux
CREATE WAREHOUSE IF NOT EXISTS SIRIUX_WAREHOUSE
WITH WAREHOUSE_SIZE = 'X-SMALL'
AUTO_SUSPEND = 60
AUTO_RESUME = TRUE;
```

#### **3. Create Tables**
```sql
-- Users table
CREATE TABLE IF NOT EXISTS USERS (
    ID STRING PRIMARY KEY,
    EMAIL STRING UNIQUE NOT NULL,
    PASSWORD STRING NOT NULL,
    FIRST_NAME STRING NOT NULL,
    LAST_NAME STRING NOT NULL,
    ROLE STRING NOT NULL CHECK (ROLE IN ('user', 'admin', 'manager')),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS SESSIONS (
    ID STRING PRIMARY KEY,
    USER_ID STRING NOT NULL,
    ACCESS_TOKEN STRING UNIQUE NOT NULL,
    REFRESH_TOKEN STRING UNIQUE NOT NULL,
    EXPIRES_AT TIMESTAMP NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS AUDIT_LOGS (
    ID STRING PRIMARY KEY,
    USER_ID STRING,
    ACTION STRING NOT NULL,
    RESOURCE STRING NOT NULL,
    METADATA STRING,
    TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

#### **4. Create Roles & Permissions**
```sql
-- Create admin role
CREATE ROLE IF NOT EXISTS SIRIUX_ADMIN;

-- Create user role  
CREATE ROLE IF NOT EXISTS SIRIUX_USER;

-- Create manager role
CREATE ROLE IF NOT EXISTS SIRIUX_MANAGER;

-- Grant warehouse usage
GRANT USAGE ON WAREHOUSE SIRIUX_WAREHOUSE TO ROLE SIRIUX_ADMIN;
GRANT USAGE ON WAREHOUSE SIRIUX_WAREHOUSE TO ROLE SIRIUX_USER;
GRANT USAGE ON WAREHOUSE SIRIUX_WAREHOUSE TO ROLE SIRIUX_MANAGER;

-- Grant database and schema permissions
GRANT USAGE ON DATABASE SIRIUX_DEMO TO ROLE SIRIUX_ADMIN;
GRANT USAGE ON DATABASE SIRIUX_DEMO TO ROLE SIRIUX_USER;
GRANT USAGE ON DATABASE SIRIUX_DEMO TO ROLE SIRIUX_MANAGER;

GRANT USAGE ON SCHEMA PUBLIC TO ROLE SIRIUX_ADMIN;
GRANT USAGE ON SCHEMA PUBLIC TO ROLE SIRIUX_USER;
GRANT USAGE ON SCHEMA PUBLIC TO ROLE SIRIUX_MANAGER;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO ROLE SIRIUX_ADMIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO ROLE SIRIUX_USER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO ROLE SIRIUX_MANAGER;
```

### **Perfect For**

✅ **Development** - No backend setup required  
✅ **Testing** - Predictable, fast, isolated tests  
✅ **Demos** - Impressive live demos  
✅ **Prototyping** - Build MVPs quickly  
✅ **Documentation** - Interactive examples  
✅ **CI/CD** - No external dependencies  
✅ **Enterprise Sales** - Snowflake demos for clients  
✅ **Training** - Complete learning environment  

### **Production Transition**

Switch from mock to production with environment variables:

```bash
# Development (automatic mock)
NODE_ENV=development

# Production (real services)
NODE_ENV=production
JWT_SECRET=your-real-secret
DATABASE_URL=your-real-database
LOG_LEVEL=info
```

The mock system provides the **complete Siriux experience** with zero infrastructure requirements and seamless production transition! 🚀

## 🤝 Need Help?

- 📖 Check the [API Reference](../api/overview.md)
- 🐛 Report issues on [GitHub](https://github.com/jawwadbukhari/siriux)
- 💬 Join our community discussions

## 🎉 Congratulations!

You've successfully set up Siriux! You now have:

- ✅ JWT-based authentication
- ✅ React UI components  
- ✅ Type-safe interfaces
- ✅ Scalable architecture

Ready to build your SaaS application? 🚀
