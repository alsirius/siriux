import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { UserDao } from '../dao/UserDao';
import { createLogger, PostgresDatabase, getPostgresConfig } from '../packages';
import { AuthenticatedUser } from '../packages';

const router = Router();
const logger = createLogger({ service: 'users-routes' });

// Initialize PostgreSQL database for users routes
const postgresDb = new PostgresDatabase(getPostgresConfig());
postgresDb.initialize().catch(err => logger.error('Failed to initialize PostgreSQL database', { error: err }));

const userDao = new UserDao(postgresDb, logger);
const userService = new UserService(userDao, logger);

// Middleware to verify JWT token (simplified for demo)
const authenticateToken = (_req: Request, res: Response, next: NextFunction) => {
  const authHeader = _req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_TOKEN',
        message: 'Access token is required'
      },
      timestamp: new Date().toISOString()
    });
  }

  // For demo purposes, we'll skip JWT verification
  // In production, you would verify token here
  return next();
};

// Get user profile
router.get('/profile', authenticateToken, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // For demo purposes, we'll return first user
    // In production, you would extract user ID from JWT token
    const userId = '1';
    const result = await userService.getUserById(userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: result.error
        },
        timestamp: new Date().toISOString()
      });
    }

    logger.info('User profile retrieved', { userId });

    return res.json({
      success: true,
      data: result.user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error retrieving user profile', { error: (error as Error).message });
    return next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: Partial<AuthenticatedUser> = req.body;
    
    // For demo purposes, we'll update first user
    // In production, you would extract user ID from JWT token
    const userId = '1';
    
    const result = await userService.updateUser(userId, updates);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

    logger.info('User profile updated', { userId, updates });

    return res.json({
      success: true,
      data: result.user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error updating user profile', { error: (error as Error).message });
    return next(error);
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // For demo purposes, we'll delete first user
    // In production, you would extract user ID from JWT token
    const userId = '1';
    
    const result = await userService.deleteUser(userId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

    logger.info('User account deleted', { userId });

    return res.json({
      success: true,
      data: { message: 'Account deleted successfully' },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error deleting user account', { error: (error as Error).message });
    return next(error);
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.getAllUsers();

    logger.info('All users retrieved');

    return res.json({
      success: true,
      data: [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error retrieving all users', { error: (error as Error).message });
    return next(error);
  }
});

export default router;
