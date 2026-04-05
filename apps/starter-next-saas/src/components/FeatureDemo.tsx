'use client';

import { useState } from 'react';
import { appConfig } from '../../config/app-config';
import { Icon } from '@siriux/ui';

interface FeatureDemoProps {
  feature: string;
  title: string;
  description: string;
}

export default function FeatureDemo({ feature, title, description }: FeatureDemoProps) {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoData, setDemoData] = useState<any>(null);

  const runDemo = async () => {
    setIsDemoActive(true);
    
    // Simulate different demos based on feature
    switch (feature) {
      case 'authentication':
        setDemoData({
          user: { name: 'John Doe', email: 'john@example.com', role: 'admin' },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          permissions: ['read', 'write', 'admin']
        });
        break;
        
      case 'ui':
        setDemoData({
          components: ['Button', 'Card', 'Modal', 'Form', 'Table'],
          theme: 'Professional',
          customizable: true
        });
        break;
        
      case 'logging':
        setDemoData({
          logs: [
            { level: 'info', message: 'User logged in', timestamp: new Date() },
            { level: 'warn', message: 'API rate limit approaching', timestamp: new Date() },
            { level: 'error', message: 'Database connection failed', timestamp: new Date() }
          ],
          metrics: { requests: 1234, errors: 2, uptime: '99.9%' }
        });
        break;
        
      case 'config':
        setDemoData({
          currentConfig: appConfig,
          environment: 'development',
          features: ['auth', 'analytics', 'blog']
        });
        break;
        
      default:
        setDemoData({ status: 'Demo ready', feature });
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsDemoActive(false);
      setDemoData(null);
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Icon name={feature} className="mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <button
        onClick={runDemo}
        disabled={isDemoActive}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isDemoActive ? 'Running Demo...' : 'Try Live Demo'}
      </button>
      
      {isDemoActive && demoData && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Live Demo Results:</h4>
          <pre className="text-xs text-gray-700 overflow-x-auto">
            {JSON.stringify(demoData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
