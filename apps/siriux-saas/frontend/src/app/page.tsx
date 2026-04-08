'use client';

import { appConfig } from '../../config/app-config';
import FeatureDemo from '../components/FeatureDemo';
import { LocalIcon } from '../components/LocalIcon';
import { useTheme } from '../components/ThemeProvider';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { app, theme, content } = appConfig;
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              {content.hero.title}
            </h1>
            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              {content.hero.subtitle}
            </p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 max-w-2xl mx-auto`}>
              {content.hero.description}
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                className="text-white px-8 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => window.location.href = content.hero.ctaLink}
              >
                {content.hero.ctaText}
              </button>
              <button 
                className={`px-8 py-3 rounded-lg font-semibold transition-colors border-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => window.location.href = '/demo'}
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            {content.services.title}
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {content.services.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.services.items.map((service, index) => (
            <div key={index} className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="text-center mb-4">
                <LocalIcon name={service.icon} size="lg" />
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
                {service.title}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="mr-2" style={{ color: theme.primaryColor }}>×</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Demo Section */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Interactive Demos
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Try out the features yourself
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {appConfig.features.authentication && (
            <FeatureDemo 
              feature="authentication" 
              title="Authentication System"
              description="Complete user authentication with JWT tokens"
            />
          )}
          {appConfig.features.userManagement && (
            <FeatureDemo 
              feature="userManagement" 
              title="User Management"
              description="Manage users, roles, and permissions"
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center space-x-6 mb-4">
              {appConfig.contact.social.twitter && (
                <a href={appConfig.contact.social.twitter} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <LocalIcon name="twitter" size="md" />
                </a>
              )}
              {appConfig.contact.social.github && (
                <a href={appConfig.contact.social.github} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <LocalIcon name="github" size="md" />
                </a>
              )}
              {appConfig.contact.social.linkedin && (
                <a href={appConfig.contact.social.linkedin} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <LocalIcon name="linkedin" size="md" />
                </a>
              )}
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 {appConfig.app.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
