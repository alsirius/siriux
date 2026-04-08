'use client';

import React, { useState } from 'react';
import { LoginForm } from '@siriux/ui';
import { useDemoAuth } from './DemoAuthProvider';

export const DemoLoginForm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { login, isLoading } = useDemoAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(credentials.email, credentials.password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className={className}>
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        title="Sign In"
        submitText="Sign In"
      />
    </div>
  );
};
