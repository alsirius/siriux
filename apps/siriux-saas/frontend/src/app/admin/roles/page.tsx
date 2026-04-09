'use client';

import NavBar from '@/components/NavBar';
import RolesManagementDashboard from '@/components/admin/RolesManagementDashboard';

export default function AdminRolesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-gray-600 mt-2">Manage user roles, permissions, and access control policies.</p>
          </div>
          
          <RolesManagementDashboard />
        </div>
      </main>
    </div>
  );
}
