# Siriux SaaS Starter Kit

A complete, production-ready SaaS starter kit with separate frontend and backend architecture.

## **Quick Start**

### **Prerequisites**
- Node.js 18+
- MongoDB (or use MongoDB Atlas)

### **Setup & Installation**

```bash
# Clone the repository
git clone -b monorepo-packages https://github.com/alsirius/siriux.git
cd siriux/apps/siriux-saas

# Setup Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm run dev
```

### **Access Points**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## **Architecture**

### **Frontend** (`/frontend`)
- Next.js 15.1.0 with React 18
- TailwindCSS for styling
- TypeScript for type safety
- Authentication system
- Database integration demos
- Responsive design

### **Backend** (`/backend`)
- Express.js REST API
- JWT authentication
- MongoDB with Mongoose
- Rate limiting & security
- CORS configuration
- Environment-based config

## **Features**

### **Authentication**
- User registration & login
- JWT token management
- Password hashing with bcrypt
- Protected routes
- Session management

### **Database Integration**
- MongoDB integration
- Mock data factories
- Multiple database support
- Connection management
- Error handling

### **UI Components**
- Modern React components
- Responsive design
- Dark/light themes
- Form validation
- Loading states

### **Developer Experience**
- Hot reload in development
- TypeScript support
- ESLint configuration
- Environment variables
- Error boundaries

## **Deployment**

### **Frontend Deployment**
```bash
cd frontend
npm run build
npm start
```

### **Backend Deployment**
```bash
cd backend
npm install
npm start
```

### **Docker Deployment**
```bash
docker-compose up -d
```

## **Environment Variables**

### **Backend (.env)**
```bash
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
DATABASE_URL=mongodb://localhost:27017/siriux-saas
JWT_SECRET=your-production-secret
```

### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### **Users**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account

### **Data**
- `GET /api/data/` - Get data
- `POST /api/data/` - Create data
- `PUT /api/data/:id` - Update data
- `DELETE /api/data/:id` - Delete data

## **Project Structure**

```
siriux-saas/
frontend/          # Next.js frontend application
  src/
    app/          # App router pages
    components/   # React components
    config/       # Configuration files
    lib/          # Utility functions
  public/         # Static assets
  package.json    # Frontend dependencies

backend/           # Express.js backend API
  routes/         # API routes
  models/         # Database models
  middleware/     # Express middleware
  utils/          # Backend utilities
  server.js       # Main server file
  package.json    # Backend dependencies
```

## **Development Scripts**

### **Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### **Backend**
```bash
npm run dev        # Start with nodemon
npm run start      # Start production server
npm run build      # Build (placeholder)
```

## **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## **License**

MIT License - feel free to use this for your projects!

## **Support**

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the example code

---

**Built with love for the developer community!**
