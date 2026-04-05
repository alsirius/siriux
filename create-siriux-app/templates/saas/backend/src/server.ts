import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createAuthMiddleware } from '@siriux/auth';
import { AccessControlManager } from '@siriux/access-control';
import { createLogger } from '@siriux/logging';
import { ConfigManager } from '@siriux/config';
import { UserRole, Permission } from '@siriux/core';

// Load configuration
const config = new ConfigManager().load();

// Create logger
const logger = createLogger({
  service: config.app.name,
  level: 'info'
});

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));
app.use(logger.expressMiddleware());

// Authentication middleware
const auth = createAuthMiddleware(config.auth);

// Access control
const accessControl = AccessControlManager.createDefault();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected route example
app.get('/api/users',
  auth,
  accessControl.createMiddleware({
    permission: Permission.READ_ALL_USERS,
    guards: ['role'],
    getResourceContext: (req) => ({
      requiredRole: UserRole.ADMIN
    })
  }),
  async (req, res) => {
    try {
      // TODO: Implement user fetching logic
      res.json({ users: [] });
    } catch (error) {
      logger.error('Failed to fetch users', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
