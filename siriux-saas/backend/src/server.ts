import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createDefaultConfig, SiriuxConfig } from './packages';
import { createDefaultAuthConfig, createAuthMiddleware } from './packages';
import { createLogger, Logger } from './packages';
import { createRoleDao } from './dao/RoleDao';
import { createInvitationDao } from './dao/InvitationDao';
import { RoleService } from './services/RoleService';
import { InvitationService } from './services/InvitationService';
import { createRoleRoutes } from './routes/roles';
import { createInvitationRoutes } from './routes/invitations';
import { InMemoryMockDatabase } from './packages';

// Load environment variables
dotenv.config();

class Server {
  private app: Application;
  private config: SiriuxConfig;
  private logger: Logger;

  constructor() {
    this.app = express();
    this.config = createDefaultConfig();
    this.logger = createLogger({ service: 'siriux-app' });
    this.setupMiddleware();
    this.setupErrorHandling();
  }

  public async initialize(): Promise<void> {
    await this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later'
        }
      }
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Auth middleware
    const authConfig = createDefaultAuthConfig({
      jwtSecret: this.config.jwtSecret
    });
    const authMiddlewareInstance = createAuthMiddleware(authConfig);
    this.app.use('/api', authMiddlewareInstance.tokenAuth);

    // Request logging
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      this.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        success: true,
        data: {
          status: 'OK',
          message: 'Siriux SaaS Backend is running',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    });

    // Initialize N-tier layers
    try {
      // Check if PostgreSQL is configured
      const usePostgreSQL = process.env['PGPASSWORD'] && process.env['PGHOST'];

      if (usePostgreSQL) {
        // Use PostgreSQL if configured
        const roleDao = await createRoleDao(this.logger);
        const invitationDao = await createInvitationDao(this.logger);

        // Create service layer
        const roleService = new RoleService(roleDao, this.logger);
        const invitationService = new InvitationService(invitationDao, this.logger);

        // Wire up routes
        const roleRoutes = createRoleRoutes(roleService);
        const invitationRoutes = createInvitationRoutes(invitationService);

        // API routes
        this.app.use('/api/roles', roleRoutes);
        this.app.use('/api/invitations', invitationRoutes);

        this.logger.info('N-tier layers initialized with PostgreSQL');
      } else {
        // Use in-memory database for development
        const inMemoryDb = new InMemoryMockDatabase();
        await inMemoryDb.initialize();

        this.logger.info('N-tier layers initialized with in-memory database');
      }
    } catch (error) {
      this.logger.error('Failed to initialize N-tier layers', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: `Route ${req.method} ${req.originalUrl} not found`
        },
        timestamp: new Date().toISOString()
      });
    });

    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      this.logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: process.env['NODE_ENV'] === 'development' ? err.message : 'Internal server error',
          ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  public async start(): Promise<void> {
    await this.initialize();
    
    const port = parseInt(process.env['PORT'] || '8000');
    
    this.app.listen(port, () => {
      this.logger.info('Server started', {
        port,
        environment: process.env['NODE_ENV'],
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      });

      console.log('\n=== Siriux SaaS Backend ===');
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
      console.log('========================\n');
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// Start the server
const server = new Server();
server.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default server;
