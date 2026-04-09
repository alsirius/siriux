# Siriux Platform - AI Coding Rules

## 🏗️ Architecture Rules

### Monorepo Structure
```
siriux-monorepo/
├── create-siriux-app/      # CLI tool for creating new Siriux apps
│   ├── src/
│   │   ├── cli.ts         # Main CLI logic
│   │   ├── creator.ts     # App creation logic
│   │   └── index.ts       # Entry point
│   ├── templates/         # App templates
│   ├── package.json
│   └── tsconfig.json
├── landing-page/          # Static marketing site (separate from app)
│   └── index.html         # Landing page for marketing
├── apps/
│   └── siriux-saas/       # Main SaaS application (what developers clone)
│       ├── frontend/      # Next.js frontend with dashboard as home page
│       └── backend/       # Express.js backend with N-tier architecture
├── packages/              # Shared packages
│   ├── core/             # Types, interfaces, database utilities
│   ├── auth/             # Authentication middleware
│   ├── logging/          # Structured logging
│   ├── ui/               # React components
│   ├── config/           # Configuration management
│   ├── access-control/   # RBAC and security
│   └── docs/             # Documentation
└── .windsurf/            # AI coding rules and documentation
```

### Package Responsibilities
- **@siriux/core**: Contracts, types, interfaces ONLY (no implementation)
- **@siriux/auth**: Authentication middleware and JWT logic
- **@siriux/ui**: React components and auth context
- **@siriux/access-control**: RBAC and security guards
- **@siriux/logging**: Structured logging with correlation IDs
- **@siriux/config**: Environment validation and management
- **@siriux/docs**: Documentation and guides

## 🏗️ N-Tier Architecture

### Application Structure
Siriux follows enterprise N-tier architecture for applications:

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

### Layer Responsibilities
- **UI Layer**: React/Next.js with @siriux/ui components
- **Routes Layer**: Express.js HTTP endpoints with @siriux/auth
- **Logic Layer**: Business rules and validation (Services)
- **DAO Layer**: Data access and CRUD operations
- **Database Layer**: Persistence with @siriux/core database utilities

##  Development Guidelines

### Code Style
- **TypeScript strict mode** always enabled
- **ESLint + Prettier** for consistent formatting
- **Descriptive error messages** with error codes
- **JSDoc comments** for all public APIs

### Testing
- **Unit tests** for all core logic
- **Integration tests** for package interactions
- **Storybook** for UI components
- **Type checking** as part of CI/CD

### Documentation
- **README.md** in every package
- **API documentation** for all public methods
- **Usage examples** in documentation
- **Changelog** for version changes

## 🎯 Development Guidelines

### When Working on Siriux:
1. **Check package boundaries** - Don't mix concerns
2. **Import from core** - Use @siriux/core for types
3. **Maintain compatibility** - Don't break existing APIs
4. **Write tests** - Add tests for new functionality
5. **Update docs** - Document API changes

### NEVER Do:
- Put implementation logic in @siriux/core
- Create circular dependencies between packages
- Use monolithic package structure
- Hard-code business logic in reusable packages
- Break semantic versioning

### ALWAYS Do:
- Import types from @siriux/core
- Keep packages focused and single-purpose
- Use dependency injection for extensibility
- Write comprehensive tests
- Follow semantic versioning

## 🔍 Code Review Checklist

### Before Submitting Changes:
- [ ] Package boundaries respected
- [ ] Types imported from @siriux/core
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No breaking changes (or version bumped)
- [ ] Linting and formatting applied

### Integration Testing:
- [ ] Package builds successfully
- [ ] Dependencies resolve correctly
- [ ] TypeScript compilation passes
- [ ] Examples work as expected

## 📋 Common Tasks

### Adding New Package:
1. Create package directory in `/packages/`
2. Initialize with focused scope
3. Import types from @siriux/core
4. Write comprehensive tests
5. Add documentation

### Updating Existing Package:
1. Check for breaking changes
2. Update version if needed
3. Update tests and docs
4. Verify package builds
5. Test integration

### Adding New Feature:
1. Define interfaces in @siriux/core
2. Implement in appropriate package
3. Write tests
4. Update documentation
5. Verify no breaking changes

## 🚨 Security Rules

### Authentication Package:
- Use strong JWT secrets
- Implement proper token validation
- Handle edge cases gracefully
- No hardcoded credentials

### General Security:
- Validate all inputs
- Use HTTPS in production
- Implement rate limiting
- Follow OWASP guidelines

## 📚 Documentation Standards

### Package README Structure:
1. Installation
2. Quick Start
3. API Reference
4. Examples
5. Contributing

### Code Documentation:
- JSDoc for all public APIs
- Type annotations everywhere
- Usage examples in docs
- Clear error messages

---

**Remember**: Siriux is a platform, not a framework. Focus on reusability, modularity, and developer experience.
