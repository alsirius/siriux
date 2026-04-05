// Example: Using the mock authentication system
// This demonstrates how to set up a complete mock auth system for development

import express from 'express';
import { 
  createMockAuthMiddleware, 
  createSmartAuthConfig,
  isMockMode,
  MockAuthService 
} from '@siriux/auth';

// 1. Smart configuration - automatically detects mock mode
const config = createSmartAuthConfig({
  jwtSecret: 'your-secret-key', // Only used in production
  tokenExpiry: '24h'
});

console.log('🎭 Mock mode enabled:', isMockMode());

// 2. Create Express app
const app = express();
app.use(express.json());

// 3. Create mock auth middleware
const authMiddleware = createMockAuthMiddleware();

// 4. Apply authentication middleware
app.use('/api/protected', authMiddleware.tokenAuth);

// 5. Apply mock API routes (for development)
if (isMockMode()) {
  authMiddleware.applyMockRoutes(app);
  console.log('🎭 Mock API routes applied');
}

// 6. Protected route example
app.get('/api/protected/profile', authMiddleware.tokenAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// 7. Admin-only route example
app.get('/api/admin/stats', 
  authMiddleware.tokenAuth, 
  authMiddleware.adminAuth, 
  (req, res) => {
    res.json({
      message: 'Admin-only data',
      user: req.user
    });
  }
);

// 8. Direct usage of MockAuthService
app.get('/api/demo/direct-auth', async (req, res) => {
  if (!isMockMode()) {
    return res.status(404).json({ error: 'Not available in production' });
  }

  const authService = authMiddleware.getAuthService();
  
  try {
    // Demo login
    const loginResult = await authService.login({
      email: 'admin@siriux.dev',
      password: 'admin123'
    });
    
    res.json({
      loginResult,
      stats: await authService.getStats()
    });
  } catch (error) {
    res.status(500).json({ error: 'Demo failed' });
  }
});

// 9. Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  if (isMockMode()) {
    console.log('\n🎭 Mock Authentication Demo');
    console.log('Available accounts:');
    console.log('  Admin: admin@siriux.dev / admin123');
    console.log('  User: user@siriux.dev / user123');
    console.log('  Manager: manager@siriux.dev / manager123');
    console.log('\nTry these endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/auth/login`);
    console.log(`  GET  http://localhost:${PORT}/api/protected/profile`);
    console.log(`  GET  http://localhost:${PORT}/api/admin/stats`);
    console.log(`  GET  http://localhost:${PORT}/api/demo/direct-auth`);
  }
});

// 10. Environment-based usage example
export class ExampleService {
  private authService: MockAuthService;
  
  constructor() {
    // In development, use mock service
    if (isMockMode()) {
      this.authService = new MockAuthService();
      console.log('🎭 Using mock authentication');
    } else {
      // In production, use real auth service
      // this.authService = new RealAuthService(config);
      console.log('🔐 Using production authentication');
    }
  }
  
  async authenticateUser(email: string, password: string) {
    return await this.authService.login({ email, password });
  }
}

// Usage examples:
/*
// npm install @siriux/auth

// Development - automatically uses mock
import { createSmartAuthConfig, isMockMode } from '@siriux/auth';

const config = createSmartAuthConfig();
console.log('Mock mode:', isMockMode());

// Production - set environment variables
// JWT_SECRET=your-real-secret
// SIRIUX_MOCK_MODE=false
*/
