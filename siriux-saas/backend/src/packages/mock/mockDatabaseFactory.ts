// Mock Database Factory - Support multiple database types
export enum DatabaseType {
  IN_MEMORY = 'in-memory',
  SQLITE = 'sqlite',
  SNOWFLAKE_MOCK = 'snowflake-mock',
  SNOWFLAKE_REAL = 'snowflake-real'
}

export interface MockDatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  options?: Record<string, any>;
}

// Import the new interface
import { IMockDatabase } from './mockDatabase';

// Base interface for all mock databases (alias to IMockDatabase)
export interface MockDatabase extends IMockDatabase {}

// In-memory implementation (existing)
import { InMemoryMockDatabase } from './inMemoryMockDatabase';

// SQLite implementation (placeholder for future)
class SQLiteMockDatabase implements MockDatabase {
  public users: Map<string, any> = new Map();
  public sessions: Map<string, any> = new Map();
  public auditLogs: any[] = [];
  private db: any = null;
  private initialized = false;

  async initialize(): Promise<void> {
    console.log('??  Initializing SQLite mock database...');
    // Future: Use actual SQLite with better-sqlite3
    // For now, fall back to in-memory
    this.initialized = true;
  }

  async createTables(): Promise<void> {
    console.log('??  Creating SQLite tables...');
  }

  async getUserByEmail(email: string): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async getUserById(id: string): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async createUser(userData: any): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async updateUser(id: string, updates: any): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async createSession(data: any): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async getSessionByToken(token: string): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async getSessionById(id: string): Promise<any> {
    // Placeholder implementation
    return null;
  }

  async deleteSession(token: string): Promise<void> {
    // Placeholder implementation
  }

  async deleteExpiredSessions(): Promise<void> {
    // Placeholder implementation
  }

  async logAudit(entry: any): Promise<void> {
    // Placeholder implementation
  }

  async getAuditLogs(userId?: string, limit?: number): Promise<any[]> {
    return [];
  }

  async searchUsers(query: string): Promise<any[]> {
    return [];
  }

  async getUsersByRole(role: string): Promise<any[]> {
    return [];
  }

  async getStats(): Promise<any> {
    return {
      totalUsers: 0,
      totalSessions: 0,
      totalAuditLogs: 0,
      usersByRole: {},
      databaseType: 'sqlite',
      connectionStatus: 'healthy'
    };
  }

  async reset(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }

  async close(): Promise<void> {
    this.db = null;
    this.initialized = false;
  }

  async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      databaseType: 'sqlite',
      timestamp: new Date().toISOString()
    };
  }
}

// Snowflake mock implementation (existing)
class SnowflakeMockDatabase implements MockDatabase {
  public users: Map<string, any> = new Map();
  public sessions: Map<string, any> = new Map();
  public auditLogs: any[] = [];
  private connection: any = null;
  private initialized = false;

  async initialize(): Promise<void> {
    console.log('??  Initializing Snowflake mock database...');
    
    // Simulate Snowflake connection
    this.connection = {
      execute: async (query: string) => {
        console.log(`?? Snowflake Query: ${query}`);
        return {
          rows: [],
          rowCount: 0
        };
      }
    };
    
    this.initialized = true;
  }

  async createTables(): Promise<void> {
    console.log('??  Creating Snowflake tables...');
  }

  async getUserByEmail(email: string): Promise<any> {
    const query = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;
    const result = await this.connection!.execute(query);
    
    // Mock Snowflake user data
    if (email === 'admin@siriux.dev') {
      return {
        ID: '1',
        EMAIL: 'admin@siriux.dev',
        PASSWORD: 'admin123',
        FIRST_NAME: 'Admin',
        LAST_NAME: 'User',
        ROLE: 'admin',
        CREATED_AT: new Date().toISOString(),
        UPDATED_AT: new Date().toISOString()
      };
    }
    
    if (email === 'user@siriux.dev') {
      return {
        ID: '2',
        EMAIL: 'user@siriux.dev',
        PASSWORD: 'user123',
        FIRST_NAME: 'Demo',
        LAST_NAME: 'User',
        ROLE: 'user',
        CREATED_AT: new Date().toISOString(),
        UPDATED_AT: new Date().toISOString()
      };
    }
    
    return null;
  }

  async getUserById(id: string): Promise<any> {
    const query = `SELECT * FROM USERS WHERE ID = '${id}'`;
    await this.connection!.execute(query);
    
    // Mock data based on ID
    if (id === '1') return this.getUserByEmail('admin@siriux.dev');
    if (id === '2') return this.getUserByEmail('user@siriux.dev');
    if (id === '3') return this.getUserByEmail('manager@siriux.dev');
    
    return null;
  }

  async createUser(userData: any): Promise<any> {
    const query = `INSERT INTO USERS (EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, ROLE) VALUES ('${userData.email}', '${userData.password}', '${userData.firstName}', '${userData.lastName}', '${userData.role}')`;
    await this.connection!.execute(query);
    
    return {
      ID: Date.now().toString(),
      ...userData,
      CREATED_AT: new Date().toISOString(),
      UPDATED_AT: new Date().toISOString()
    };
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const query = `UPDATE USERS SET ... WHERE ID = '${id}'`;
    await this.connection!.execute(query);
    
    // Return updated user
    const existingUser = await this.getUserById(id);
    if (existingUser) {
      return {
        ...existingUser,
        ...updates,
        UPDATED_AT: new Date().toISOString()
      };
    }
    return null;
  }

  async createSession(data: any): Promise<any> {
    const query = `INSERT INTO SESSIONS (USER_ID, ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_AT) VALUES ('${data.userId}', '${data.accessToken}', '${data.refreshToken}', '${data.expiresAt}')`;
    await this.connection!.execute(query);
    
    return {
      ID: Date.now().toString(),
      ...data,
      CREATED_AT: new Date().toISOString()
    };
  }

  async getSessionByToken(token: string): Promise<any> {
    const query = `SELECT * FROM SESSIONS WHERE ACCESS_TOKEN = '${token}' AND EXPIRES_AT > CURRENT_TIMESTAMP()`;
    const result = await this.connection!.execute(query);
    
    // Mock session data
    return {
      ID: 'session_1',
      USER_ID: '1',
      ACCESS_TOKEN: token,
      REFRESH_TOKEN: 'refresh_token',
      EXPIRES_AT: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      CREATED_AT: new Date().toISOString()
    };
  }

  async getSessionById(id: string): Promise<any> {
    const query = `SELECT * FROM SESSIONS WHERE ID = '${id}'`;
    await this.connection!.execute(query);
    
    // Mock implementation
    return null;
  }

  async deleteSession(token: string): Promise<void> {
    const query = `DELETE FROM SESSIONS WHERE ACCESS_TOKEN = '${token}'`;
    await this.connection!.execute(query);
  }

  async deleteExpiredSessions(): Promise<void> {
    const query = `DELETE FROM SESSIONS WHERE EXPIRES_AT <= CURRENT_TIMESTAMP()`;
    await this.connection!.execute(query);
  }

  async logAudit(entry: any): Promise<void> {
    const query = `INSERT INTO AUDIT_LOGS (USER_ID, ACTION, RESOURCE, METADATA, TIMESTAMP) VALUES ('${entry.userId || 'NULL'}', '${entry.action}', '${entry.resource}', '${entry.metadata || 'NULL'}', CURRENT_TIMESTAMP())`;
    await this.connection!.execute(query);
  }

  async getAuditLogs(userId?: string, limit?: number): Promise<any[]> {
    const whereClause = userId ? `WHERE USER_ID = '${userId}'` : '';
    const limitClause = limit ? `LIMIT ${limit}` : 'LIMIT 50';
    const query = `SELECT * FROM AUDIT_LOGS ${whereClause} ORDER BY TIMESTAMP DESC ${limitClause}`;
    await this.connection!.execute(query);
    
    // Mock audit logs
    return [
      {
        ID: '1',
        USER_ID: '1',
        ACTION: 'LOGIN_SUCCESS',
        RESOURCE: 'auth',
        METADATA: '{}',
        TIMESTAMP: new Date().toISOString()
      },
      {
        ID: '2',
        USER_ID: '2',
        ACTION: 'LOGIN_FAILED',
        RESOURCE: 'auth',
        METADATA: '{"reason": "invalid_password"}',
        TIMESTAMP: new Date(Date.now() - 60000).toISOString()
      }
    ];
  }

  async searchUsers(query: string): Promise<any[]> {
    const searchQuery = `SELECT * FROM USERS WHERE EMAIL LIKE '%${query}%' OR FIRST_NAME LIKE '%${query}%' OR LAST_NAME LIKE '%${query}%'`;
    await this.connection!.execute(searchQuery);
    
    // Mock implementation
    return [];
  }

  async getUsersByRole(role: string): Promise<any[]> {
    const roleQuery = `SELECT * FROM USERS WHERE ROLE = '${role}'`;
    await this.connection!.execute(roleQuery);
    
    // Mock implementation
    return [];
  }

  async getStats(): Promise<any> {
    const query = 'SELECT COUNT(*) AS TOTAL_USERS FROM USERS';
    await this.connection!.execute(query);
    
    return {
      totalUsers: 3,
      totalSessions: 2,
      totalAuditLogs: 15,
      usersByRole: {
        admin: 1,
        user: 1,
        manager: 1
      },
      databaseType: 'snowflake',
      connectionStatus: 'healthy'
    };
  }

  async reset(): Promise<void> {
    console.log('?? Resetting Snowflake mock database...');
    await this.initialize();
  }

  async close(): Promise<void> {
    this.connection = null;
    this.initialized = false;
    console.log('?? Snowflake mock database closed');
  }

  async healthCheck(): Promise<any> {
    return {
      status: 'healthy',
      databaseType: 'snowflake',
      timestamp: new Date().toISOString(),
      connectionState: 'connected'
    };
  }
}

// Real Snowflake implementation
import { SnowflakeDatabase, getSnowflakeConfig } from '../databases/snowflakeDatabase';

// Factory function
export class MockDatabaseFactory {
  static async create(config: MockDatabaseConfig): Promise<MockDatabase> {
    console.log(`🏭 Creating database: ${config.type}`);
    
    switch (config.type) {
      case DatabaseType.IN_MEMORY:
        return new InMemoryMockDatabase();
        
      case DatabaseType.SQLITE:
        return new SQLiteMockDatabase();
        
      case DatabaseType.SNOWFLAKE_MOCK:
        return new SnowflakeMockDatabase();
        
      case DatabaseType.SNOWFLAKE_REAL:
        try {
          const snowflakeConfig = getSnowflakeConfig();
          return new SnowflakeDatabase(snowflakeConfig);
        } catch (error: any) {
          console.warn('⚠️  Snowflake config not found, falling back to mock:', error.message);
          return new SnowflakeMockDatabase();
        }
        
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  static async createWithAutoDetection(): Promise<MockDatabase> {
    // Auto-detect based on environment (defaults to real Snowflake)
    const dbType = process.env.MOCK_DB_TYPE || DatabaseType.SNOWFLAKE_REAL;
    
    return this.create({
      type: dbType as DatabaseType,
      connectionString: process.env.MOCK_DB_CONNECTION_STRING,
      options: {
        warehouse: process.env.SNOWFLAKE_WAREHOUSE,
        schema: process.env.SNOWFLAKE_SCHEMA
      }
    });
  }

  static getSupportedTypes(): DatabaseType[] {
    return [
      DatabaseType.IN_MEMORY, 
      DatabaseType.SQLITE, 
      DatabaseType.SNOWFLAKE_MOCK,
      DatabaseType.SNOWFLAKE_REAL
    ];
  }

  static getDatabaseInfo(type: DatabaseType): {
    name: string;
    description: string;
    features: string[];
    useCase: string;
    requiresConfig?: boolean;
  } {
    const databaseInfo = {
      [DatabaseType.IN_MEMORY]: {
        name: 'In-Memory',
        description: 'Fast, zero-dependency in-memory database',
        features: ['Zero setup', 'Fastest performance', 'No external deps', 'Auto-reset'],
        useCase: 'Development, testing, demos'
      },
      [DatabaseType.SQLITE]: {
        name: 'SQLite',
        description: 'File-based SQL database with persistence',
        features: ['Persistent storage', 'Real SQL queries', 'ACID compliance', 'Portable'],
        useCase: 'Local development, small applications'
      },
      [DatabaseType.SNOWFLAKE_MOCK]: {
        name: 'Snowflake (Mock)',
        description: 'Simulated Snowflake for enterprise demos',
        features: ['Cloud-native mock', 'Enterprise features', 'Data warehousing', 'Zero setup'],
        useCase: 'Enterprise demos, training, sales'
      },
      [DatabaseType.SNOWFLAKE_REAL]: {
        name: 'Snowflake (Real)',
        description: 'Real Snowflake data warehouse connection',
        features: ['Real Snowflake connection', 'Production queries', 'Enterprise features', 'Analytics'],
        useCase: 'Production applications, enterprise deployments',
        requiresConfig: true
      }
    };

    return databaseInfo[type];
  }
}

// Environment-based configuration
export const getDatabaseConfig = (): MockDatabaseConfig => {
  const type = (process.env.MOCK_DB_TYPE || DatabaseType.IN_MEMORY) as DatabaseType;
  
  return {
    type,
    connectionString: process.env.MOCK_DB_CONNECTION_STRING,
    options: {
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      database: process.env.SNOWFLAKE_DATABASE
    }
  };
};
