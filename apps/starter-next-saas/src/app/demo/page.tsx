'use client';

import { useState } from 'react';
import { DemoAuthProvider, useDemoAuth, User } from '../../components/DemoAuthProvider';
import { DemoLoginForm } from '../../components/DemoLoginForm';

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
                    🔑 Selected Account Credentials:
                  </h3>
                  <div className="space-y-2 text-sm">
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
              )}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔐 Login Form
              </h2>
              <p className="text-gray-600 mb-6">
                The login form will be auto-filled when you click "Quick Fill" above
              </p>

              <DemoLoginForm className="demo-login-form" />
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
