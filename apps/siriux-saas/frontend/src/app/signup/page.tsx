'use client';

import { appConfig } from '../../../config/app-config';
import { useTheme } from '../../components/ThemeProvider';
import Link from 'next/link';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  const { app, theme } = appConfig;
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Create Your Account
          </h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Start building your SaaS with {app.name}
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="..."
            />
          </div>

          <div>
            <label htmlFor="company" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Company (Optional)
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Acme Corp"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className={`h-4 w-4 focus:ring-2 border rounded ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500' 
                  : 'text-blue-600 focus:ring-blue-500 border-gray-300'
              }`}
            />
            <label htmlFor="terms" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Sign in with Google</span>
              Google
            </button>

            <button
              type="button"
              className={`w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">Sign in with GitHub</span>
              GitHub
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
