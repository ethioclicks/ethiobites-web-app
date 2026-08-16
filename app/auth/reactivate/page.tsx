'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { requestAccountReactivation } from '@/lib/api/password-reset';

function ReactivateAccountForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await requestAccountReactivation(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Reactivate account error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error on input change
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Reactivation Request Sent
          </h3>
          <p className="text-text-secondary mb-4">
            We've sent reactivation instructions to <strong>{email}</strong>
          </p>
          <p className="text-text-secondary text-sm">
            Please check your email and follow the instructions to reactivate your account.
            If you don't see the email, check your spam folder.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check your inbox for the reactivation email</li>
            <li>• Click the "Reactivate Account" button in the email</li>
            <li>• Your account will be restored immediately</li>
            <li>• Sign in with your existing credentials</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login">
            <Button variant="primary" size="lg" className="w-full">
              Back to Sign In
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
          >
            Try Different Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-text-secondary mb-4">
          Enter the email address associated with your deactivated account to request reactivation.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Account Reactivation:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Your account data will be restored if available</li>
            <li>• Some data may have been permanently deleted</li>
            <li>• You'll receive a confirmation email</li>
            <li>• Contact support if you need assistance</li>
          </ul>
        </div>
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={handleEmailChange}
        error=""
        disabled={isLoading}
        required
        autoFocus
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        Request Account Reactivation
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-text-secondary">Need more help?</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-text-secondary">
          Contact support: <a href="mailto:info@ethioclicks.com" className="text-primary-600 hover:text-primary-700">info@ethioclicks.com</a>
        </p>
        
        <Link href="/auth/login" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </form>
  );
}

export default function ReactivateAccountPage() {
  return (
    <AuthLayout 
      title="Reactivate Account" 
      subtitle="Restore access to your EthioPromo account"
    >
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }>
        <ReactivateAccountForm />
      </Suspense>
    </AuthLayout>
  );
}