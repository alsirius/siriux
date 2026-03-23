'use client';

import { useState } from 'react';

export default function DocumentationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Documentation Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 0 4.5 0v-13z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h5.586a1 1 0 01.707.293l6.414 6.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Documentation
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Premium WebApp Starter Kit</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="prose max-w-none">
                  
                  {/* Quick Overview */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Overview</h3>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-gray-700">
                        <strong>Production-ready web application starter</strong> with enterprise-grade architecture, 
                        PostgreSQL database, JWT authentication, and generic patterns for rapid development.
                      </p>
                    </div>
                  </div>

                  {/* Architecture */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Architecture</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Node.js + TypeScript</li>
                          <li>• Express.js + Middleware</li>
                          <li>• PostgreSQL + SQLite</li>
                          <li>• Generic DAO Pattern</li>
                          <li>• JWT + Refresh Tokens</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• React + TypeScript</li>
                          <li>• Tailwind CSS</li>
                          <li>• Generic API Client</li>
                          <li>• Custom Hooks</li>
                          <li>• Context State</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">🔐 Authentication</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• JWT with refresh tokens</li>
                          <li>• Role-based access</li>
                          <li>• Secure sessions</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">🗄️ Database</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• PostgreSQL production</li>
                          <li>• SQLite development</li>
                          <li>• Generic DAO layer</li>
                          <li>• Migration support</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">⚡ Developer XP</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Hot reload</li>
                          <li>• Type safety</li>
                          <li>• Docker support</li>
                          <li>• Auto-setup scripts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Getting Started */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Getting Started</h3>
                    <div className="bg-gray-900 text-white p-4 rounded-lg">
                      <pre className="text-sm">
<code>{`# Clone and setup
git clone https://github.com/alsirius/siriux.git my-app
cd my-app
npm run setup

# Start development
npm run dev

# Build for production
npm run build`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Generic Patterns */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🔧 Generic Patterns</h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-gray-700 mb-4">
                        <strong>Zero boilerplate CRUD operations</strong> - Extend generic classes for instant functionality:
                      </p>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <pre className="text-xs overflow-x-auto">
<code>{`// 1. Define types
interface Product { id: string; name: string; }

// 2. Create DAO
class ProductDAO extends PostgreSQLDAO<Product, CreateDto, UpdateDto> {
  protected mapRowToEntity(row: any): Product { /* mapping */ }
  protected getInsertFields(): string[] { return ['name']; }
}

// 3. Create Service
class ProductService extends GenericService<Product, CreateDto, UpdateDto> {
  // Business logic here
}

// 4. Create Controller
class ProductController extends GenericController<Product, CreateDto, UpdateDto> {
  // Custom endpoints here
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Technology Stack */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">💻 Technology Stack</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">⚛️</div>
                        <div className="text-sm font-medium">Node.js</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">📘</div>
                        <div className="text-sm font-medium">TypeScript</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">🐘</div>
                        <div className="text-sm font-medium">PostgreSQL</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">⚛️</div>
                        <div className="text-sm font-medium">React</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">🎨</div>
                        <div className="text-sm font-medium">Tailwind</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">🔐</div>
                        <div className="text-sm font-medium">JWT Auth</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">🐳</div>
                        <div className="text-sm font-medium">Docker</div>
                      </div>
                    </div>
                  </div>

                  {/* Perfect For */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Perfect For Building</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-blue-900">🏢 SaaS</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-green-900">🛒 E-commerce</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-purple-900">🏥 Healthcare</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-yellow-900">📚 Education</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-red-900">💼 Project Mgmt</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-medium text-indigo-900">🎨 Portfolios</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
