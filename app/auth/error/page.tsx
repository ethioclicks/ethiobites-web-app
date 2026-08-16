'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have expired.',
  Default: 'An error occurred during authentication.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as keyof typeof errorMessages;
  
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="text-center space-y-6">
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <svg 
          className="w-8 h-8 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>

      {/* Error Message */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link href="/auth/login">
          <Button variant="primary" size="lg" className="w-full">
            Try Again
          </Button>
        </Link>
        
        <Link href="/">
          <Button variant="ghost" size="lg" className="w-full">
            Go to Homepage
          </Button>
        </Link>
      </div>

      {/* Help Text */}
      <p className="text-sm text-text-secondary">
        If this problem persists, please{' '}
        <Link href="/contact" className="text-primary-500 hover:text-primary-600 font-medium">
          contact support
        </Link>
        .
      </p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <AuthLayout 
      title="Authentication Error" 
      subtitle="Something went wrong during sign in"
    >
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </AuthLayout>
  );
}