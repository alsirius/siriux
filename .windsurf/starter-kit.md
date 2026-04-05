# Siriux Starter Kit - AI Guidelines

## 🎯 Purpose

This document ensures AI assistants follow Siriux platform architecture when users create projects from the Siriux starter kit.

## 📦 Starter Kit Architecture

### Core Principles
1. **Modular by Default** - Use individual @siriux packages
2. **TypeScript First** - All code must be strongly typed
3. **Security Built-in** - Authentication and validation everywhere
4. **Developer Experience** - Hot reload, clear errors, comprehensive docs

### Package Dependencies
```json
{
  "dependencies": {
    "@siriux/core": "^2.0.0",    // Contracts and types
    "@siriux/auth": "^1.0.0",    // Authentication middleware
    "@siriux/ui": "^1.0.0"       // React components
  }
}
```

## 🏗️ Project Structure Rules

### Backend Structure (if applicable)
```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.ts              # @siriux/auth integration
│   ├── routes/
│   │   └── userRoutes.ts         # Protected routes
│   ├── controllers/
│   │   └── UserController.ts     # Business logic
│   ├── services/
│   │   └── UserService.ts        # Data access
│   └── types/
│       └── index.ts              # Local types only
├── package.json
└── tsconfig.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # AuthProvider wrapper
│   │   ├── page.tsx              # Landing page
│   │   └── (auth)/
│   │       ├── login/page.tsx    # Login form
│   │       └── register/page.tsx # Registration
│   ├── components/
│   │   ├── Providers.tsx         # @siriux/ui AuthProvider
│   │   └── ui/                    # Custom UI components
│   └── lib/
│       └── api.ts                # API client
├── package.json
└── next.config.js
```

## 🔧 Integration Rules

### Backend Integration
```typescript
// middleware/auth.ts - ALWAYS use this pattern
import { createAuthMiddleware, createDefaultAuthConfig } from '@siriux/auth';

const auth = createAuthMiddleware(createDefaultAuthConfig({
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!
}));

export const tokenAuth = auth.tokenAuth;
export const adminAuth = auth.adminAuth;
```

### Frontend Integration
```typescript
// components/Providers.tsx - ALWAYS use this pattern
'use client';
import { AuthProvider } from '@siriux/ui';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

## 📋 Required Files

### Environment Variables (.env)
```bash
# Required for @siriux/auth
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database
DATABASE_URL=your-database-connection

# Optional
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
```

### Database Schema
```sql
-- Minimum required user table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚫 Anti-Patterns for Starter Kit

### NEVER Do:
- Create custom authentication logic
- Import from individual packages instead of @siriux/core
- Mix frontend and backend concerns
- Hard-code credentials or secrets
- Skip TypeScript configuration
- Ignore security best practices

### ALWAYS Do:
- Use @siriux packages as intended
- Follow TypeScript strict mode
- Implement proper error handling
- Use environment variables for secrets
- Write tests for custom logic
- Include comprehensive documentation

## 🎨 UI/UX Guidelines

### Component Usage
```typescript
// Use @siriux/ui components
import { LoginForm, useAuth } from '@siriux/ui';

function LoginPage() {
  return (
    <LoginForm 
      onSuccess={(user, tokens) => {
        // Handle successful login
      }}
    />
  );
}
```

### Styling Rules
- Use Tailwind CSS classes
- Follow responsive design principles
- Implement dark mode support
- Ensure accessibility (ARIA labels, keyboard navigation)

## 🔍 Code Quality Standards

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}
```

### ESLint Rules
- No console.log in production
- All imports must be used
- Prefer const over let
- Use descriptive variable names

### Testing Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI interactions
- E2E tests for critical user flows

## 📚 Documentation Requirements

### README.md Structure
1. Project overview
2. Technology stack
3. Installation instructions
4. Environment setup
5. Available scripts
6. API documentation
7. Deployment guide

### Code Documentation
- JSDoc comments for all functions
- Type annotations for all variables
- Usage examples for complex logic
- Clear error messages

## 🚀 Deployment Guidelines

### Production Setup
- Use HTTPS everywhere
- Set proper CORS policies
- Implement rate limiting
- Use production-ready database
- Set up monitoring and logging

### Environment Management
- Separate .env files for each environment
- Use secrets management in production
- Implement proper CI/CD pipeline
- Version control all configuration

## 🔄 AI Assistant Workflow

### When Creating New Features:
1. **Check @siriux contracts** - Use types from @siriux/core
2. **Follow package boundaries** - Don't mix concerns
3. **Implement security first** - Validate all inputs
4. **Write tests** - Ensure reliability
5. **Update docs** - Keep documentation current

### When Fixing Bugs:
1. **Reproduce issue** - Understand root cause
2. **Check dependencies** - Verify @siriux package versions
3. **Fix in scope** - Don't change unrelated code
4. **Add tests** - Prevent regression
5. **Document fix** - Explain solution

### When Adding Packages:
1. **Check compatibility** - Ensure it works with @siriux
2. **Update dependencies** - Add to package.json
3. **Configure properly** - Follow package setup guide
4. **Test integration** - Verify everything works
5. **Update docs** - Document new capabilities

## 📋 Starter Kit Checklist

### Initial Setup:
- [ ] @siriux packages installed
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] TypeScript configured
- [ ] ESLint and Prettier set up

### Authentication:
- [ ] Backend middleware configured
- [ ] Frontend AuthProvider set up
- [ ] Login/logout flows working
- [ ] Protected routes implemented
- [ ] Token refresh working

### UI/UX:
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility features
- [ ] Error handling
- [ ] Loading states

### Documentation:
- [ ] README.md complete
- [ ] API documentation
- [ ] Setup instructions
- [ ] Deployment guide
- [ ] Contributing guidelines

---

**Remember**: The starter kit should demonstrate best practices for using Siriux packages while providing a solid foundation for custom SaaS applications.
