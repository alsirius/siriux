'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, KeyRound, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [approvalCode, setApprovalCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Registration step
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Registration

  // Function to request email verification code
  const requestVerificationCode = async () => {
    setVerificationError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setVerificationError('Please enter a valid email address');
      return;
    }

    setVerificationLoading(true);

    try {
      // TODO: Implement actual API call
      console.log('Requesting verification code for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationSent(true);
      setStep(2);
    } catch (err) {
      setVerificationError('Failed to send verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Function to verify email code
  const verifyEmailCode = async () => {
    setVerificationError('');

    if (!verificationCode) {
      setVerificationError('Please enter the verification code');
      return;
    }

    setVerificationLoading(true);

    try {
      // TODO: Implement actual API call
      console.log('Verifying code:', verificationCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailVerified(true);
      setStep(3);
    } catch (err) {
      setVerificationError('Invalid verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  const validateForm = () => {
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields marked with * are required');
      return false;
    }

    if (!emailVerified) {
      setError('Email must be verified');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: Implement actual registration API call
      console.log('Registration data:', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        approval_code: approvalCode,
        verification_code: verificationCode
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Registration successful!');
      setRegistrationComplete(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
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

        {!registrationComplete ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (step === 1) {
              requestVerificationCode();
            } else if (step === 2) {
              verifyEmailCode();
            } else if (step === 3) {
              handleSubmit(e);
            }
          }}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: Verify Your Email</h3>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={verificationSent}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send a verification code to this email address.
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{verificationError}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={requestVerificationCode}
                    disabled={verificationLoading || !email}
                  >
                    {verificationLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Verification Code
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (email) {
                        setVerificationError('');
                        setVerificationSent(false);
                        setStep(2);
                      } else {
                        setVerificationError('Please enter your email address first');
                      }
                    }}
                    disabled={verificationLoading || !email}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Use Previously Sent Code
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Enter Verification Code</h3>
                <p className="text-sm text-gray-600">
                  {verificationSent ? (
                    <>We've sent a verification code to <strong>{email}</strong>. Please check your inbox and enter the code below.</>
                  ) : (
                    <>Enter the verification code previously sent to <strong>{email}</strong>.</>
                  )}
                </p>

                <div>
                  <Label htmlFor="verificationCode">Verification Code *</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      if (numericValue.length <= 6) {
                        setVerificationCode(numericValue);
                      }
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please enter the 6-digit numeric code sent to your email.
                  </p>
                </div>

                {verificationError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{verificationError}</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep(1);
                      setVerificationError('');
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    className="flex-1"
                    onClick={verifyEmailCode}
                    disabled={verificationLoading || !verificationCode}
                  >
                    {verificationLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={requestVerificationCode}
                    disabled={verificationLoading}
                  >
                    Didn't receive the code? Send again
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Complete Registration</h3>

                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Email verified successfully!</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emailConfirmed">Email Address</Label>
                  <Input
                    id="emailConfirmed"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (123) 456-7890"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="approvalCode">Approval Code</Label>
                  <Input
                    id="approvalCode"
                    type="text"
                    value={approvalCode}
                    onChange={(e) => setApprovalCode(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you have a pre-approval code, enter it here.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="mb-4 text-gray-700">Thank you for registering!</p>
            <Button
              onClick={() => {/* TODO: Navigate to dashboard */}}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
