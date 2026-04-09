'use client';

export const dynamic = 'force-dynamic';

import NavBar from '@/components/NavBar';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
