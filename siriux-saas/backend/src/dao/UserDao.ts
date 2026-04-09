import { AuthenticatedUser, UserRole, PostgresDatabase, getPostgresConfig } from '../packages';
import { Logger } from '../packages';

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
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  approvalCode?: string;
}

export class UserDao implements UserDao {
  private database: PostgresDatabase;
  private logger: Logger;
  private initialized: boolean = false;

  constructor(database: PostgresDatabase, logger: Logger) {
    this.database = database;
    this.logger = logger;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      try {
        await this.database.initialize();
        this.initialized = true;
      } catch (error) {
        this.logger.error('Failed to initialize database', { error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    }
  }

  public async findById(id: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Finding user by ID', { userId: id });
    await this.ensureInitialized();
    
    const user = await this.database.getUserById(id);
    if (!user) {
      return null;
    }

    return this.mapToAuthenticatedUser(user);
  }

  public async findByEmail(email: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Finding user by email', { email });
    await this.ensureInitialized();
    
    const user = await this.database.getUserByEmail(email);
    if (!user) {
      return null;
    }

    return this.mapToAuthenticatedUser(user);
  }

  public async create(userData: CreateUserRequest): Promise<AuthenticatedUser> {
    this.logger.info('Creating user', { email: userData.email });
    await this.ensureInitialized();
    
    // Check if user already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const createdUser = await this.database.createUser({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || userData.name,
      lastName: userData.lastName,
      role: UserRole.USER
    });

    this.logger.info('User created successfully', { userId: createdUser.id });
    
    return this.mapToAuthenticatedUser(createdUser);
  }

  public async update(id: string, updates: Partial<AuthenticatedUser>): Promise<AuthenticatedUser | null> {
    this.logger.debug('Updating user', { userId: id, updates });
    await this.ensureInitialized();
    
    const updatedUser = await this.database.updateUser(id, updates);
    if (!updatedUser) {
      this.logger.warn('User not found for update', { userId: id });
      return null;
    }

    this.logger.info('User updated successfully', { userId: id });
    return this.mapToAuthenticatedUser(updatedUser);
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting user', { userId: id });
    await this.ensureInitialized();
    
    const deleted = await this.database.deleteUser(id);
    if (!deleted) {
      this.logger.warn('User not found for deletion', { userId: id });
      return false;
    }

    this.logger.info('User deleted successfully', { userId: id });
    return true;
  }

  public async findAll(): Promise<AuthenticatedUser[]> {
    this.logger.debug('Finding all users');
    await this.ensureInitialized();
    
    const users = await this.database.getAllUsers();
    return users.map((user: any) => this.mapToAuthenticatedUser(user));
  }

  public async findByStatus(status: string): Promise<AuthenticatedUser[]> {
    this.logger.debug('Finding users by status', { status });
    await this.ensureInitialized();
    
    const users = await this.database.getUsersByStatus(status);
    return users.map((user: any) => this.mapToAuthenticatedUser(user));
  }

  public async updateStatus(id: string, status: string): Promise<AuthenticatedUser | null> {
    this.logger.debug('Updating user status', { userId: id, status });
    await this.ensureInitialized();
    
    const updatedUser = await this.database.updateUser(id, { status });
    if (!updatedUser) {
      return null;
    }

    return this.mapToAuthenticatedUser(updatedUser);
  }

  private mapToAuthenticatedUser(dbUser: any): AuthenticatedUser {
    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as UserRole,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at)
    };
  }
}

// Factory function to create UserDao with PostgreSQL
export const createUserDao = async (logger: Logger): Promise<UserDao> => {
  const config = getPostgresConfig();
  const database = new PostgresDatabase(config);
  return new UserDao(database, logger);
};
