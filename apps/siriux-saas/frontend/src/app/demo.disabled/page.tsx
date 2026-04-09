'use client';

import { useState } from 'react';
import { DemoLoginForm } from '../../components/DemoLoginForm';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const isDarkMode = false; // Temporarily disable theme to avoid SSR issues

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} py-12`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Siriux SaaS - Interactive Demos
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            Experience the full power of our SaaS starter kit with live demos
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                showLogin 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {showLogin ? 'Hide Login' : 'Show Login Demo'}
            </button>
            <a
              href="/"
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Login Demo */}
        {showLogin && (
          <div className="mb-12">
            <DemoLoginForm />
          </div>
        )}

          {/* Feature Demos Grid - Dynamic from Config */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {['authentication', 'userManagement', 'analytics', 'blog'].map((featureKey) => {
              const featureInfo = {
                authentication: {
                  title: 'Authentication',
                  description: 'JWT authentication, role-based access, social login'
                },
                userManagement: {
                  title: 'User Management',
                  description: 'User profiles, permissions, analytics, bulk operations'
                },
                analytics: {
                  title: 'Analytics',
                  description: 'Real-time metrics, user behavior, conversion tracking'
                },
                blog: {
                  title: 'Blog System',
                  description: 'Rich editor, SEO optimization, comments, social sharing'
                }
              };
              
              const info = featureInfo[featureKey as keyof typeof featureInfo];
              
              return (
                <div
                  key={featureKey}
                  className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                  } ${activeDemo === featureKey ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActiveDemo(activeDemo === featureKey ? null : featureKey)}
                >
                  <div className="text-center mb-4">
                    <span className="text-4xl">📦</span>
                  </div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {info.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {info.description}
                  </p>
                  <div className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {activeDemo === featureKey ? 'Click to collapse' : 'Click to expand'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Demo Display */}
          {activeDemo && (
            <div className="mb-12">
              <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1).replace(/([A-Z])/g, ' $1')}
                </h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Interactive demo for {activeDemo} features
                </p>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300">
                    Demo functionality will be implemented with proper backend integration
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documentation Links */}
          <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Documentation & Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="https://docs.siriux.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm">Complete API reference and integration guides</p>
              </a>
              <a
                href="/signup"
                className={`p-4 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <h3 className="font-semibold mb-2">Get Started</h3>
                <p className="text-sm">Sign up for a free account and start building</p>
              </a>
              <a
                href="https://github.com/alsirius/siriux"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <h3 className="font-semibold mb-2">GitHub Repository</h3>
                <p className="text-sm">View source code and contribute to the project</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
