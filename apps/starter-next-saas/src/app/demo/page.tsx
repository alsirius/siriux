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

function DemoLoginFormComponent() {
  const { login, isLoading, isAuthenticated, user } = useDemoAuth();

  if (isAuthenticated && user) {
    return (
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            ✅ Successfully Logged In!
          </h3>
          <div className="text-green-700">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🎉 Demo Features Experienced:</h4>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• JWT-style authentication (mocked)</li>
            <li>• Role-based access control</li>
            <li>• Session persistence (localStorage)</li>
            <li>• Form validation and error handling</li>
            <li>• Responsive design and accessibility</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-gray-600 mb-6">
        The login form will be auto-filled when you click "Quick Fill" above
      </p>

      <DemoLoginForm className="demo-login-form" />
    </>
  );
}

export default function DemoPage() {
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
            <p className="text-gray-500">
              No setup required - just pick a user and start exploring!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Demo Users Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                👥 Demo Accounts
              </h2>
              <p className="text-gray-600 mb-6">
                Choose a pre-configured account to experience different user roles:
              </p>

              <div className="space-y-4">
                {DEMO_USERS.map((user, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedUser.email === user.email 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-blue-600">Role: {user.role}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
                          const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
                          
                          if (emailInput && passwordInput) {
                            emailInput.value = user.email;
                            passwordInput.value = user.password;
                          }
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Quick Fill
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                {showCredentials ? '🙈 Hide' : '👁️ Show'} Passwords
              </button>

              {showCredentials && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h3 className="font-semibold text-yellow-800 mb-2">🔑 Demo Credentials:</h3>
                  <div className="space-y-2 text-sm">
                    {DEMO_USERS.map((user, index) => (
                      <div key={index} className="font-mono">
                        <strong>{user.role}:</strong> {user.email} / {user.password}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login Form Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Login Form
              </h2>

              <DemoLoginFormComponent />

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Demo Features:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• JWT authentication with role-based access</li>
                  <li>• Pre-configured user accounts (admin, user, manager)</li>
                  <li>• Session management and token handling</li>
                  <li>• Form validation and error handling</li>
                  <li>• Responsive design and accessibility</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Home */}
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
}
