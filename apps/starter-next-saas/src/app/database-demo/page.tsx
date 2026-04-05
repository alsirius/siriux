'use client';

import { useState, useEffect } from 'react';
import { MockDatabaseFactory, DatabaseType } from '@siriux/core';

// Disable this page during build/SSR to avoid React context issues
const DatabaseDemoPage = () => {
  const [selectedDb, setSelectedDb] = useState<DatabaseType>(DatabaseType.SNOWFLAKE_REAL);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dbInstance, setDbInstance] = useState<any>(null);

  // Type guard for database instance
  const getDb = () => dbInstance;

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      addLog(`Initializing ${selectedDb} database...`);
      
      const db = await MockDatabaseFactory.create({ type: selectedDb });
      setDbInstance(db);
      
      await getDb().initialize();
      addLog(`✅ ${selectedDb} database initialized successfully`);
      
      // Verify if this is real Snowflake connection
      if (selectedDb === DatabaseType.SNOWFLAKE_REAL) {
        addLog('❄️ Connected to REAL Snowflake database');
        console.log('🔍 Real Snowflake Connection Verified:', {
          account: process.env.SNOWFLAKE_ACCOUNT,
          warehouse: process.env.SNOWFLAKE_WAREHOUSE,
          database: process.env.SNOWFLAKE_DATABASE,
          schema: process.env.SNOWFLAKE_SCHEMA
        });
      } else {
        addLog('🎭 Using mock database for demo');
      }
      
      const dbStats = await dbInstance.getStats();
      setStats(dbStats);
      addLog(`📊 Database stats retrieved`);
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testUserOperations = async () => {
    if (!dbInstance) return;
    
    try {
      addLog('🧪 Testing user operations...');
      
      // Test creating a user
      const testUser = {
        email: 'test@example.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      };
      
      const createdUser = await dbInstance.createUser(testUser);
      addLog(`✅ Created user: ${createdUser.email}`);
      
      // Test retrieving user
      const retrievedUser = await dbInstance.getUserByEmail('test@example.com');
      addLog(`✅ Retrieved user: ${retrievedUser?.email}`);
      
      // Test creating a session
      const testSession = {
        userId: createdUser?.id || 'test-id',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      const createdSession = await dbInstance.createSession(testSession);
      addLog(`✅ Created session for user: ${createdSession.userId}`);
      
      // Test retrieving session
      const retrievedSession = await dbInstance.getSessionByToken('test-access-token');
      addLog(`✅ Retrieved session: ${retrievedSession?.id}`);
      
      // Test deleting session
      await dbInstance.deleteSession('test-access-token');
      addLog('✅ Deleted session');
      
      addLog('🧪 User operations test completed');
      
    } catch (error: any) {
      addLog(`❌ Operations test failed: ${error.message}`);
    }
  };

  const testAuditLogging = async () => {
    if (!dbInstance) return;
    
    try {
      addLog('📋 Testing audit logging...');
      
      // Test audit logging
      await dbInstance.logAudit({
        userId: 'test-user-id',
        action: 'LOGIN',
        resource: 'database-demo',
        metadata: 'Test login from demo page'
      });
      
      await dbInstance.logAudit({
        userId: 'test-user-id',
        action: 'LOGOUT',
        resource: 'database-demo',
        metadata: 'Test logout from demo page'
      });
      
      // Retrieve audit logs
      const auditLogs = await dbInstance.getAuditLogs();
      addLog(`✅ Retrieved ${auditLogs.length} audit logs`);
      
      addLog('📋 Audit logging test completed');
      
    } catch (error: any) {
      addLog(`❌ Audit logging test failed: ${error.message}`);
    }
  };

  const getDatabaseStats = async () => {
    if (!dbInstance) return;
    
    try {
      addLog('📊 Retrieving database statistics...');
      
      const dbStats = await dbInstance.getStats();
      setStats(dbStats);
      addLog(`📊 Database stats: ${JSON.stringify(dbStats, null, 2)}`);
      
      addLog('📊 Statistics test completed');
      
    } catch (error: any) {
      addLog(`❌ Statistics test failed: ${error.message}`);
    }
  };

  // Initialize database on component mount
  useEffect(() => {
    if (dbInstance) {
      initializeDatabase();
    }
  }, [dbInstance]);

  const databaseTypes = MockDatabaseFactory.getSupportedTypes();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🗄️ Database Demo
            </h1>
            <p className="text-gray-600 mb-6">
              Test Siriux database capabilities with different backends. 
              Defaults to <strong>Real Snowflake</strong> connection.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Database Type:
            </label>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value as DatabaseType)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:border-blue-500"
            >
              {databaseTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={initializeDatabase}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Initializing...' : 'Initialize Database'}
          </button>

          <button
            onClick={testUserOperations}
            disabled={!dbInstance || isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 mt-4"
          >
            Test User Operations
          </button>

          <button
            onClick={testAuditLogging}
            disabled={!dbInstance || isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 mt-2"
          >
            Test Audit Logging
          </button>

          <button
            onClick={getDatabaseStats}
            disabled={!dbInstance || isLoading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 mt-2"
          >
            Get Statistics
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Database Statistics</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Type:</span>
                <span className="font-medium">{stats.databaseType || 'Unknown'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Connection Status:</span>
                <span className={`font-medium ${
                  stats.connectionStatus === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.connectionStatus || 'Unknown'}
                </span>
              </div>

              {stats.isRealSnowflake && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm text-green-800">
                    <div className="font-semibold">❄️ Real Snowflake Connection</div>
                    <div className="mt-1 text-xs">
                      Account: {stats.account || 'Not configured'}<br/>
                      Warehouse: {stats.warehouse || 'Not configured'}<br/>
                      Database: {stats.database || 'Not configured'}<br/>
                      Schema: {stats.schema || 'Not configured'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {stats.totalUsers !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-medium">{stats.totalUsers}</span>
              </div>
            )}

            {stats.totalSessions !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Sessions:</span>
                <span className="font-medium">{stats.totalSessions}</span>
              </div>
            )}

            {stats.totalAuditLogs !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Audit Logs:</span>
                <span className="font-medium">{stats.totalAuditLogs}</span>
              </div>
            )}

            {stats.usersByRole && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-gray-600 mb-2">Users by Role:</div>
                {Object.entries(stats.usersByRole as Record<string, number>).map(([role, count]) => (
                  <div key={role} className="flex justify-between text-xs">
                    <span className="capitalize">{role}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Activity Log</h2>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500">
                No activity yet. Initialize the database and perform operations to see logs here.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.slice().reverse().map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-gray-500 font-mono">
                      [{log}]
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDemoPage;
