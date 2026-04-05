# Packages Overview

Siriux is organized as a collection of focused packages that work together but can be used independently.

## 📦 Available Packages

### @siriux/core
**Core contracts and interfaces** - The stable foundation that all other packages depend on.

- 🏗️ TypeScript interfaces and contracts
- 🔧 Dependency injection interfaces  
- 📡 Event system contracts
- 🔌 Plugin system architecture
- 📝 Error handling standards

### @siriux/auth
**Authentication middleware** - JWT-based authentication for Node.js applications.

- 🔐 JWT token generation and verification
- 🛡️ Authentication middleware for Express
- 👥 Role-based access control
- 🔄 Token refresh mechanism
- 📱 Session management

### @siriux/ui
**React UI components** - Modern components built for SaaS applications.

- 🎨 Authentication forms (Login, Register, Forgot Password)
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark mode support
- 🔗 Authentication context and hooks
- ♿ Accessibility built-in

### @siriux/access-control
**Security and permissions** - Role-based access control, permissions, and policies.

- 🛡️ Role-based permissions (RBAC)
- � Security guards (Ownership, Time, IP, Role)
- 📋 Policy engine with conditions
- 🔧 Express middleware integration
- 🎯 Fine-grained permission system

### @siriux/logging
**Logging and observability** - Structured logging with correlation IDs and multiple transports.

- 📊 Structured logging with correlation IDs
- 🚀 Multiple transport support (Console, File, HTTP)
- ⏱️ Performance metrics tracking
- 🌐 Express middleware for request logging
- ⚙️ Configurable log levels and formats

### @siriux/config
**Configuration management** - Environment variables management and validation.

- 🔧 Environment variable validation with Joi
- 🛡️ Type-safe configuration interfaces
- 🎛️ Feature flag management
- 🌍 Multiple environment support
- 📝 Configuration schema validation

### @siriux/docs
**Documentation platform** - VitePress-based documentation site and tools.

- 📚 Professional VitePress documentation site
- 🔍 Search functionality
- 📱 Mobile-responsive design
- 🌙 Dark mode support
- 📖 API documentation templates

## �🔄 Package Dependencies

```
@siriux/core (v2.0.0)
├── @siriux/auth (v1.0.0) ── depends on core
├── @siriux/ui (v1.0.0) ──── depends on core
├── @siriux/access-control (v1.0.0) ── depends on core
├── @siriux/logging (v1.0.0) ── depends on core
├── @siriux/config (v1.0.0) ── depends on core
└── @siriux/docs (v1.0.0) ──── documentation
```

## 📋 Usage Examples

### Authentication Only
```bash
npm install @siriux/core @siriux/auth
```

### UI Components Only  
```bash
npm install @siriux/core @siriux/ui
```

### Full Stack with Security
```bash
npm install @siriux/core @siriux/auth @siriux/ui @siriux/access-control
```

### Complete SaaS Platform
```bash
npm install @siriux/core @siriux/auth @siriux/ui @siriux/access-control @siriux/logging @siriux/config
```

### All Packages
```bash
npm install @siriux/core @siriux/auth @siriux/ui @siriux/access-control @siriux/logging @siriux/config @siriux/docs
```

## 🚀 Installation

```bash
# Individual packages
npm install @siriux/core
npm install @siriux/auth  
npm install @siriux/ui
npm install @siriux/access-control
npm install @siriux/logging
npm install @siriux/config
npm install @siriux/docs

# Or all at once
npm install @siriux/core @siriux/auth @siriux/ui @siriux/access-control @siriux/logging @siriux/config @siriux/docs
```

### CLI Tool
```bash
# Create new project with all packages
npm create siriux-app@latest my-app

# With specific template
npm create siriux-app@latest my-saas --template saas
```

## 📚 Package Guides

- [@siriux/core Guide](/packages/core)
- [@siriux/auth Guide](/packages/auth)  
- [@siriux/ui Guide](/packages/ui)
- [@siriux/access-control Guide](/packages/access-control)
- [@siriux/logging Guide](/packages/logging)
- [@siriux/config Guide](/packages/config)
- [@siriux/docs Guide](/packages/docs)

## 🛠️ Tools

- [CLI Tool](/tools/cli) - Project scaffolding and development tools
- [Starter Kit](/tools/starter-kit) - Dynamic MVP application

## 📊 Package Matrix

| Package | Core | Auth | UI | Access Control | Logging | Config | Docs |
|---------|------|------|-----|----------------|---------|--------|------|
| **@siriux/core** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **@siriux/auth** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **@siriux/ui** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **@siriux/access-control** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **@siriux/logging** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **@siriux/config** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **@siriux/docs** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
