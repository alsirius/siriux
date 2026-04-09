'use client';

import { useState } from 'react';
import { appConfig } from '../../config/app-config';
import { LocalIcon } from './LocalIcon';

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
          permissions: ['read', 'write', 'admin'],
          loginTime: new Date().toISOString(),
          sessionDuration: '24 hours'
        });
        break;
        
      case 'userManagement':
        setDemoData({
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
            { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'inactive' }
          ],
          totalUsers: 1247,
          activeUsers: 1189,
          newUsersThisMonth: 47
        });
        break;
        
      case 'analytics':
        setDemoData({
          metrics: {
            pageViews: 45678,
            uniqueVisitors: 12456,
            bounceRate: '32.4%',
            avgSessionDuration: '4m 23s',
            conversionRate: '3.2%'
          },
          topPages: [
            { page: '/dashboard', views: 8934 },
            { page: '/features', views: 5672 },
            { page: '/pricing', views: 3421 }
          ],
          revenue: {
            mrr: '$12,450',
            arr: '$149,400',
            churnRate: '2.1%'
          }
        });
        break;
        
      case 'blog':
        setDemoData({
          posts: [
            { 
              title: 'Getting Started with SaaS Development', 
              views: 1234, 
              likes: 89, 
              comments: 23,
              publishedAt: '2024-01-15'
            },
            { 
              title: 'Best Practices for User Authentication', 
              views: 892, 
              likes: 67, 
              comments: 15,
              publishedAt: '2024-01-12'
            },
            { 
              title: 'Scaling Your Application', 
              views: 756, 
              likes: 45, 
              comments: 8,
              publishedAt: '2024-01-10'
            }
          ],
          totalPosts: 47,
          totalViews: 45678,
          engagement: '4.2%'
        });
        break;
        
      case 'marketplace':
        setDemoData({
          products: [
            { 
              name: 'Premium Analytics Dashboard', 
              price: '$49/month', 
              rating: 4.8, 
              sales: 234,
              category: 'Analytics'
            },
            { 
              name: 'User Management Plugin', 
              price: '$29/month', 
              rating: 4.6, 
              sales: 189,
              category: 'Management'
            },
            { 
              name: 'Email Marketing Tool', 
              price: '$39/month', 
              rating: 4.7, 
              sales: 156,
              category: 'Marketing'
            }
          ],
          totalRevenue: '$45,678',
          activeListings: 23,
          totalSales: 892
        });
        break;
        
      case 'forums':
        setDemoData({
          forums: [
            { 
              name: 'General Discussion', 
              topics: 1234, 
              posts: 8901, 
              members: 2345,
              lastActivity: '2 minutes ago'
            },
            { 
              name: 'Feature Requests', 
              topics: 456, 
              posts: 2341, 
              members: 892,
              lastActivity: '15 minutes ago'
            },
            { 
              name: 'Bug Reports', 
              topics: 234, 
              posts: 1123, 
              members: 456,
              lastActivity: '1 hour ago'
            }
          ],
          totalMembers: 5678,
          onlineNow: 234,
          postsToday: 89
        });
        break;
        
      case 'events':
        setDemoData({
          events: [
            { 
              name: 'SaaS Development Workshop', 
              date: '2024-02-15', 
              attendees: 234, 
              type: 'workshop',
              location: 'Virtual'
            },
            { 
              name: 'Product Launch Webinar', 
              date: '2024-02-20', 
              attendees: 456, 
              type: 'webinar',
              location: 'Virtual'
            },
            { 
              name: 'Community Meetup', 
              date: '2024-02-25', 
              attendees: 89, 
              type: 'meetup',
              location: 'San Francisco'
            }
          ],
          totalEvents: 12,
          upcomingEvents: 3,
          totalAttendees: 3456
        });
        break;
        
      case 'newsletter':
        setDemoData({
          campaigns: [
            { 
              name: 'January Product Updates', 
              sent: 12345, 
              opened: 4567, 
              clicked: 892,
              rate: '37.0%'
            },
            { 
              name: 'New Features Announcement', 
              sent: 12345, 
              opened: 5234, 
              clicked: 1023,
              rate: '42.4%'
            },
            { 
              name: 'Weekly Digest', 
              sent: 12345, 
              opened: 3890, 
              clicked: 678,
              rate: '31.5%'
            }
          ],
          totalSubscribers: 25678,
          avgOpenRate: '36.9%',
          unsubscribes: 23
        });
        break;
        
      case 'ui':
        setDemoData({
          components: ['Button', 'Card', 'Modal', 'Form', 'Table', 'Dropdown', 'Badge', 'Alert'],
          theme: 'Professional Dark',
          customizable: true,
          responsive: true,
          accessible: true
        });
        break;
        
      case 'logging':
        setDemoData({
          logs: [
            { level: 'info', message: 'User logged in successfully', timestamp: new Date() },
            { level: 'warn', message: 'API rate limit approaching (80%)', timestamp: new Date() },
            { level: 'error', message: 'Database connection failed, retrying...', timestamp: new Date() },
            { level: 'info', message: 'Database connection restored', timestamp: new Date() }
          ],
          metrics: { 
            requests: 1234, 
            errors: 2, 
            uptime: '99.9%',
            avgResponseTime: '142ms'
          }
        });
        break;
        
      case 'config':
        setDemoData({
          currentConfig: appConfig,
          environment: 'development',
          features: Object.keys(appConfig.features).filter(key => appConfig.features[key as keyof typeof appConfig.features]),
          lastUpdated: new Date().toISOString()
        });
        break;
        
      default:
        setDemoData({ status: 'Demo ready', feature });
    }
    
    // Reset after 5 seconds for better demo experience
    setTimeout(() => {
      setIsDemoActive(false);
      setDemoData(null);
    }, 5000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <LocalIcon name={feature} className="mr-2" />
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
