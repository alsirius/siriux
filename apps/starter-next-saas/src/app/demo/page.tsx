'use client';

import { useState } from 'react';
import { DemoAuthProvider, useDemoAuth, User } from '../../components/DemoAuthProvider';
import { DemoLoginForm } from '../../components/DemoLoginForm';
import { MockDatabaseFactory, DatabaseType } from '@siriux/core';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

// Demo users for sandbox testing
const DEMO_USERS = [
  {
    email: 'admin@siriux.dev',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    email: 'user@siriux.dev', 
    password: 'user123',
    role: 'user',
    name: 'Demo User'
  },
  {
    email: 'manager@siriux.dev',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User'
  }
];

const DemoPage = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedUser, setSelectedUser] = useState(DEMO_USERS[0]);
  const [selectedDatabase, setSelectedDatabase] = useState(DatabaseType.SNOWFLAKE_REAL);

  // Database options for user selection
  const databaseOptions = MockDatabaseFactory.getSupportedTypes().map(type => ({
    type,
    info: MockDatabaseFactory.getDatabaseInfo(type)
  }));

  return (
    <DemoAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Demo Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Siriux Demo Sandbox
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Experience the full Siriux platform with pre-configured demo accounts
            </p>
            
            {/* Database Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="mr-2">Database Backend</span>
              </h2>
              <div className="space-y-3">
                {databaseOptions.map(({ type, info }) => (
                  <div
                    key={type}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDatabase === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDatabase(type)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-gray-900">
                          {info.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {type === DatabaseType.SNOWFLAKE_REAL && !process.env.SNOWFLAKE_ACCOUNT && 
                            <span className="text-orange-600">Will fallback to mock</span>
                          }
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {selectedDatabase === type && 'Selected'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {info.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Use case:</span> {info.useCase}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {info.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {info.features.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{info.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-1">Current Selection:</div>
                  <div>
                    <strong>{MockDatabaseFactory.getDatabaseInfo(selectedDatabase).name}</strong> - 
                    {MockDatabaseFactory.getDatabaseInfo(selectedDatabase).description}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🎭 Demo Accounts
              </h2>
              <div className="space-y-3">
                {DEMO_USERS.map((user, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUser.email === user.email
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {showCredentials ? 'Hide' : 'Show'} Credentials
              </button>
              
              {showCredentials && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    <span className="mr-2">Selected Configuration:</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-2 bg-white rounded border">
                      <div className="text-xs font-medium text-gray-700 mb-1">Database Backend:</div>
                      <div className="text-sm">
                        <strong>{MockDatabaseFactory.getDatabaseInfo(selectedDatabase).name}</strong>
                      </div>
                      <div className="text-xs text-gray-500">
                        {MockDatabaseFactory.getDatabaseInfo(selectedDatabase).description}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="text-xs font-medium text-gray-700 mb-1">Account Credentials:</div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Email:</strong> {selectedUser.email}
                        </div>
                        <div>
                          <strong>Password:</strong> {selectedUser.password}
                        </div>
                        <div>
                          <strong>Role:</strong> {selectedUser.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                <span className="mr-2">Login Form</span>
              </h2>
              <p className="text-gray-600 mb-6">
                The login form will be auto-filled when you click "Quick Fill" above
              </p>

              <DemoLoginForm className="demo-login-form" />
              
              {/* Database Demo Link */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Want to test the database directly?
                  </p>
                  <a
                    href={`/database-demo?type=${selectedDatabase}`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    <span className="mr-2">Test Database</span>
                    <span className="text-xs bg-green-700 px-2 py-1 rounded">
                      {MockDatabaseFactory.getDatabaseInfo(selectedDatabase).name}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </DemoAuthProvider>
  );
};

export default DemoPage;
