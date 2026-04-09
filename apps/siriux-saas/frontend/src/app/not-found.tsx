'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { appConfig } from '../../config/app-config';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="text-center">
        <div className="mb-8">
          <h1 className={`text-9xl font-bold ${isDarkMode ? 'text-gray-700' : 'text-gray-300'} mb-4`}>
            404
          </h1>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Page Not Found
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 text-white font-semibold rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: appConfig.theme.primaryColor }}
            >
              Go Home
            </Link>
            <Link
              href="/demo"
              className={`px-8 py-3 font-semibold rounded-lg transition-colors border-2 ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              View Demo
            </Link>
          </div>

          <div className="flex justify-center space-x-6">
            <Link
              href={appConfig.app.docsUrl || 'https://docs.siriux.dev'}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Documentation
            </Link>
            <Link
              href="/signup"
              className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sign Up
            </Link>
            <Link
              href="https://github.com/alsirius/siriux"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className={`mt-12 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-md mx-auto`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Looking for something specific?
          </h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
            Try searching for:
          </p>
          <ul className={`text-left space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <li>Authentication demo</li>
            <li>User management features</li>
            <li>API documentation</li>
            <li>Getting started guide</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
