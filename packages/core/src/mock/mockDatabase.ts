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

export class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private sessions: Map<string, MockSession> = new Map();
  private auditLogs: any[] = [];
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

  private async createTables(): Promise<void> {
    // In-memory tables are created by the data structure
    console.log('🗄️  Creating in-memory tables...');
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
}
