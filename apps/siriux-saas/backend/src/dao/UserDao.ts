import { AuthenticatedUser, UserRole } from '@siriux/core';
import { Logger } from '@siriux/logging';

export interface UserDao {
  findById(id: string): Promise<AuthenticatedUser | null>;
  findByEmail(email: string): Promise<AuthenticatedUser | null>;
  create(userData: CreateUserRequest): Promise<AuthenticatedUser>;
  update(id: string, updates: Partial<AuthenticatedUser>): Promise<AuthenticatedUser | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<AuthenticatedUser[]>;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export class UserDao implements UserDao {
  private users: AuthenticatedUser[] = [];
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    
    // Initialize with demo data
    this.users = [
      {
        id: '1',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        email: 'user@example.com',
        role: UserRole.USER,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  public async findById(id: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Finding user by ID', { userId: id });
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  public async findByEmail(email: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Finding user by email', { email });
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  public async create(userData: CreateUserRequest): Promise<AuthenticatedUser> {
    this.logger.info('Creating user', { email: userData.email });
    
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: AuthenticatedUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    this.logger.info('User created successfully', { userId: newUser.id });
    
    return newUser;
  }

  public async update(id: string, updates: Partial<AuthenticatedUser>): Promise<AuthenticatedUser | null> {
    this.logger.debug('Updating user', { userId: id, updates });
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      this.logger.warn('User not found for update', { userId: id });
      return null;
    }

    const currentUser = this.users[userIndex];
    if (!currentUser) {
      this.logger.warn('User not found for update', { userId: id });
      return null;
    }

    this.users[userIndex] = {
      id: currentUser.id,
      email: updates.email ?? currentUser.email,
      role: updates.role ?? currentUser.role,
      createdAt: currentUser.createdAt,
      updatedAt: new Date()
    };

    this.logger.info('User updated successfully', { userId: id });
    return this.users[userIndex];
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting user', { userId: id });
    
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      this.logger.warn('User not found for deletion', { userId: id });
      return false;
    }

    this.users.splice(userIndex, 1);
    this.logger.info('User deleted successfully', { userId: id });
    return true;
  }

  public async findAll(): Promise<AuthenticatedUser[]> {
    this.logger.debug('Finding all users');
    return this.users;
  }
}
