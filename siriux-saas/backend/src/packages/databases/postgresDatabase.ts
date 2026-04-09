// PostgreSQL Database Integration
// Production-ready PostgreSQL connector for Siriux

import { IMockDatabase } from '../mock/mockDatabase';

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface PostgresQueryResult {
  rows: any[];
  rowCount: number;
  command: string;
}

export class PostgresDatabase implements IMockDatabase {
  public users: Map<string, any> = new Map();
  public sessions: Map<string, any> = new Map();
  public auditLogs: any[] = [];
  private config: PostgresConfig;
  private pool: any = null;
  private isConnected = false;

  constructor(config: PostgresConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      console.log('🐘 Connecting to PostgreSQL...');
      
      // Dynamic import to avoid bundle issues
      const { Pool } = await import('pg');
      
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: this.config.max || 20,
        idleTimeoutMillis: this.config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis || 2000,
      });

      // Test connection
      await this.pool.query('SELECT NOW()');
      
      this.isConnected = true;
      console.log(`✅ Connected to PostgreSQL: ${this.config.host}:${this.config.port}/${this.config.database}`);
      
      // Initialize schema
      await this.initializeSchema();
      
    } catch (error: any) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      throw new Error(`PostgreSQL connection failed: ${error.message}`);
    }
  }

  private async initializeSchema(): Promise<void> {
    try {
      // Create users table
      await this.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create sessions table
      await this.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          access_token VARCHAR(500) NOT NULL,
          refresh_token VARCHAR(500) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Create audit_logs table
      await this.execute(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,
          action VARCHAR(100) NOT NULL,
          resource VARCHAR(255) NOT NULL,
          metadata JSONB,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
      `);

      // Create roles table
      await this.execute(`
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          permissions JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create invitations table
      await this.execute(`
        CREATE TABLE IF NOT EXISTS invitations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(100) UNIQUE NOT NULL,
          created_by UUID NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          used_by UUID,
          used_at TIMESTAMP,
          usable_by VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          FOREIGN KEY (created_by) REFERENCES users(id),
          FOREIGN KEY (used_by) REFERENCES users(id)
        );
      `);

      // Create indexes for better performance
      await this.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_sessions_access_token ON sessions(access_token);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);');
      await this.execute('CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);');

      // Seed demo data if tables are empty
      await this.seedDemoData();
      
    } catch (error: any) {
      console.warn('⚠️  Schema initialization failed:', error.message);
    }
  }

  private async seedDemoData(): Promise<void> {
    try {
      // Check if users table is empty
      const result = await this.execute('SELECT COUNT(*) as count FROM users');
      
      if (result.rows[0].count === 0) {
        console.log('🌱 Seeding demo data...');
        
        // Insert demo users
        await this.execute(`
          INSERT INTO users (email, password, first_name, last_name, role) VALUES
            ('admin@siriux.dev', 'admin123', 'Admin', 'User', 'admin'),
            ('demo@siriux.dev', 'demo123', 'Demo', 'User', 'user'),
            ('manager@siriux.dev', 'manager123', 'Manager', 'User', 'manager')
        `);

        // Insert default roles
        await this.execute(`
          INSERT INTO roles (name, description, permissions) VALUES
            ('admin', 'Full system access', '["*"]'::jsonb),
            ('user', 'Standard user access', '["read:own", "update:own"]'::jsonb),
            ('manager', 'Team management access', '["read:own", "update:own", "read:team", "update:team"]'::jsonb)
        `);

        console.log('✅ Demo data seeded successfully');
      }
    } catch (error: any) {
      console.warn('⚠️  Demo data seeding failed:', error.message);
    }
  }

  async execute(query: string, params?: any[]): Promise<PostgresQueryResult> {
    if (!this.isConnected || !this.pool) {
      throw new Error('Not connected to PostgreSQL');
    }

    const result = await this.pool.query(query, params);
    
    return {
      rows: result.rows,
      rowCount: result.rowCount || 0,
      command: result.command
    };
  }

  // User operations
  async getUserByEmail(email: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getUserById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createUser(userData: any): Promise<any> {
    const result = await this.execute(`
      INSERT INTO users (email, password, first_name, last_name, role) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userData.email, userData.password, userData.firstName, userData.lastName, userData.role]);

    return result.rows[0];
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(updates);
    
    const result = await this.execute(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id, ...values]
    );
    
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.execute(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<any[]> {
    const result = await this.execute('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  // Session operations
  async createSession(sessionData: any): Promise<any> {
    const result = await this.execute(`
      INSERT INTO sessions (user_id, access_token, refresh_token, expires_at) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sessionData.userId, sessionData.accessToken, sessionData.refreshToken, sessionData.expiresAt]);

    return result.rows[0];
  }

  async getSessionByToken(accessToken: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM sessions WHERE access_token = $1 AND expires_at > CURRENT_TIMESTAMP',
      [accessToken]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getSessionById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM sessions WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async deleteSession(accessToken: string): Promise<void> {
    await this.execute(
      'DELETE FROM sessions WHERE access_token = $1',
      [accessToken]
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.execute(
      'DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP'
    );
  }

  // Audit logging
  async logAudit(entry: any): Promise<void> {
    await this.execute(`
      INSERT INTO audit_logs (user_id, action, resource, metadata) 
      VALUES ($1, $2, $3, $4)
    `, [entry.userId, entry.action, entry.resource, JSON.stringify(entry.metadata || {})]);

    this.auditLogs.push({
      id: Date.now().toString(),
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      metadata: entry.metadata || {},
      timestamp: new Date()
    });
  }

  async getAuditLogs(userId?: string, limit = 50): Promise<any[]> {
    let query = 'SELECT * FROM audit_logs';
    const params: any[] = [];
    let paramCount = 0;
    
    if (userId) {
      paramCount++;
      query += ` WHERE user_id = $${paramCount}`;
      params.push(userId);
    }
    
    paramCount++;
    query += ` ORDER BY timestamp DESC LIMIT $${paramCount}`;
    params.push(limit);
    
    const result = await this.execute(query, params);
    return result.rows;
  }

  // Role operations
  async getRoleById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM roles WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getRoleByName(name: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM roles WHERE name = $1',
      [name]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createRole(roleData: any): Promise<any> {
    const result = await this.execute(`
      INSERT INTO roles (name, description, permissions) 
      VALUES ($1, $2, $3)
      RETURNING *
    `, [roleData.name, roleData.description, JSON.stringify(roleData.permissions || [])]);

    return result.rows[0];
  }

  async updateRole(id: string, updates: any): Promise<any> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(updates);
    
    const result = await this.execute(
      `UPDATE roles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id, ...values]
    );
    
    return this.getRoleById(id);
  }

  async deleteRole(id: string): Promise<boolean> {
    const result = await this.execute(
      'DELETE FROM roles WHERE id = $1',
      [id]
    );
    
    return (result.rowCount || 0) > 0;
  }

  async getAllRoles(): Promise<any[]> {
    const result = await this.execute('SELECT * FROM roles ORDER BY created_at DESC');
    return result.rows;
  }

  // Invitation operations
  async getInvitationById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM invitations WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getInvitationByCode(code: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM invitations WHERE code = $1',
      [code]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createInvitation(invitationData: any, createdBy: string): Promise<any> {
    const code = `SIRIUX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const result = await this.execute(`
      INSERT INTO invitations (code, created_by, usable_by) 
      VALUES ($1, $2, $3)
      RETURNING *
    `, [code, createdBy, invitationData.usableBy]);

    return result.rows[0];
  }

  async updateInvitation(id: string, updates: any): Promise<any> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(updates);
    
    const result = await this.execute(
      `UPDATE invitations SET ${setClause} WHERE id = $1`,
      [id, ...values]
    );
    
    return this.getInvitationById(id);
  }

  async markInvitationAsUsed(id: string, usedBy: string): Promise<any> {
    const result = await this.execute(`
      UPDATE invitations 
      SET used_by = $2, used_at = CURRENT_TIMESTAMP, status = 'used'
      WHERE id = $1
      RETURNING *
    `, [id, usedBy]);

    return result.rows[0];
  }

  async deleteInvitation(id: string): Promise<boolean> {
    const result = await this.execute(
      'DELETE FROM invitations WHERE id = $1',
      [id]
    );
    
    return (result.rowCount || 0) > 0;
  }

  async getAllInvitations(): Promise<any[]> {
    const result = await this.execute('SELECT * FROM invitations ORDER BY created_at DESC');
    return result.rows;
  }

  // Statistics and analytics
  async getStats(): Promise<any> {
    const [userStats, sessionStats, auditStats, roleStats, invitationStats] = await Promise.all([
      this.execute('SELECT COUNT(*) as total FROM users'),
      this.execute('SELECT COUNT(*) as total FROM sessions WHERE expires_at > CURRENT_TIMESTAMP'),
      this.execute('SELECT COUNT(*) as total FROM audit_logs'),
      this.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      this.execute('SELECT COUNT(*) as total FROM invitations WHERE status = $1', ['active'])
    ]);

    const usersByRole: Record<string, number> = {};
    roleStats.rows.forEach((row: any) => {
      usersByRole[row.role] = row.count;
    });

    return {
      totalUsers: parseInt(userStats.rows[0].total),
      totalSessions: parseInt(sessionStats.rows[0].total),
      totalAuditLogs: parseInt(auditStats.rows[0].total),
      activeInvitations: parseInt(invitationStats.rows[0].total),
      usersByRole,
      databaseType: 'postgresql',
      connectionStatus: this.isConnected ? 'healthy' : 'disconnected'
    };
  }

  // Search and filter operations
  async searchUsers(query: string): Promise<any[]> {
    const result = await this.execute(
      `SELECT * FROM users WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`,
      [`%${query}%`]
    );
    
    return result.rows;
  }

  async getUsersByRole(role: string): Promise<any[]> {
    const result = await this.execute(
      'SELECT * FROM users WHERE role = $1',
      [role]
    );
    
    return result.rows;
  }

  async getUsersByStatus(status: string): Promise<any[]> {
    const result = await this.execute(
      'SELECT * FROM users WHERE status = $1',
      [status]
    );
    
    return result.rows;
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const result = await this.execute('SELECT NOW() as now');
      return {
        status: 'healthy',
        databaseType: 'postgresql',
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        timestamp: result.rows[0].now,
        connected: this.isConnected
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        databaseType: 'postgresql',
        error: error.message,
        connected: false
      };
    }
  }

  // Cleanup
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('✅ PostgreSQL connection closed');
    }
  }

  // Reset demo data
  async reset(): Promise<void> {
    try {
      console.log('🔄 Resetting PostgreSQL demo data...');
      
      await this.execute('DELETE FROM audit_logs');
      await this.execute('DELETE FROM sessions');
      await this.execute('DELETE FROM invitations');
      await this.execute('DELETE FROM users');
      await this.execute('DELETE FROM roles');
      
      await this.seedDemoData();
      
      console.log('🔄 PostgreSQL demo data reset successfully');
    } catch (error: any) {
      console.error('🔄 Reset failed:', error.message);
      throw error;
    }
  }

  // Additional methods required by IMockDatabase interface
  async createTables(): Promise<void> {
    // Tables are created in initializeSchema()
    console.log('🐘 PostgreSQL tables already created during initialization');
  }
}

// Factory function
export const createPostgresDatabase = (config: PostgresConfig): PostgresDatabase => {
  return new PostgresDatabase(config);
};

// Environment-based configuration
export const getPostgresConfig = (): PostgresConfig => {
  const config: PostgresConfig = {
    host: process.env.PGHOST || process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.PGPORT || process.env.DATABASE_PORT || '5432'),
    database: process.env.PGDATABASE || process.env.DATABASE_NAME || 'siriux',
    user: process.env.PGUSER || process.env.DATABASE_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.DATABASE_PASSWORD || '',
    ssl: process.env.PGSSL === 'true' || process.env.DATABASE_SSL === 'true',
    max: parseInt(process.env.PG_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT || '2000')
  };

  // Validate required fields
  const required = ['host', 'port', 'database', 'user', 'password'];
  const missing = required.filter(field => !config[field as keyof PostgresConfig]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required PostgreSQL config: ${missing.join(', ')}`);
  }

  return config;
};
