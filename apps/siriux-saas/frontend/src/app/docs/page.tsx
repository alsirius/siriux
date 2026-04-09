'use client';

import { useEffect } from 'react';

export default function DocsPage() {
  useEffect(() => {
    // Redirect to the docs server
    window.location.href = 'http://localhost:5173';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to documentation...</p>
      </div>
    </div>
  );
}
