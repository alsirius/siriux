# {{appName}} - Your SaaS Application

{{description}}

## 🏗️ Architecture

This is a full-stack SaaS application built with the Siriux platform:

```
my-saas/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js API backend
├── shared/            # Shared types and utilities
├── config/            # Dynamic configuration
└── database/          # Database setup and migrations
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL (for production)
- Redis (for caching/sessions)

### Installation

```bash
# Install dependencies for all packages
npm install

# Start development servers
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Development

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build all packages
npm run build

# Run tests
npm test
```

## 📁 Project Structure

### Frontend (`frontend/`)
- Next.js 14 with App Router
- Tailwind CSS for styling
- Siriux UI components
- Authentication integration

### Backend (`backend/`)
- Express.js API server
- JWT authentication
- Role-based access control
- Structured logging
- PostgreSQL integration

### Shared (`shared/`)
- TypeScript types
- API interfaces
- Utility functions
- Frontend/backend communication

### Configuration (`config/`)
- Dynamic app configuration
- Environment variables
- Feature flags
- Theme customization

## 🔧 Configuration

Edit `config/app-config.ts` to customize:

```typescript
export const appConfig = {
  app: {
    name: "Your App Name",
    tagline: "Your tagline",
    description: "What your app does"
  },
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981"
  },
  features: {
    authentication: true,
    analytics: true,
    blog: false
  }
};
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the .next folder
```

### Backend Deployment

```bash
cd backend
npm run build
# Deploy the dist folder
```

### Environment Variables

Create `.env.local` for frontend and `.env` for backend:

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@siriux/auth** - Authentication

### Backend
- **Express.js** - API framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Redis** - Caching
- **@siriux/auth** - Authentication
- **@siriux/access-control** - RBAC
- **@siriux/logging** - Logging
- **@siriux/core**: Core utilities & database interfaces
- **@siriux/config**: Configuration management

## 📚 Learn More

- [Siriux Documentation](https://docs.siriux.dev)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using [Siriux](https://siriux.dev) - The Modern SaaS Platform Toolkit
