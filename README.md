# Siriux Monorepo 🚀

A comprehensive SaaS starter kit monorepo containing reusable packages for building modern web applications.

## 📦 Packages

### @siriux/core
Authentication, database, and API utilities for Node.js/Express applications.

**Features:**
- JWT authentication middleware
- Role-based access control (RBAC)
- Token generation and verification
- TypeScript support
- Configuration helpers

**Installation:**
```bash
npm install @siriux/core
```

**Usage:**
```typescript
import { createAuthMiddleware, createDefaultConfig } from '@siriux/core';

const config = createDefaultConfig({
  jwtSecret: process.env.JWT_SECRET
});

const auth = createAuthMiddleware(config);
app.use('/api/protected', auth.tokenAuth);
```

### @siriux/ui
Complete React component library with authentication and UI components built with Radix UI and Tailwind CSS.

**Features:**
- Authentication components (LoginForm, RegisterForm, ForgotPasswordForm)
- Auth context and hooks for state management
- Layout components (Header, Sidebar, Footer)
- UI components (Button, Input, Card, Badge, Modal, Navigation)
- Hybrid Icon system with 500+ Lucide icons + custom SVG support
- Radix UI for accessibility
- Storybook integration
- TypeScript support

**Installation:**
```bash
npm install @siriux/ui
```

**Usage:**
```typescript
import { AuthProvider, LoginForm, Icon } from '@siriux/ui';

function App() {
  return (
    <AuthProvider>
      <div>
        <LoginForm redirectTo="/dashboard" />
        <Icon name="shield" size="lg" /> {/* Custom SVG */}
        <Icon name="user" size="md" />    {/* Lucide icon */}
      </div>
    </AuthProvider>
  );
}
```

### @siriux/cli *(Coming Soon)*
Command-line tool for scaffolding new SaaS projects.

### @siriux/pro *(Coming Soon)*
Premium features and enterprise components.

## 🏗️ Monorepo Structure

```
siriux-monorepo/
├── packages/
│   ├── core/         # Authentication and API utilities
│   ├── auth/         # JWT authentication middleware
│   ├── ui/           # React component library
│   ├── access-control/ # RBAC and security guards
│   ├── logging/      # Structured logging with correlation IDs
│   ├── config/       # Environment validation and management
│   ├── docs/         # Documentation site
│   └── ui-starter/   # Deprecated (use @siriux/ui instead)
├── apps/
│   └── starter-next-saas/ # Dynamic SaaS starter kit
├── create-siriux-app/ # CLI tool for project scaffolding
├── templates/        # Project templates
├── lerna.json        # Monorepo configuration
└── package.json      # Root configuration
```

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install all dependencies
npm install

# Bootstrap all packages
npm run bootstrap

# Build all packages
npm run build

# Run tests
npm run test

# Publish all packages
npm run publish
```

### Individual Package Development
```bash
# Work on specific package
cd packages/core
npm run dev

# Build specific package
npm run build

# Test specific package
npm test
```

## 📋 Scripts

- `npm run bootstrap` - Install and link all packages
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run publish` - Publish all packages
- `npm run clean` - Clean all build outputs
- `npm run dev` - Run all packages in development mode

## 🔄 Version Management

This monorepo uses **independent versioning** with Lerna, meaning each package can have its own version number and can be published independently.

## 📝 Publishing

Packages are published to the `@siriux` scope on npm:

```bash
# Publish specific package
cd packages/core
npm publish

# Publish all packages with updates
npm run publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [NPM Organization](https://www.npmjs.com/org/siriux)
- [GitHub Repository](https://github.com/alsirius/siriux)
- [Documentation](https://docs.siriux.dev)

---

Built with ❤️ for the SaaS development community
