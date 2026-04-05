// In-memory mock database - no external dependencies required

export interface MockUser {
  id: string;
  email: string;
  password: string; // Plain text for demo (in production, use bcrypt)
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

export class InMemoryMockDatabase {
  private users: Map<string, MockUser> = new Map();
  private sessions: Map<string, MockSession> = new Map();
  private auditLogs: MockAuditLog[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.seedData();
      this.isInitialized = true;
      console.log('🗄️  In-memory mock database initialized');
    } catch (error) {
      console.error('Failed to initialize mock database:', error);
      throw error;
    }
  }

  private async seedData(): Promise<void> {
    // Mock users (plain text for demo simplicity)
    const mockUsers: MockUser[] = [
      {
        id: '1',
        email: 'admin@siriux.dev',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@siriux.dev',
        password: 'user123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'manager@siriux.dev',
        password: 'manager123',
        firstName: 'Manager',
        lastName: 'User',
        role: 'manager',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Store users in memory
    mockUsers.forEach(user => {
      this.users.set(user.email, user);
    });

    console.log(`👥 Seeded ${mockUsers.length} mock users`);
  }

  // User operations
  async getUserByEmail(email: string): Promise<MockUser | null> {
    await this.initialize();
    return this.users.get(email) || null;
  }

  async getUserById(id: string): Promise<MockUser | null> {
    await this.initialize();
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser> {
    await this.initialize();
    
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const user: MockUser = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(user.email, user);
    
    // Log the creation
    await this.logAudit({
      userId: user.id,
      action: 'CREATE',
      resource: 'user',
      metadata: JSON.stringify({ email: user.email })
    });
    
    return user;
  }

  async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    await this.initialize();
    
    for (const [email, user] of this.users.entries()) {
      if (user.id === id) {
        const updatedUser = {
          ...user,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        this.users.set(email, updatedUser);
        
        await this.logAudit({
          userId: user.id,
          action: 'UPDATE',
          resource: 'user',
          metadata: JSON.stringify(updates)
        });
        
        return updatedUser;
      }
    }
    
    return null;
  }

  // Session operations
  async createSession(sessionData: Omit<MockSession, 'id' | 'createdAt'>): Promise<MockSession> {
    await this.initialize();
    
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const session: MockSession = {
      id,
      ...sessionData,
      createdAt: now
    };
    
    this.sessions.set(session.accessToken, session);
    
    await this.logAudit({
      userId: session.userId,
      action: 'CREATE',
      resource: 'session',
      metadata: JSON.stringify({ sessionId: session.id })
    });
    
    return session;
  }

  async getSessionByToken(accessToken: string): Promise<MockSession | null> {
    await this.initialize();
    
    const session = this.sessions.get(accessToken);
    
    // Check if expired
    if (session && new Date(session.expiresAt) > new Date()) {
      return session;
    }
    
    // Clean up expired session
    if (session) {
      this.sessions.delete(accessToken);
    }
    
    return null;
  }

  async getSessionById(id: string): Promise<MockSession | null> {
    await this.initialize();
    
    for (const session of this.sessions.values()) {
      if (session.id === id) return session;
    }
    
    return null;
  }

  async deleteSession(accessToken: string): Promise<void> {
    await this.initialize();
    
    const session = this.sessions.get(accessToken);
    if (session) {
      this.sessions.delete(accessToken);
      
      await this.logAudit({
        userId: session.userId,
        action: 'DELETE',
        resource: 'session',
        metadata: JSON.stringify({ sessionId: session.id })
      });
    }
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.initialize();
    
    const now = new Date();
    const expiredSessions: string[] = [];
    
    for (const [token, session] of this.sessions.entries()) {
      if (new Date(session.expiresAt) <= now) {
        expiredSessions.push(token);
      }
    }
    
    expiredSessions.forEach(token => {
      this.sessions.delete(token);
    });
    
    if (expiredSessions.length > 0) {
      console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  // Audit logging
  async logAudit(entry: {
    userId?: string;
    action: string;
    resource: string;
    metadata?: string;
  }): Promise<void> {
    await this.initialize();
    
    const log: MockAuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    this.auditLogs.push(log);
    
    // Keep only last 1000 logs to prevent memory issues
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }

  async getAuditLogs(userId?: string, limit = 50): Promise<MockAuditLog[]> {
    await this.initialize();
    
    let logs = this.auditLogs;
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Search and query operations
  async searchUsers(query: string): Promise<MockUser[]> {
    await this.initialize();
    
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
    await this.initialize();
    
    const results: MockUser[] = [];
    
    for (const user of this.users.values()) {
      if (user.role === role) {
        results.push(user);
      }
    }
    
    return results;
  }

  // Statistics
  async getStats(): Promise<{
    totalUsers: number;
    totalSessions: number;
    totalAuditLogs: number;
    usersByRole: Record<string, number>;
  }> {
    await this.initialize();
    
    const usersByRole: Record<string, number> = {};
    
    for (const user of this.users.values()) {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    }
    
    return {
      totalUsers: this.users.size,
      totalSessions: this.sessions.size,
      totalAuditLogs: this.auditLogs.length,
      usersByRole
    };
  }

  // Cleanup
  async close(): Promise<void> {
    this.users.clear();
    this.sessions.clear();
    this.auditLogs = [];
    this.isInitialized = false;
    console.log('🗄️  In-memory mock database closed');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; stats: any }> {
    await this.initialize();
    
    const stats = await this.getStats();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats
    };
  }

  // Reset data (useful for testing)
  async reset(): Promise<void> {
    await this.close();
    await this.initialize();
    console.log('🔄 Mock database reset');
  }

  // Export data (for debugging)
  exportData(): {
    users: MockUser[];
    sessions: MockSession[];
    auditLogs: MockAuditLog[];
  } {
    return {
      users: Array.from(this.users.values()),
      sessions: Array.from(this.sessions.values()),
      auditLogs: this.auditLogs
    };
  }
}

// Singleton instance
export const inMemoryMockDatabase = new InMemoryMockDatabase();
