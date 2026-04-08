import { UserDao, CreateUserRequest } from '../dao/UserDao';
import { AuthenticatedUser, LoginCredentials, AuthResponse } from '@siriux/core';
import { Logger } from '@siriux/logging';

export class UserService {
  constructor(
    private userDao: UserDao,
    private logger: Logger
  ) {}

  async createUser(userData: CreateUserRequest): Promise<AuthResponse> {
    this.logger.info('Creating new user', { email: userData.email });
    
    // Check if user already exists
    const existingUser = await this.userDao.findByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Create user data for DAO (handle optional name)
    const createData: CreateUserRequest = {
      email: userData.email,
      password: userData.password,
      ...(userData.name && { name: userData.name })
    };

    const createdUser = await this.userDao.create(createData);

    this.logger.info('User created successfully', { userId: createdUser.id });

    return {
      success: true,
      user: createdUser,
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    };
  }

  async authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
    this.logger.info('Authenticating user', { email: credentials.email });
    
    // Find user by email
    const user = await this.userDao.findByEmail(credentials.email);
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // In a real app, you'd verify password here
    // For demo, we'll skip password verification
    
    this.logger.info('User authenticated successfully', { userId: user.id });

    return {
      success: true,
      user,
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    };
  }

  async getUserById(id: string): Promise<AuthResponse> {
    this.logger.debug('Getting user by ID', { userId: id });
    
    const user = await this.userDao.findById(id);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      user
    };
  }

  async updateUser(id: string, updates: Partial<AuthenticatedUser>): Promise<AuthResponse> {
    this.logger.debug('Updating user', { userId: id, updates });
    
    const updatedUser = await this.userDao.update(id, updates);
    if (!updatedUser) {
      return {
        success: false,
        error: 'Failed to update user'
      };
    }

    this.logger.info('User updated successfully', { userId: id });

    return {
      success: true,
      user: updatedUser
    };
  }

  async deleteUser(id: string): Promise<AuthResponse> {
    this.logger.debug('Deleting user', { userId: id });
    
    const deleted = await this.userDao.delete(id);
    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }

    this.logger.info('User deleted successfully', { userId: id });

    return {
      success: true
    };
  }

  async getAllUsers(): Promise<AuthResponse> {
    this.logger.debug('Getting all users');
    
    await this.userDao.findAll();
    
    return {
      success: true
    };
  }
}
