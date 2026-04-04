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

### @siriux/ui *(Coming Soon)*
React components and UI utilities for modern web interfaces.

### @siriux/cli *(Coming Soon)*
Command-line tool for scaffolding new SaaS projects.

### @siriux/pro *(Coming Soon)*
Premium features and enterprise components.

## 🏗️ Monorepo Structure

```
siriux-monorepo/
├── packages/
│   ├── core/         # Authentication and API utilities
│   ├── ui/           # React components
│   ├── cli/          # Project scaffolding
│   └── pro/          # Premium features
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
