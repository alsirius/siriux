'use client';

import { appConfig } from '../../config/app-config';
import FeatureDemo from '../components/FeatureDemo';
import { Icon } from '@siriux/ui';

export default function HomePage() {
  const { app, theme, content } = appConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {content.hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              {content.hero.description}
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                style={{ backgroundColor: theme.primaryColor }}
                onClick={() => window.location.href = '/demo'}
              >
                {content.hero.ctaText}
              </button>
              <button 
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
                onClick={() => window.open(app.docsUrl || 'https://docs.siriux.dev', '_blank')}
              >
                <Icon name="book-open" size="sm" />
                <span>View Docs</span>
              </button>
              <button 
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
                onClick={() => window.location.href = '/database-demo'}
              >
                <Icon name="database" size="sm" />
                <span>Database Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.services.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.items.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-2xl mb-4">
                <Icon name={service.icon} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try Siriux Features Live
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See our platform in action with interactive demos of core features
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <FeatureDemo
            feature="authentication"
            title="🔐 Authentication Demo"
            description="See how @siriux/auth handles user authentication and JWT tokens"
          />
          
          <FeatureDemo
            feature="ui"
            title="🎨 UI Components Demo"
            description="Experience the power of @siriux/ui component library"
          />
          
          <FeatureDemo
            feature="logging"
            title="📊 Logging Demo"
            description="Watch @siriux/logging capture and format log messages"
          />
          
          <FeatureDemo
            feature="config"
            title="⚙️ Configuration Demo"
            description="Explore dynamic configuration with @siriux/config"
          />
        </div>
      </div>

      {/* Real-time Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Platform Statistics
            </h2>
            <p className="text-xl text-gray-300">
              Real-time metrics from the Siriux platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">7</div>
              <div className="text-gray-300">Core Packages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-300">TypeScript</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">v1.0.0</div>
              <div className="text-gray-300">Production Ready</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">0ms</div>
              <div className="text-gray-300">Build Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{app.name}</h3>
            <p className="text-gray-400 mb-4">{app.tagline}</p>
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => window.open(app.docsUrl || 'https://docs.siriux.dev', '_blank')}
              >
                📚 Documentation
              </button>
              <button 
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => window.open('https://github.com/jawwadbukhari/siriux', '_blank')}
              >
                💻 GitHub
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 {app.name}. Built with Siriux Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
