# Siriux SaaS Starter Kit - Development Guide

## Overview

This guide will help you understand the architecture and best practices for developing with the Siriux SaaS Starter Kit.

## Architecture

### Core Concepts

The starter kit is built on a modular architecture using Siriux packages:

- **@siriux/core**: Core interfaces and types
- **@siriux/auth**: Authentication and authorization
- **@siriux/ui**: Reusable UI components
- **@siriux/access-control**: Role-based permissions
- **@siriux/config**: Configuration management
- **@siriux/logging**: Structured logging

### Project Structure

```
apps/starter-next-saas/
|-- config/
|   |-- app-config.ts          # Main configuration
|   |-- database.ts            # Database configuration
|   `-- auth.ts                # Auth configuration
|-- src/
|   |-- app/                   # Next.js App Router
|   |   |-- (auth)/            # Auth routes group
|   |   |-- dashboard/         # Dashboard pages
|   |   |-- api/               # API routes
|   |   `-- globals.css        # Global styles
|   |-- components/            # React components
|   |   |-- auth/              # Auth components
|   |   |-- ui/                # UI components
|   |   |-- layout/            # Layout components
|   |   `-- forms/             # Form components
|   |-- lib/                   # Utilities
|   |   |-- auth.ts            # Auth utilities
|   |   |-- database.ts        # Database utilities
|   |   |-- middleware.ts      # Custom middleware
|   |   `-- utils.ts           # General utilities
|   `-- types/                 # TypeScript types
|       |-- auth.ts            # Auth types
|       |-- database.ts        # Database types
|       `-- api.ts             # API types
|-- scripts/
|   |-- setup.js               # Setup script
|   `-- seed.js                # Database seeding
`-- public/
    |-- images/                # Static images
    `-- icons/                 # Icon assets
```

## Key Features

### 1. Authentication System

The app includes a complete authentication system:

- **JWT-based authentication** with refresh tokens
- **Social login support** (Google, GitHub, etc.)
- **Role-based access control** (Admin, User, Manager)
- **Session management** with automatic token refresh
- **Password reset** functionality

#### Auth Components

```typescript
// Login form
import { LoginForm } from '@siriux/ui';

// Registration form
import { RegisterForm } from '@siriux/ui';

// Auth context
import { useAuth } from '@siriux/ui';

// Protected routes
import { ProtectedRoute } from '@/components/auth';
```

#### Auth Configuration

```typescript
// config/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
};
```

### 2. Database Integration

The starter kit supports multiple database options:

- **In-memory database** for development
- **SQLite** for local development
- **PostgreSQL** for production
- **Snowflake** for data warehousing

#### Database Usage

```typescript
// Initialize database
import { InMemoryMockDatabase } from '@siriux/core';

const db = new InMemoryMockDatabase();
await db.initialize();

// User operations
const user = await db.createUser({
  email: 'user@example.com',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe'
});

// Authentication
const session = await db.createSession({
  userId: user.id,
  accessToken: 'jwt-token',
  expiresAt: '2024-01-01'
});
```

### 3. UI Components

The starter kit includes a comprehensive UI component library:

- **Forms**: Login, Register, Profile, Settings
- **Layout**: Header, Sidebar, Footer, Navigation
- **UI Elements**: Buttons, Cards, Modals, Tables
- **Charts**: Analytics dashboard components

#### Component Usage

```typescript
// Using UI components
import { Button, Card, Input, Modal } from '@siriux/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter your email" />
      <Button onClick={handleSubmit}>Submit</Button>
    </Card>
  );
}
```

### 4. Configuration Management

The app uses a centralized configuration system:

```typescript
// config/app-config.ts
export const appConfig = {
  app: {
    name: "My SaaS App",
    description: "My app description",
    url: "https://myapp.com"
  },
  features: {
    authentication: true,
    analytics: true,
    blog: false
  },
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981"
  }
};
```

## Development Workflow

### 1. Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/siriux-starter-saas
cd siriux-starter-saas

# Run setup script
node scripts/setup.js

# Install dependencies
npm install

# Start development
npm run dev
```

### 2. Environment Configuration

Create `.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Database
npm run db:seed          # Seed database with sample data
npm run db:migrate       # Run database migrations
npm run db:reset         # Reset database

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

## Best Practices

### 1. Code Organization

- **Keep components small** and focused on single responsibilities
- **Use TypeScript** for all new code
- **Follow the existing naming conventions**
- **Organize imports** at the top of files
- **Use absolute imports** for internal modules

### 2. State Management

- **Use React Context** for global state (auth, theme, etc.)
- **Use local state** for component-specific data
- **Consider Zustand** for complex state management
- **Avoid prop drilling** when possible

### 3. API Design

- **Use RESTful conventions** for API endpoints
- **Return consistent response formats**
- **Handle errors gracefully**
- **Use proper HTTP status codes**
- **Document API endpoints** with comments

### 4. Security

- **Never expose secrets** in client-side code
- **Use HTTPS** in production
- **Validate all inputs** on both client and server
- **Use parameterized queries** for database operations
- **Implement rate limiting** for API endpoints

### 5. Performance

- **Use React.memo** for expensive components
- **Implement code splitting** for large applications
- **Optimize images** and assets
- **Use caching strategies** for API calls
- **Monitor performance** regularly

## Deployment

### 1. Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### 2. Environment Setup

Ensure all environment variables are set in production:

```bash
# Required
NEXT_PUBLIC_APP_URL=https://yourapp.com
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret

# Optional (based on features)
DATABASE_URL=your-production-database-url
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
```

### 3. Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Run `npm run type-check` to identify issues
   - Check for missing type definitions
   - Ensure all imports are correct

2. **Authentication not working**
   - Verify JWT secrets are set
   - Check environment variables
   - Review auth configuration

3. **Database connection issues**
   - Verify database URL is correct
   - Check database server is running
   - Review database configuration

4. **CSS/styling issues**
   - Check Tailwind CSS configuration
   - Verify CSS imports
   - Review component styling

### Debugging Tips

- **Use browser dev tools** for client-side issues
- **Check server logs** for backend issues
- **Use console.log** sparingly and remove in production
- **Set breakpoints** in VS Code for debugging
- **Use network tab** to inspect API calls

## Contributing

When contributing to the starter kit:

1. **Follow the existing code style**
2. **Add tests for new features**
3. **Update documentation**
4. **Use semantic versioning**
5. **Create pull requests** with clear descriptions

## Resources

- [Siriux Documentation](https://docs.siriux.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Get help from other developers
- **Email Support**: support@siriux.dev
- **Documentation**: https://docs.siriux.dev
