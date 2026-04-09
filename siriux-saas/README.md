# Siriux SaaS Platform

A production-ready SaaS application built with modern TypeScript, Node.js, and React.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+ (local or Amazon RDS)
- Snowflake account (optional, for analytics)

### Installation

```bash
# Clone the repository
git clone https://github.com/alsirius/siriux-saas.git
cd siriux-saas

# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit .env with your configuration

# Start development servers
npm run dev:backend    # Backend on port 3001
npm run dev:frontend   # Frontend on port 3000
```

## 📁 Project Structure

```
siriux-saas/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── packages/        # Core utilities (embedded @siriux code)
│   │   ├── dao/            # Data access layer
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Main server
│   └── package.json
├── frontend/                # Next.js React frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=siriux
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRY=24h

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Snowflake (optional)
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
```

## 🗄️ Database Setup

### PostgreSQL (Primary Database)
```bash
# Create database
createdb siriux

# Run migrations (when implemented)
npm run migrate
```

### Amazon RDS
Update your `.env` file with RDS connection details:
```bash
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_SSL=true
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production servers
npm start
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev:backend    # Start backend in development mode
npm run dev:frontend   # Start frontend in development mode
npm run build:backend  # Build backend for production
npm run build:frontend # Build frontend for production
npm run test          # Run tests
npm run lint          # Run linting
```

## 📊 Architecture

- **Backend**: Node.js with Express.js
- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL (primary), Snowflake (analytics)
- **Authentication**: JWT-based auth system
- **Architecture**: N-tier with clean separation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.