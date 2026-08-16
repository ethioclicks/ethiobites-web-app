'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { resetPassword, verifyResetToken, validatePassword } from '@/lib/api/password-reset';

function ResetPasswordForm() {
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from URL and verify it
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    
    if (!tokenFromUrl) {
      setErrors({ token: 'Invalid reset link. Please request a new password reset.' });
      setIsVerifying(false);
      return;
    }

    setToken(tokenFromUrl);
    verifyToken(tokenFromUrl);
  }, [searchParams]);

  const verifyToken = async (resetToken: string) => {
    try {
      setIsVerifying(true);
      const result = await verifyResetToken(resetToken);
      
      if (result.valid) {
        setIsValidToken(true);
        setEmail(result.phoneNumber);
      } else {
        setErrors({ token: 'This reset link has expired. Please request a new password reset.' });
      }
    } catch (error: any) {
      console.error('Token verification error:', error);
      setErrors({ token: error.message });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    
    if (field === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
    
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const formErrors: Record<string, string> = {};

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      formErrors.newPassword = passwordValidation.errors[0];
    }

    // Validate confirm password
    if (!confirmPassword) {
      formErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== newPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await resetPassword(token, newPassword);
      setIsPasswordReset(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="text-center py-8">
        <Loading size="lg" />
        <p className="text-text-secondary mt-4">Verifying reset link...</p>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Invalid Reset Link
          </h3>
          <p className="text-text-secondary mb-4">
            {errors.token}
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/forgot-password">
            <Button variant="primary" size="lg" className="w-full">
              Request New Reset Link
            </Button>
          </Link>
          
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isPasswordReset) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Password Reset Successfully
          </h3>
          <p className="text-text-secondary mb-4">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>

        <Link href="/auth/login">
          <Button variant="primary" size="lg" className="w-full">
            Sign In to Your Account
          </Button>
        </Link>
      </div>
    );
  }

  // Reset password form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-text-secondary">
          Create a new password for <strong>{email}</strong>
        </p>
      </div>

      <Input
        label="New Password"
        type="password"
        placeholder="Create a strong password"
        value={newPassword}
        onChange={handlePasswordChange('newPassword')}
        error={errors.newPassword}
        disabled={isLoading}
        required
        autoFocus
        helperText="At least 6 characters with letters"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={handlePasswordChange('confirmPassword')}
        error={errors.confirmPassword}
        disabled={isLoading}
        required
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Password Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• At least 6 characters long</li>
          <li>• Contains at least one letter</li>
          <li>• Not more than 50 characters</li>
        </ul>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        Reset Password
      </Button>

      <div className="text-center">
        <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700">
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Create New Password" 
      subtitle="Choose a strong password for your account"
    >
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}