'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  className?: string;
  showNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  className = '',
  showNavigation = true 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Siriux
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="/docs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                Documentation
              </a>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {showNavigation && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
            <nav className="space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Dashboard
              </a>
              <a
                href="/docs"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Documentation
              </a>
            </nav>
            
            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <div className="font-medium">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
