// Real Snowflake Database Integration
// Production-ready Snowflake connector for Siriux

export interface SnowflakeConfig {
  account: string;
  username: string;
  password: string;
  warehouse: string;
  schema: string;
  database?: string;
  role?: string;
  clientSessionKeepAlive?: boolean;
}

export interface SnowflakeQueryResult {
  rows: any[];
  rowCount: number;
  columns: any[];
  statementId: string;
}

export class SnowflakeDatabase {
  public users: Map<string, any> = new Map();
  public sessions: Map<string, any> = new Map();
  public auditLogs: any[] = [];
  private config: SnowflakeConfig;
  private connection: any = null;
  private isConnected = false;

  constructor(config: SnowflakeConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      console.log('❄️  Connecting to Snowflake...');
      
      // Dynamic import to avoid bundle issues
      const snowflake = await import('snowflake-sdk');
      
      this.connection = snowflake.createConnection({
        account: this.config.account,
        username: this.config.username,
        password: this.config.password,
        warehouse: this.config.warehouse,
        schema: this.config.schema,
        database: this.config.database || 'SIRIUX_DEMO',
        role: this.config.role || 'ACCOUNTADMIN',
        clientSessionKeepAlive: this.config.clientSessionKeepAlive || true
      });

      await this.connect();
      
      console.log(`✅ Connected to Snowflake: ${this.config.account}.${this.config.warehouse}.${this.config.schema}`);
      
      // Initialize demo schema if needed
      await this.initializeSchema();
      
    } catch (error: any) {
      console.error('❌ Snowflake connection failed:', error.message);
      throw new Error(`Snowflake connection failed: ${error.message}`);
    }
  }

  private async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.connect((err: any, conn: any) => {
        if (err) {
          reject(err);
        } else {
          this.isConnected = true;
          resolve();
        }
      });
    });
  }

  private async initializeSchema(): Promise<void> {
    try {
      // Create demo tables if they don't exist
      await this.execute(`
        CREATE TABLE IF NOT EXISTS USERS (
          ID STRING PRIMARY KEY,
          EMAIL STRING UNIQUE NOT NULL,
          PASSWORD STRING NOT NULL,
          FIRST_NAME STRING,
          LAST_NAME STRING,
          ROLE STRING NOT NULL,
          CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
          UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
        );
      `);

      await this.execute(`
        CREATE TABLE IF NOT EXISTS SESSIONS (
          ID STRING PRIMARY KEY,
          USER_ID STRING NOT NULL,
          ACCESS_TOKEN STRING NOT NULL,
          REFRESH_TOKEN STRING NOT NULL,
          EXPIRES_AT TIMESTAMP NOT NULL,
          CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
          FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
        );
      `);

      await this.execute(`
        CREATE TABLE IF NOT EXISTS AUDIT_LOGS (
          ID STRING PRIMARY KEY,
          USER_ID STRING,
          ACTION STRING NOT NULL,
          RESOURCE STRING NOT NULL,
          METADATA STRING,
          TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
          FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
        );
      `);

      // Seed demo data if tables are empty
      await this.seedDemoData();
      
    } catch (error: any) {
      console.warn('⚠️  Schema initialization failed:', error.message);
    }
  }

  private async seedDemoData(): Promise<void> {
    try {
      // Check if users table is empty
      const result = await this.execute('SELECT COUNT(*) as count FROM USERS');
      
      if (result.rows[0].COUNT === 0) {
        console.log('🌱 Seeding demo data...');
        
        // Insert demo users
        await this.execute(`
          INSERT INTO USERS (ID, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, ROLE) VALUES
            ('1', 'admin@siriux.dev', 'admin123', 'Admin', 'User', 'admin'),
            ('2', 'user@siriux.dev', 'user123', 'Demo', 'User', 'user'),
            ('3', 'manager@siriux.dev', 'manager123', 'Manager', 'User', 'manager')
        `);

        console.log('✅ Demo data seeded successfully');
      }
    } catch (error: any) {
      console.warn('⚠️  Demo data seeding failed:', error.message);
    }
  }

  async execute(query: string, params?: any[]): Promise<SnowflakeQueryResult> {
    if (!this.isConnected) {
      throw new Error('Not connected to Snowflake');
    }

    return new Promise((resolve, reject) => {
      const statement = this.connection.execute({
        sqlText: query,
        binds: params || [],
        complete: (err: any, stmt: any, rows: any[]) => {
          if (err) {
            reject(new Error(`Query failed: ${err.message}`));
          } else {
            resolve({
              rows: rows || [],
              rowCount: rows ? rows.length : 0,
              columns: stmt.getColumns ? stmt.getColumns() : [],
              statementId: stmt.getStatementId ? stmt.getStatementId() : 'unknown'
            });
          }
        }
      });
    });
  }

  // User operations
  async getUserByEmail(email: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM USERS WHERE EMAIL = ?',
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getUserById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM USERS WHERE ID = ?',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createUser(userData: any): Promise<any> {
    const id = Date.now().toString();
    
    await this.execute(`
      INSERT INTO USERS (ID, EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, ROLE) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, userData.email, userData.password, userData.firstName, userData.lastName, userData.role]);

    return this.getUserById(id);
  }

  // Session operations
  async createSession(sessionData: any): Promise<any> {
    const id = Date.now().toString();
    
    await this.execute(`
      INSERT INTO SESSIONS (ID, USER_ID, ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_AT) 
      VALUES (?, ?, ?, ?, ?)
    `, [id, sessionData.userId, sessionData.accessToken, sessionData.refreshToken, sessionData.expiresAt]);

    return { id, ...sessionData };
  }

  async getSessionByToken(accessToken: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM SESSIONS WHERE ACCESS_TOKEN = ? AND EXPIRES_AT > CURRENT_TIMESTAMP()',
      [accessToken]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async deleteSession(accessToken: string): Promise<void> {
    await this.execute(
      'DELETE FROM SESSIONS WHERE ACCESS_TOKEN = ?',
      [accessToken]
    );
  }

  // Audit logging
  async logAudit(entry: any): Promise<void> {
    await this.execute(`
      INSERT INTO AUDIT_LOGS (ID, USER_ID, ACTION, RESOURCE, METADATA) 
      VALUES (?, ?, ?, ?, ?)
    `, [Date.now().toString(), entry.userId, entry.action, entry.resource, entry.metadata || '{}']);
  }

  async getAuditLogs(userId?: string, limit = 50): Promise<any[]> {
    let query = 'SELECT * FROM AUDIT_LOGS';
    const params: any[] = [];
    
    if (userId) {
      query += ' WHERE USER_ID = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY TIMESTAMP DESC LIMIT ?';
    params.push(limit);
    
    const result = await this.execute(query, params);
    return result.rows;
  }

  // Statistics and analytics
  async getStats(): Promise<any> {
    const [userStats, sessionStats, auditStats] = await Promise.all([
      this.execute('SELECT COUNT(*) as total FROM USERS'),
      this.execute('SELECT COUNT(*) as total FROM SESSIONS WHERE EXPIRES_AT > CURRENT_TIMESTAMP()'),
      this.execute('SELECT COUNT(*) as total FROM AUDIT_LOGS')
    ]);

    // Get users by role
    const roleStats = await this.execute(`
      SELECT ROLE, COUNT(*) as count 
      FROM USERS 
      GROUP BY ROLE
    `);

    const usersByRole: Record<string, number> = {};
    roleStats.rows.forEach((row: any) => {
      usersByRole[row.ROLE] = row.COUNT;
    });

    return {
      totalUsers: userStats.rows[0].TOTAL,
      totalSessions: sessionStats.rows[0].TOTAL,
      totalAuditLogs: auditStats.rows[0].TOTAL,
      usersByRole,
      databaseType: 'snowflake',
      connectionStatus: this.isConnected ? 'healthy' : 'disconnected'
    };
  }

  // Advanced features
  async executeAnalytics(query: string): Promise<any> {
    console.log(`📊 Running analytics query: ${query}`);
    return this.execute(query);
  }

  async getTableInfo(tableName: string): Promise<any> {
    const result = await this.execute(`DESCRIBE TABLE ${tableName}`);
    return result.rows;
  }

  async getWarehouseInfo(): Promise<any> {
    const result = await this.execute('SHOW WAREHOUSES');
    return result.rows;
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const result = await this.execute('SELECT CURRENT_TIMESTAMP() as now');
      return {
        status: 'healthy',
        databaseType: 'snowflake',
        warehouse: this.config.warehouse,
        schema: this.config.schema,
        timestamp: result.rows[0].NOW,
        connected: this.isConnected
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        databaseType: 'snowflake',
        error: error.message,
        connected: false
      };
    }
  }

  // Cleanup
  async close(): Promise<void> {
    if (this.connection && this.isConnected) {
      return new Promise((resolve) => {
        this.connection.destroy((err: any) => {
          if (err) {
            console.error('❌ Error closing Snowflake connection:', err);
          } else {
            console.log('✅ Snowflake connection closed');
          }
          this.isConnected = false;
          resolve();
        });
      });
    }
  }

  // Reset demo data
  async reset(): Promise<void> {
    try {
      console.log('?? Resetting Snowflake demo data...');
      
      await this.execute('DELETE FROM AUDIT_LOGS');
      await this.execute('DELETE FROM SESSIONS');
      await this.execute('DELETE FROM USERS');
      
      await this.seedDemoData();
      
      console.log('?? Snowflake demo data reset successfully');
    } catch (error: any) {
      console.error('?? Reset failed:', error.message);
      throw error;
    }
  }

  // Additional methods required by IMockDatabase interface
  async createTables(): Promise<void> {
    // Tables are created in initializeSchema()
    console.log('?? Snowflake tables already created during initialization');
  }

  async updateUser(id: string, updates: any): Promise<any> {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);
    
    await this.execute(
      `UPDATE USERS SET ${setClause}, UPDATED_AT = CURRENT_TIMESTAMP() WHERE ID = ?`,
      [...values, id]
    );
    
    return this.getUserById(id);
  }

  async getSessionById(id: string): Promise<any> {
    const result = await this.execute(
      'SELECT * FROM SESSIONS WHERE ID = ?',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.execute(
      'DELETE FROM SESSIONS WHERE EXPIRES_AT <= CURRENT_TIMESTAMP()'
    );
  }

  async searchUsers(query: string): Promise<any[]> {
    const result = await this.execute(
      `SELECT * FROM USERS WHERE EMAIL LIKE ? OR FIRST_NAME LIKE ? OR LAST_NAME LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return result.rows;
  }

  async getUsersByRole(role: string): Promise<any[]> {
    const result = await this.execute(
      'SELECT * FROM USERS WHERE ROLE = ?',
      [role]
    );
    
    return result.rows;
  }
}

// Factory function
export const createSnowflakeDatabase = (config: SnowflakeConfig): SnowflakeDatabase => {
  return new SnowflakeDatabase(config);
};

// Environment-based configuration
export const getSnowflakeConfig = (): SnowflakeConfig => {
  const config: SnowflakeConfig = {
    account: process.env.SNOWFLAKE_ACCOUNT || '',
    username: process.env.SNOWFLAKE_USERNAME || '',
    password: process.env.SNOWFLAKE_PASSWORD || '',
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'DEMO_WAREHOUSE',
    schema: process.env.SNOWFLAKE_SCHEMA || 'SIRIUX_DEMO',
    database: process.env.SNOWFLAKE_DATABASE || 'SIRIUX_DEMO',
    role: process.env.SNOWFLAKE_ROLE || 'ACCOUNTADMIN',
    clientSessionKeepAlive: process.env.SNOWFLAKE_KEEP_ALIVE === 'true'
  };

  // Validate required fields
  const required = ['account', 'username', 'password', 'warehouse', 'schema'];
  const missing = required.filter(field => !config[field as keyof SnowflakeConfig]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Snowflake config: ${missing.join(', ')}`);
  }

  return config;
};
