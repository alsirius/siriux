import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole, AuthenticatedUser, SiriuxConfig } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  authenticatedUser?: AuthenticatedUser;
}

export class AuthenticationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthMiddleware {
  private jwtSecret: string;
  private config: SiriuxConfig;

  constructor(config: SiriuxConfig) {
    this.config = config;
    this.jwtSecret = config.auth.jwtSecret;
    if (!this.jwtSecret) {
      throw new AuthenticationError('JWT_SECRET is required', 'MISSING_SECRET');
    }
  }

  /**
   * Middleware to verify JWT tokens
   */
  public tokenAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
    try {
      const authHeader = req.headers.authorization;
      const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;
      
      if (!token) {
        throw new AuthenticationError('No token provided', 'TOKEN_MISSING');
      }

      // Validate token format
      if (typeof token !== 'string' || token.split('.').length !== 3) {
        throw new AuthenticationError('Invalid token format', 'INVALID_FORMAT');
      }

      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ 
          success: false, 
          error: error.message,
          code: error.code 
        });
      }

      // Handle specific JWT errors
      if (error instanceof Error) {
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            success: false, 
            error: 'Invalid token specified',
            code: 'INVALID_TOKEN'
          });
        } else if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false, 
            error: 'Token expired',
            code: 'TOKEN_EXPIRED'
          });
        } else if (error.name === 'NotBeforeError') {
          return res.status(401).json({ 
            success: false, 
            error: 'Token not active',
            code: 'TOKEN_NOT_ACTIVE'
          });
        }
      }
      
      return res.status(401).json({ 
        success: false, 
        error: 'Token verification failed',
        code: 'VERIFICATION_FAILED'
      });
    }
  };

  /**
   * Middleware to require admin role
   */
  public adminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }
    next();
  };

  /**
   * Middleware to require specific role
   */
  public roleAuth = (requiredRole: UserRole) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ 
          success: false, 
          error: `${requiredRole} access required`,
          code: 'ROLE_REQUIRED'
        });
      }
      next();
    };
  };

  /**
   * Middleware for optional authentication (doesn't fail if no token)
   */
  public optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;
      
      if (token) {
        const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
        req.user = decoded;
      }
      next();
    } catch (error) {
      // Optional auth - continue without user if token is invalid
      next();
    }
  };

  /**
   * Generate JWT access token
   */
  public generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h',
      issuer: 'siriux',
      audience: 'siriux-users'
    });
  }

  /**
   * Generate JWT refresh token
   */
  public generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.config.auth.jwtRefreshSecret || this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): { userId: string; type: string } {
    return jwt.verify(token, this.config.auth.jwtRefreshSecret || this.jwtSecret) as { userId: string; type: string };
  }

  /**
   * Generate both access and refresh tokens
   */
  public generateTokenPair(user: AuthenticatedUser): { accessToken: string; refreshToken: string } {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(user.id)
    };
  }
}

// Factory function to create middleware instance
export const createAuthMiddleware = (config: SiriuxConfig): AuthMiddleware => {
  return new AuthMiddleware(config);
};
