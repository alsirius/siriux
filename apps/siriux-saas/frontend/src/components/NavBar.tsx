'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { appConfig } from '@/config/app-config';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {appConfig.menu.brand}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {appConfig.menu.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {appConfig.menu.authenticated && (
              <>
                <Link
                  href={appConfig.menu.authenticated.profile.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {appConfig.menu.authenticated.profile.label}
                </Link>
                <Link
                  href={appConfig.menu.authenticated.admin.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {appConfig.menu.authenticated.admin.label}
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                window.location.href = '/';
              }}>
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href={appConfig.menu.auth.signIn.href}>
                    {appConfig.menu.auth.signIn.label}
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={appConfig.menu.auth.signUp.href}>
                    {appConfig.menu.auth.signUp.label}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {appConfig.menu.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {appConfig.menu.authenticated && (
              <>
                <Link
                  href={appConfig.menu.authenticated.profile.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {appConfig.menu.authenticated.profile.label}
                </Link>
                <Link
                  href={appConfig.menu.authenticated.admin.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {appConfig.menu.authenticated.admin.label}
                </Link>
              </>
            )}
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('authToken');
                    window.location.href = '/';
                  }}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    asChild
                  >
                    <Link href={appConfig.menu.auth.signIn.href} onClick={() => setMobileMenuOpen(false)}>
                      {appConfig.menu.auth.signIn.label}
                    </Link>
                  </Button>
                  <Button 
                    className="w-full"
                    asChild
                  >
                    <Link href={appConfig.menu.auth.signUp.href} onClick={() => setMobileMenuOpen(false)}>
                      {appConfig.menu.auth.signUp.label}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
