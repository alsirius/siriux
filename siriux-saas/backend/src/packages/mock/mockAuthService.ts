import { AuthResponse, AuthTokens, LoginCredentials, RegisterData, AuthenticatedUser, UserRole } from '../types';

// Local types to avoid circular dependencies
interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'manager';
  createdAt: string;
  updatedAt: string;
}

interface MockSession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

interface MockDatabase {
  initialize(): Promise<void>;
  getUserByEmail(email: string): Promise<MockUser | null>;
  getUserById(id: string): Promise<MockUser | null>;
  createUser(userData: any): Promise<MockUser>;
  createSession(data: any): Promise<MockSession>;
  getSessionByToken(token: string): Promise<MockSession | null>;
  deleteSession(token: string): Promise<void>;
  logAudit(entry: any): Promise<void>;
  getStats(): Promise<any>;
  getAuditLogs(userId?: string): Promise<any[]>;
  reset(): Promise<void>;
}

export class MockAuthService {
  private database: MockDatabase;
  private jwtSecret: string;

  constructor(database: MockDatabase, jwtSecret: string = 'mock-secret') {
    this.database = database;
    this.jwtSecret = jwtSecret;
  }

  // Mock JWT token generation (simplified)
  private generateToken(payload: any, expiresIn: string = '24h'): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (expiresIn === '24h' ? 86400 : expiresIn === '7d' ? 604800 : 3600);
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp
    };
    
    const payloadEncoded = btoa(JSON.stringify(tokenPayload));
    const signature = btoa(`${header}.${payloadEncoded}.${this.jwtSecret}`);
    
    return `${header}.${payloadEncoded}.${signature}`;
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      
      return payload;
    } catch {
      return null;
    }
  }

  private mapMockUserToAuthUser(mockUser: MockUser): AuthenticatedUser {
    return {
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role as UserRole,
      createdAt: new Date(mockUser.createdAt),
      updatedAt: new Date(mockUser.updatedAt)
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await this.database.initialize();

      // Find user by email
      const mockUser = await this.database.getUserByEmail(credentials.email);
      
      if (!mockUser) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Check password (plain text comparison for demo)
      if (mockUser.password !== credentials.password) {
        await this.database.logAudit({
          userId: mockUser.id,
          action: 'LOGIN_FAILED',
          resource: 'auth',
          metadata: JSON.stringify({ reason: 'invalid_password' })
        });
        
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Generate tokens
      const tokenPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      };

      const accessToken = this.generateToken(tokenPayload, '24h');
      const refreshToken = this.generateToken(tokenPayload, '7d');

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await this.database.createSession({
        userId: mockUser.id,
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString()
      });

      // Log successful login
      await this.database.logAudit({
        userId: mockUser.id,
        action: 'LOGIN_SUCCESS',
        resource: 'auth'
      });

      const user = this.mapMockUserToAuthUser(mockUser);

      return {
        success: true,
        user,
        tokens: {
          accessToken,
          refreshToken
        }
      };

    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      await this.database.initialize();

      // Check if user already exists
      const existingUser = await this.database.getUserByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User already exists'
        };
      }

      // Create new user
      const mockUser = await this.database.createUser({
        email: data.email,
        password: data.password, // Plain text for demo
        firstName: data.firstName || 'User',
        lastName: data.lastName || 'Name',
        role: 'user'
      });

      // Generate tokens
      const tokenPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      };

      const accessToken = this.generateToken(tokenPayload, '24h');
      const refreshToken = this.generateToken(tokenPayload, '7d');

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.database.createSession({
        userId: mockUser.id,
        accessToken,
        refreshToken,
        expiresAt: expiresAt.toISOString()
      });

      // Log registration
      await this.database.logAudit({
        userId: mockUser.id,
        action: 'REGISTER',
        resource: 'auth'
      });

      const user = this.mapMockUserToAuthUser(mockUser);

      return {
        success: true,
        user,
        tokens: {
          accessToken,
          refreshToken
        }
      };

    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      await this.database.initialize();

      // Decode refresh token
      const payload = this.decodeToken(refreshToken);
      if (!payload) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      // Find session
      const session = await this.database.getSessionByToken(refreshToken);
      if (!session) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      // Get user
      const user = await this.database.getUserById(payload.userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const newAccessToken = this.generateToken(tokenPayload, '24h');
      const newRefreshToken = this.generateToken(tokenPayload, '7d');

      // Update session
      await this.database.deleteSession(refreshToken);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.database.createSession({
        userId: user.id,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: expiresAt.toISOString()
      });

      // Log token refresh
      await this.database.logAudit({
        userId: user.id,
        action: 'TOKEN_REFRESH',
        resource: 'auth'
      });

      const authUser = this.mapMockUserToAuthUser(user);

      return {
        success: true,
        user: authUser,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };

    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }

  async logout(accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.database.initialize();

      // Decode token to get user info
      const payload = this.decodeToken(accessToken);
      
      // Delete session
      await this.database.deleteSession(accessToken);

      // Log logout
      if (payload) {
        await this.database.logAudit({
          userId: payload.userId,
          action: 'LOGOUT',
          resource: 'auth'
        });
      }

      return { success: true };

    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }

  async validateToken(accessToken: string): Promise<{ valid: boolean; user?: AuthenticatedUser; error?: string }> {
    try {
      await this.database.initialize();

      // Decode token
      const payload = this.decodeToken(accessToken);
      if (!payload) {
        return {
          valid: false,
          error: 'Invalid token'
        };
      }

      // Check session exists
      const session = await this.database.getSessionByToken(accessToken);
      if (!session) {
        return {
          valid: false,
          error: 'Session not found or expired'
        };
      }

      // Get user
      const user = await this.database.getUserById(payload.userId);
      if (!user) {
        return {
          valid: false,
          error: 'User not found'
        };
      }

      return {
        valid: true,
        user: this.mapMockUserToAuthUser(user)
      };

    } catch (error: any) {
      console.error('Token validation error:', error);
      return {
        valid: false,
        error: 'Token validation failed'
      };
    }
  }

  async getUserProfile(userId: string): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
    try {
      await this.database.initialize();

      const mockUser = await this.database.getUserById(userId);
      if (!mockUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: this.mapMockUserToAuthUser(mockUser)
      };

    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Failed to get user profile'
      };
    }
  }

  // Utility methods
  async getStats(): Promise<any> {
    await this.database.initialize();
    return await this.database.getStats();
  }

  async getAuditLogs(userId?: string): Promise<any[]> {
    await this.database.initialize();
    return await this.database.getAuditLogs(userId);
  }

  async reset(): Promise<void> {
    await this.database.reset();
  }
}
