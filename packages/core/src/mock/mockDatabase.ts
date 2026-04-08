// In-memory mock database - no external dependencies required

export interface MockUser {
  id: string;
  email: string;
  password: string; // Hashed
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'manager';
  createdAt: string;
  updatedAt: string;
}

export interface MockSession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface MockAuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  metadata?: string;
  timestamp: string;
}

// Interface for all mock databases
export interface IMockDatabase {
  users: Map<string, MockUser>;
  sessions: Map<string, MockSession>;
  auditLogs: MockAuditLog[];
  initialize(): Promise<void>;
  createTables(): Promise<void>;
  getUserByEmail(email: string): Promise<MockUser | null>;
  getUserById(id: string): Promise<MockUser | null>;
  createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser>;
  updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null>;
  createSession(sessionData: Omit<MockSession, 'id' | 'createdAt'>): Promise<MockSession>;
  getSessionByToken(accessToken: string): Promise<MockSession | null>;
  getSessionById(id: string): Promise<MockSession | null>;
  deleteSession(accessToken: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
  logAudit(entry: {
    userId?: string;
    action: string;
    resource: string;
    metadata?: string;
  }): Promise<void>;
  getAuditLogs(userId?: string, limit?: number): Promise<MockAuditLog[]>;
  searchUsers(query: string): Promise<MockUser[]>;
  getUsersByRole(role: string): Promise<MockUser[]>;
  getStats(): Promise<{
    totalUsers: number;
    totalSessions: number;
    totalAuditLogs: number;
    usersByRole: { [key: string]: number };
    databaseType: string;
    connectionStatus: string;
  }>;
  close(): Promise<void>;
  healthCheck(): Promise<{ status: string; timestamp: string; databaseType: string }>;
  reset(): Promise<void>;
}

export class MockDatabase implements IMockDatabase {
  public users: Map<string, MockUser> = new Map();
  public sessions: Map<string, MockSession> = new Map();
  public auditLogs: MockAuditLog[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.createTables();
      await this.seedData();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize mock database:', error);
      throw error;
    }
  }

  async createTables(): Promise<void> {
    // In-memory tables are created by the data structure
    console.log('??  Creating in-memory tables...');
  }

  private async seedData(): Promise<void> {
    const now = new Date().toISOString();
    
    const mockUsers: MockUser[] = [
      {
        id: '1',
        email: 'admin@siriux.dev',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: '2',
        email: 'user@siriux.dev',
        password: 'user123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        createdAt: now,
        updatedAt: now
      },
      {
        id: '3',
        email: 'manager@siriux.dev',
        password: 'manager123',
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const user of mockUsers) {
      this.users.set(user.email, user);
    }
  }

  async getUserByEmail(email: string): Promise<MockUser | null> {
    const user = this.users.get(email);
    return user || null;
  }

  async getUserById(id: string): Promise<MockUser | null> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser> {
    const now = new Date().toISOString();
    const id = Date.now().toString();
    
    const user: MockUser = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(user.email, user);
    return user;
  }

  async createSession(sessionData: Omit<MockSession, 'id' | 'createdAt'>): Promise<MockSession> {
    const now = new Date().toISOString();
    const id = Date.now().toString();
    
    const session: MockSession = {
      id,
      ...sessionData,
      createdAt: now
    };

    this.sessions.set(session.accessToken, session);
    return session;
  }

  async getSessionByToken(accessToken: string): Promise<MockSession | null> {
    const session = this.sessions.get(accessToken);
    return session || null;
  }

  async deleteSession(accessToken: string): Promise<void> {
    this.sessions.delete(accessToken);
  }

  async logAudit(entry: {
    userId?: string;
    action: string;
    resource: string;
    metadata?: string;
  }): Promise<void> {
    const auditEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.auditLogs.push(auditEntry);
    
    // Keep only last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }

  async getAuditLogs(userId?: string, limit = 50): Promise<any[]> {
    let logs = this.auditLogs;
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async close(): Promise<void> {
    this.users.clear();
    this.sessions.clear();
    this.auditLogs = [];
    this.isInitialized = false;
    console.log('🗄️  In-memory database closed');
  }

  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    databaseType: string;
  }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      databaseType: 'in-memory'
    };
  }

  async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    for (const [email, user] of this.users.entries()) {
      if (user.id === id) {
        const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
        this.users.set(email, updatedUser);
        return updatedUser;
      }
    }
    return null;
  }

  async getSessionById(id: string): Promise<MockSession | null> {
    for (const session of this.sessions.values()) {
      if (session.id === id) {
        return session;
      }
    }
    return null;
  }

  async deleteExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (new Date(session.expiresAt) <= now) {
        this.sessions.delete(token);
      }
    }
  }

  async searchUsers(query: string): Promise<MockUser[]> {
    const lowerQuery = query.toLowerCase();
    const results: MockUser[] = [];
    
    for (const user of this.users.values()) {
      if (
        user.email.toLowerCase().includes(lowerQuery) ||
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery)
      ) {
        results.push(user);
      }
    }
    
    return results;
  }

  async getUsersByRole(role: string): Promise<MockUser[]> {
    const results: MockUser[] = [];
    
    for (const user of this.users.values()) {
      if (user.role === role) {
        results.push(user);
      }
    }
    
    return results;
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalSessions: number;
    totalAuditLogs: number;
    usersByRole: { [key: string]: number };
    databaseType: string;
    connectionStatus: string;
  }> {
    const usersByRole: { [key: string]: number } = {};
    
    for (const user of this.users.values()) {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    }

    return {
      totalUsers: this.users.size,
      totalSessions: this.sessions.size,
      totalAuditLogs: this.auditLogs.length,
      usersByRole,
      databaseType: 'in-memory',
      connectionStatus: 'healthy'
    };
  }

  async reset(): Promise<void> {
    await this.close();
    await this.initialize();
  }
}
