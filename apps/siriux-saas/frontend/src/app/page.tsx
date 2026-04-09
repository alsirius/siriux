'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const isDarkMode = false; // Temporarily disable theme to avoid SSR issues

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Siriux SaaS Platform
            </h1>
            <p className={`text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              Build your next SaaS application with our comprehensive starter kit
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/signup" className={`px-8 py-3 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                Get Started
              </a>
              <a href="/demo" className={`px-8 py-3 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                View Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Core Services
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to build a successful SaaS application
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              Authentication
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              JWT-based authentication system
            </p>
            <ul className="space-y-2">
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                User registration
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Login/logout
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Token refresh
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              User Management
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              Complete user management system
            </p>
            <ul className="space-y-2">
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                User profiles
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Role management
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Permissions
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              Analytics
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              Real-time analytics dashboard
            </p>
            <ul className="space-y-2">
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                User metrics
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Performance tracking
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Custom reports
              </li>
            </ul>
          </div>

          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">�</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              Configuration
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              Flexible configuration system
            </p>
            <ul className="space-y-2">
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Environment configs
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Feature flags
              </li>
              <li className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="mr-2 text-blue-600">✓</span>
                Settings management
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Interactive Features
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Try out the features yourself
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              Authentication System
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              Complete user authentication with JWT tokens
            </p>
            <a href="/demo" className={`inline-block px-6 py-3 text-center rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Try Authentication Demo
            </a>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="text-center mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 text-center`}>
              User Management
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>
              Manage users, roles, and permissions
            </p>
            <a href="/demo" className={`inline-block px-6 py-3 text-center rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Try User Management Demo
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="https://twitter.com" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span className="text-2xl">🐦</span>
              </a>
              <a href="https://github.com" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span className="text-2xl">🐙</span>
              </a>
              <a href="https://linkedin.com" className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span className="text-2xl">💼</span>
              </a>
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              &copy; 2024 Siriux SaaS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
