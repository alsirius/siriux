'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function TOTPForm() {
  const [totpCode, setTotpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnableTOTP = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: Implement actual TOTP enable API call
      console.log('Enabling TOTP');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(true);
      setSuccess('TOTP enabled successfully!');
    } catch (err) {
      setError('Failed to enable TOTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyTOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: Implement actual TOTP verification API call
      console.log('Verifying TOTP code:', totpCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('TOTP verified successfully!');
    } catch (err) {
      setError('Invalid TOTP code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableTOTP = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: Implement actual TOTP disable API call
      console.log('Disabling TOTP');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(false);
      setSuccess('TOTP disabled successfully!');
    } catch (err) {
      setError('Failed to disable TOTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <Shield className="mr-2 h-6 w-6" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{success}</span>
            </div>
          </div>
        )}

        {!isEnabled ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enable two-factor authentication to add an extra layer of security to your account.
            </p>

            <Button
              onClick={handleEnableTOTP}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Enable TOTP
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your TOTP code from your authenticator app to verify the setup.
            </p>

            <form onSubmit={handleVerifyTOTP}>
              <div>
                <Label htmlFor="totpCode">TOTP Code</Label>
                <Input
                  id="totpCode"
                  type="text"
                  value={totpCode}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 6) {
                      setTotpCode(numericValue);
                    }
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || !totpCode}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDisableTOTP}
                  disabled={isSubmitting}
                >
                  Disable
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
