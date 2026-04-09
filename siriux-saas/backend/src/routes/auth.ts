import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  JwtPayload,
  RefreshTokenRequest
} from '../types';
import { logger } from '../services/logger';

const router = Router();

// Mock database for demo purposes
const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date()
  }
];

const refreshTokens = new Set<string>();

// Helper functions
const generateTokens = (user: User): { accessToken: string; refreshToken: string } => {
  const jwtSecret = process.env['JWT_SECRET'] || 'your-secret-key';

  const payload: Omit<JwtPayload, 'exp' | 'iat'> = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access'
  };

  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, jwtSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const validateLoginRequest = (req: LoginRequest): string[] => {
  const errors: string[] = [];
  
  if (!req.email) errors.push('Email is required');
  if (!req.password) errors.push('Password is required');
  if (req.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

const validateRegisterRequest = (req: RegisterRequest): string[] => {
  const errors = validateLoginRequest(req);
  
  if (req.password && req.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!req.name) errors.push('Name is required');
  
  return errors;
};

// Routes
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerData: RegisterRequest = req.body;
    const errors = validateRegisterRequest(registerData);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === registerData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Create new user
    await bcrypt.hash(registerData.password, 10);
    const newUser: User = {
      id: uuidv4(),
      email: registerData.email,
      name: registerData.name,
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    
    const tokens = generateTokens(newUser);
    refreshTokens.add(tokens.refreshToken);

    const response: AuthResponse = {
      user: newUser,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        tokenType: 'Bearer'
      }
    };

    logger.info('User registered successfully', { userId: newUser.id, email: newUser.email });

    return res.status(201).json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Registration error', { error: (error as Error).message });
    return next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData: LoginRequest = req.body;
    const errors = validateLoginRequest(loginData);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        },
        timestamp: new Date().toISOString()
      });
    }

    // Find user
    const user = users.find(u => u.email === loginData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        },
        timestamp: new Date().toISOString()
      });
    }

    // For demo purposes, we'll skip password verification
    // In production, you would verify: await bcrypt.compare(loginData.password, user.password)
    
    const tokens = generateTokens(user);
    refreshTokens.add(tokens.refreshToken);

    // Update last login
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    const response: AuthResponse = {
      user,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        tokenType: 'Bearer'
      }
    };

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Login error', { error: (error as Error).message });
    return next(error);
  }
});

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken }: RefreshTokenRequest = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: 'Refresh token is required'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        },
        timestamp: new Date().toISOString()
      });
    }

    const jwtSecret = process.env['JWT_SECRET'] || 'your-secret-key';
    const decoded = jwt.verify(refreshToken, jwtSecret) as JwtPayload;

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_TYPE',
          message: 'Invalid token type'
        },
        timestamp: new Date().toISOString()
      });
    }

    const user = users.find(u => u.id === decoded.sub);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Remove old refresh token and generate new ones
    refreshTokens.delete(refreshToken);
    const tokens = generateTokens(user);
    refreshTokens.add(tokens.refreshToken);

    logger.info('Token refreshed successfully', { userId: user.id });

    return res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 24 * 60 * 60,
        tokenType: 'Bearer'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Token refresh error', { error: (error as Error).message });
    return next(error);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  const { refreshToken } = _req.body;
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  logger.info('User logged out');

  return res.json({
    success: true,
    data: { message: 'Logged out successfully' },
    timestamp: new Date().toISOString()
  });
});

router.get('/me', (_req: Request, res: Response) => {
  // This would typically use middleware to extract user from JWT
  // For demo purposes, we'll return a mock user
  return res.json({
    success: true,
    data: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
