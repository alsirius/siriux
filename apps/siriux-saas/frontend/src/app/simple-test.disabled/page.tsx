'use client';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Siriux SaaS - Simple Test
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          This is a simple test page to verify the build works without SSR issues.
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">✅ Build Status</h2>
          <p className="text-green-600">Frontend builds successfully</p>
          <p className="text-green-600">No SSR errors detected</p>
          <p className="text-green-600">@siriux packages integrated</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h2 className="text-xl font-semibold mb-4">🚀 Available Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Authentication system</li>
            <li>User management</li>
            <li>Role-based access control</li>
            <li>Structured logging</li>
            <li>Configuration management</li>
            <li>React UI components</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h2 className="text-xl font-semibold mb-4">📦 @siriux Packages</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><code>@siriux/core</code> - Types, interfaces, database utilities</li>
            <li><code>@siriux/auth</code> - JWT authentication middleware</li>
            <li><code>@siriux/access-control</code> - RBAC and permissions</li>
            <li><code>@siriux/logging</code> - Structured logging</li>
            <li><code>@siriux/config</code> - Configuration management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
