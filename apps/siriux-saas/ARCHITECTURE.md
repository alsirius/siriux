# Siriux SaaS Architecture Documentation

## Overview

The Siriux SaaS application demonstrates proper N-tier architecture using the @siriux package ecosystem. This architecture follows enterprise-grade patterns with clear separation of concerns and modular design principles.

## Architecture Principles

### 1. N-Tier Architecture

We implement a classic 4-tier architecture:

```
┌─────────────────────────────────────────────────┐
│              UI/UX Frontend Layer          │
├─────────────────────────────────────────────────┤
│              Routes Layer (HTTP API)      │
├─────────────────────────────────────────────────┤
│              Logic Layer (Business)         │
├─────────────────────────────────────────────────┤
│              DAO Layer (Data Access)         │
├─────────────────────────────────────────────────┤
│              Database Layer (Persistence)       │
└─────────────────────────────────────────────────┘
```

### 2. Package-Based Modularity

Following the Siriux platform rules:
- **@siriux/core**: Contracts, types, interfaces ONLY
- **@siriux/auth**: Authentication middleware and JWT logic
- **@siriux/ui**: React components and auth context
- **@siriux/config**: Configuration management
- **@siriux/logging**: Structured logging utilities

### 3. Separation of Concerns

Each layer has distinct responsibilities:
- **UI Layer**: User interface and experience
- **Routes Layer**: HTTP endpoints and API contracts
- **Logic Layer**: Business rules and validation
- **DAO Layer**: Data access and CRUD operations
- **Database Layer**: Persistence and storage

## Project Structure

```
siriux-monorepo/
├── packages/                    # @siriux package ecosystem
│   ├── core/                 # Types and interfaces
│   ├── auth/                 # Authentication middleware
│   ├── ui/                   # React components
│   ├── config/                # Configuration management
│   ├── logging/               # Logging utilities
│   └── docs/                  # Documentation
└── apps/
    └── siriux-saas/         # Main application
        ├── frontend/            # React/Next.js frontend
        │   ├── src/
        │   ├── app/           # Next.js app router
        │   ├── components/     # React components
        │   └── lib/           # Utilities and hooks
        │   ├── package.json
        │   └── next.config.js
        └── backend/             # Node.js/Express backend
            ├── src/
            │   ├── routes/        # HTTP endpoints (Routes layer)
            │   ├── dao/           # Data access (DAO layer)
            │   ├── services/       # Business logic (Logic layer)
            │   ├── middleware/     # Express middleware
            │   ├── types/          # Type definitions
            │   ├── server.ts        # Application entry point
            │   └── tsconfig.json
            └── package.json
```

## Layer Responsibilities

### 1. UI/UX Frontend Layer

**Technology Stack:**
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- @siriux/ui components for consistency

**Key Responsibilities:**
- User interface and experience
- Client-side routing and navigation
- State management and data fetching
- Form handling and validation
- Authentication context integration

### 2. Routes Layer (HTTP API)

**Technology Stack:**
- Express.js with TypeScript
- @siriux/auth middleware for JWT authentication
- @siriux/core types and contracts
- @siriux/logging for structured logging

**Key Responsibilities:**
- HTTP request/response handling
- API endpoint definition and routing
- Input validation and sanitization
- Authentication middleware integration
- Error handling and status codes
- API documentation through code structure

**Example Route Structure:**
```typescript
// routes/auth.ts
import { Router } from 'express';
import { createAuthMiddleware } from '@siriux/auth';

const router = Router();
const authMiddleware = createAuthMiddleware(authConfig);

router.post('/login', authMiddleware.tokenAuth, async (req, res) => {
  // Login logic
});

router.post('/register', authMiddleware.tokenAuth, async (req, res) => {
  // Registration logic
});

export default router;
```

### 3. Logic Layer (Business)

**Technology Stack:**
- TypeScript with strict mode
- @siriux/core types and interfaces
- @siriux/logging for operation logging
- Service layer pattern

**Key Responsibilities:**
- Business rule implementation
- Data validation and transformation
- Workflow orchestration
- Integration with external services
- Error handling and business logic

**Example Service Structure:**
```typescript
// services/UserService.ts
import { UserDao } from '../dao/UserDao';
import { AuthenticatedUser } from '@siriux/core';
import { Logger } from '@siriux/logging';

export class UserService {
  constructor(
    private userDao: UserDao,
    private logger: Logger
  ) {}

  async createUser(userData: CreateUserRequest): Promise<AuthResponse> {
    // Business logic for user creation
    // Validation, business rules, etc.
  }

  async authenticateUser(credentials: LoginRequest): Promise<AuthResponse> {
    // Business logic for authentication
    // Password validation, account status, etc.
  }
}
```

### 4. DAO Layer (Data Access)

**Technology Stack:**
- TypeScript with interface-based design
- @siriux/core types and contracts
- @siriux/logging for data operation logging
- Repository pattern implementation

**Key Responsibilities:**
- Database abstraction and CRUD operations
- Data mapping and transformation
- Query optimization and caching
- Transaction management
- Error handling for data operations

**Example DAO Structure:**
```typescript
// dao/UserDao.ts
import { AuthenticatedUser } from '@siriux/core';
import { Logger } from '@siriux/logging';

export interface UserDao {
  findById(id: string): Promise<AuthenticatedUser | null>;
  create(userData: CreateUserRequest): Promise<AuthenticatedUser>;
  update(id: string, updates: Partial<AuthenticatedUser>): Promise<AuthenticatedUser>;
  delete(id: string): Promise<boolean>;
}

export class UserDao implements UserDao {
  constructor(private logger: Logger) {}
  
  async findById(id: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Finding user by ID', { userId: id });
    // Database operation implementation
  }
}
```

### 5. Database Layer

**Technology Stack:**
- Abstracted through @siriux/core interfaces
- Multiple database support (SQLite, PostgreSQL, MySQL)
- Connection pooling and optimization
- Migration support

**Key Responsibilities:**
- Data persistence and storage
- Connection management and pooling
- Query execution and optimization
- Transaction management
- Data integrity and constraints

## Data Flow

```
User Request → Routes Layer → Logic Layer → DAO Layer → Database Layer
                ↓
              Response ← Routes Layer ← Logic Layer ← DAO Layer ← Database Layer
```

## Security Architecture

### Authentication Flow
1. **JWT-Based Authentication**: Using @siriux/auth package
2. **Token Management**: Access and refresh tokens
3. **Middleware Integration**: Express middleware for route protection
4. **Role-Based Access**: Admin, User, Manager roles

### Security Best Practices
- Input validation and sanitization
- Rate limiting and DDoS protection
- HTTPS enforcement in production
- CORS configuration for frontend access
- Secure token storage and transmission
- Audit logging for security events

## Configuration Management

### Environment-Based Configuration
- Development, staging, production environments
- Environment variable overrides
- Feature flags and toggles
- Database connection management

### Configuration Layers
```typescript
// Using @siriux/core
import { createDefaultConfig } from '@siriux/core';

const config = createDefaultConfig({
  jwtSecret: process.env.JWT_SECRET,
  database: {
    type: 'sqlite',
    connection: process.env.DATABASE_URL
  }
});
```

## Error Handling Strategy

### Layered Error Handling
1. **Database Layer**: Connection errors, constraint violations
2. **DAO Layer**: Data not found, operation failures
3. **Logic Layer**: Business rule violations, validation errors
4. **Routes Layer**: HTTP errors, malformed requests
5. **Global Handlers**: Uncaught exceptions, server errors

### Error Response Format
```typescript
// Standardized error responses
{
  success: false,
  error: {
    code: 'BUSINESS_RULE_VIOLATION',
    message: 'User account must be active',
    details: { field: 'status', value: 'inactive' }
  },
  timestamp: new Date().toISOString()
}
```

## Testing Strategy

### Multi-Layer Testing
1. **Unit Tests**: Each layer tested independently
2. **Integration Tests**: Layer interaction testing
3. **End-to-End Tests**: Full user journey testing
4. **Contract Tests**: Interface and type compliance

### Test Organization
```
tests/
├── unit/
│   ├── dao/           # DAO layer tests
│   ├── services/       # Logic layer tests
│   └── routes/         # Route handler tests
├── integration/
│   ├── auth-flows/     # Authentication flows
│   └── api/           # API integration
└── e2e/
    └── user-journeys/ # Full user scenarios
