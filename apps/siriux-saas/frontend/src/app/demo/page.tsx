'use client';

import { useState } from 'react';
import { appConfig } from '../../../config/app-config';
import FeatureDemo from '../../components/FeatureDemo';
import { DemoAuthProvider } from '../../components/DemoAuthProvider';
import { DemoLoginForm } from '../../components/DemoLoginForm';
import { useTheme } from '../../components/ThemeProvider';
import { LocalIcon } from '../../components/LocalIcon';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <DemoAuthProvider>
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
            {Object.entries(appConfig.features).map(([featureKey, isEnabled]) => {
              if (!isEnabled) return null;
              
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
                },
                marketplace: {
                  title: 'Marketplace',
                  description: 'Product listings, reviews, payment integration'
                },
                forums: {
                  title: 'Forums',
                  description: 'Discussion boards, threads, moderation tools'
                },
                events: {
                  title: 'Events',
                  description: 'Workshops, webinars, meetups, event management'
                },
                newsletter: {
                  title: 'Newsletter',
                  description: 'Email campaigns, subscriber management, analytics'
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
                    <LocalIcon name={featureKey} size="lg" />
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
              <FeatureDemo
                feature={activeDemo}
                title={activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1).replace(/([A-Z])/g, ' $1')}
                description={`Interactive demo for ${activeDemo} features`}
              />
            </div>
          )}

          {/* Documentation Links */}
          <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Documentation & Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href={appConfig.app.docsUrl || 'https://docs.siriux.dev'}
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
    </DemoAuthProvider>
  );
}
