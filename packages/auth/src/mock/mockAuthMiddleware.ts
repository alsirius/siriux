import { Request, Response, NextFunction } from 'express';
import { MockAuthService } from './mockAuthService';

// Simple in-memory database interface
interface MockDatabase {
  initialize(): Promise<void>;
  getUserByEmail(email: string): Promise<any>;
  getUserById(id: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  createSession(data: any): Promise<any>;
  getSessionByToken(token: string): Promise<any>;
  deleteSession(token: string): Promise<void>;
  logAudit(entry: any): Promise<void>;
  getStats(): Promise<any>;
  getAuditLogs(userId?: string): Promise<any[]>;
  reset(): Promise<void>;
}

// Simple in-memory database implementation
class SimpleMockDatabase implements MockDatabase {
  private users: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();
  private auditLogs: any[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Seed demo users
    this.users.set('admin@siriux.dev', {
      id: '1',
      email: 'admin@siriux.dev',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.users.set('user@siriux.dev', {
      id: '2',
      email: 'user@siriux.dev',
      password: 'user123',
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.users.set('manager@siriux.dev', {
      id: '3',
      email: 'manager@siriux.dev',
      password: 'manager123',
      firstName: 'Manager',
      lastName: 'User',
      role: 'manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.initialized = true;
  }

  async getUserByEmail(email: string): Promise<any> {
    await this.initialize();
    return this.users.get(email) || null;
  }

  async getUserById(id: string): Promise<any> {
    await this.initialize();
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async createUser(userData: any): Promise<any> {
    await this.initialize();
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(user.email, user);
    return user;
  }

  async createSession(data: any): Promise<any> {
    await this.initialize();
    const session = { id: Date.now().toString(), ...data };
    this.sessions.set(data.accessToken, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<any> {
    await this.initialize();
    return this.sessions.get(token) || null;
  }

  async deleteSession(token: string): Promise<void> {
    await this.initialize();
    this.sessions.delete(token);
  }

  async logAudit(entry: any): Promise<void> {
    await this.initialize();
    this.auditLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    });
  }

  async getStats(): Promise<any> {
    await this.initialize();
    const usersByRole: Record<string, number> = {};
    for (const user of this.users.values()) {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    }
    return {
      totalUsers: this.users.size,
      totalSessions: this.sessions.size,
      totalAuditLogs: this.auditLogs.length,
      usersByRole
    };
  }

  async getAuditLogs(userId?: string): Promise<any[]> {
    await this.initialize();
    let logs = this.auditLogs;
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    return logs.slice(-50).reverse(); // Last 50 logs, newest first
  }

  async reset(): Promise<void> {
    this.users.clear();
    this.sessions.clear();
    this.auditLogs = [];
    this.initialized = false;
    await this.initialize();
  }
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export class MockAuthMiddleware {
  private authService: MockAuthService;

  constructor(database?: MockDatabase) {
    // Use provided database or create a new one
    const db = database || new SimpleMockDatabase();
    this.authService = new MockAuthService(db);
  }

  // Express middleware for token authentication
  tokenAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Validate token
      const validation = await this.authService.validateToken(token);
      
      if (!validation.valid) {
        res.status(401).json({ error: validation.error || 'Invalid token' });
        return;
      }

      // Attach user to request
      if (validation.user) {
        req.user = {
          id: validation.user.id,
          email: validation.user.email,
          role: validation.user.role
        };
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  };

  // Role-based access control middleware
  roleAuth = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // First check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'Authentication required' });
          return;
        }

        // Check if user has required role
        if (!allowedRoles.includes(req.user.role)) {
          res.status(403).json({ error: 'Insufficient permissions' });
          return;
        }

        next();
      } catch (error) {
        console.error('Role auth middleware error:', error);
        res.status(500).json({ error: 'Authorization failed' });
      }
    };
  };

  // Admin-only middleware
  adminAuth = this.roleAuth(['admin']);

  // User or admin middleware
  userAuth = this.roleAuth(['user', 'admin']);

  // Manager or admin middleware
  managerAuth = this.roleAuth(['manager', 'admin']);

  // Get auth service instance
  getAuthService(): MockAuthService {
    return this.authService;
  }

  // Mock API routes (for development/demo)
  getMockRoutes() {
    const authService = this.authService;

    return {
      // Login endpoint
      'POST /api/auth/login': async (req: Request, res: Response) => {
        try {
          const { email, password } = req.body;
          const result = await authService.login({ email, password });
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(401).json(result);
          }
        } catch (error) {
          res.status(500).json({ error: 'Login failed' });
        }
      },

      // Register endpoint
      'POST /api/auth/register': async (req: Request, res: Response) => {
        try {
          const { email, password, firstName, lastName } = req.body;
          const result = await authService.register({ email, password, firstName, lastName });
          
          if (result.success) {
            res.status(201).json(result);
          } else {
            res.status(400).json(result);
          }
        } catch (error) {
          res.status(500).json({ error: 'Registration failed' });
        }
      },

      // Refresh token endpoint
      'POST /api/auth/refresh': async (req: Request, res: Response) => {
        try {
          const { refreshToken } = req.body;
          const result = await authService.refreshToken(refreshToken);
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(401).json(result);
          }
        } catch (error) {
          res.status(500).json({ error: 'Token refresh failed' });
        }
      },

      // Logout endpoint
      'POST /api/auth/logout': async (req: Request, res: Response) => {
        try {
          const authHeader = req.headers.authorization;
          const token = authHeader?.substring(7);
          
          if (token) {
            await authService.logout(token);
          }
          
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: 'Logout failed' });
        }
      },

      // Get profile endpoint
      'GET /api/auth/profile': async (req: Request, res: Response) => {
        try {
          if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
          }

          const result = await authService.getUserProfile(req.user.id);
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(404).json(result);
          }
        } catch (error) {
          res.status(500).json({ error: 'Failed to get profile' });
        }
      },

      // Get stats endpoint (admin only)
      'GET /api/auth/stats': async (req: Request, res: Response) => {
        try {
          if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
          }

          const stats = await authService.getStats();
          res.json(stats);
        } catch (error) {
          res.status(500).json({ error: 'Failed to get stats' });
        }
      },

      // Get audit logs endpoint (admin only)
      'GET /api/auth/audit-logs': async (req: Request, res: Response) => {
        try {
          if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
          }

          const userId = req.query.userId as string;
          const logs = await authService.getAuditLogs(userId);
          res.json(logs);
        } catch (error) {
          res.status(500).json({ error: 'Failed to get audit logs' });
        }
      }
    };
  }

  // Apply mock routes to Express app
  applyMockRoutes(app: any): void {
    const routes = this.getMockRoutes();
    
    Object.entries(routes).forEach(([route, handler]) => {
      const [method, path] = route.split(' ');
      
      switch (method) {
        case 'GET':
          app.get(path, handler);
          break;
        case 'POST':
          app.post(path, handler);
          break;
        case 'PUT':
          app.put(path, handler);
          break;
        case 'DELETE':
          app.delete(path, handler);
          break;
      }
    });

    console.log('🎭 Mock auth routes applied');
  }
}

// Factory function
export const createMockAuthMiddleware = (database?: MockDatabase) => {
  return new MockAuthMiddleware(database);
};
