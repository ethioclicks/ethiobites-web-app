'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AddressInput from '@/components/forms/AddressInput';
import { registerUser, validateRegistrationData, RegisterUserPayload } from '@/lib/api/auth';
import { formatPhoneNumber } from '@/lib/utils';
import { UserAddress } from '@/types/user';

function RegistrationForm() {
  const [formData, setFormData] = useState<RegisterUserPayload>({
    firstName: '',
    lastName: '',
    userName: '',
    userPassword: '',
    email: '',
    address: {
      street: '',
      city: '',
    },
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1); // Multi-step form: 1 = Personal Info, 2 = Address & Password
  
  const router = useRouter();
  const { status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleInputChange = (field: keyof RegisterUserPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    
    // Format phone number
    if (field === 'userName') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (address: UserAddress) => {
    setFormData(prev => ({ ...prev, address }));
    
    // Clear address errors
    setErrors(prev => ({
      ...prev,
      addressStreet: '',
      addressCity: '',
    }));
  };

  const validateStep1 = (): boolean => {
    const stepErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      stepErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      stepErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      stepErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      stepErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      stepErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        stepErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.userName.trim()) {
      stepErrors.userName = 'Phone number is required';
    } else {
      const phoneDigits = formData.userName.replace(/\D/g, '');
      if (phoneDigits.length < 9 || phoneDigits.length > 12) {
        stepErrors.userName = 'Please enter a valid Ethiopian phone number';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!formData.address.street.trim()) {
      stepErrors.addressStreet = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      stepErrors.addressCity = 'City is required';
    }

    if (!formData.userPassword.trim()) {
      stepErrors.userPassword = 'Password is required';
    } else if (formData.userPassword.length < 6) {
      stepErrors.userPassword = 'Password must be at least 6 characters';
    } else if (formData.userPassword.length > 50) {
      stepErrors.userPassword = 'Password must not exceed 50 characters';
    }

    if (!confirmPassword.trim()) {
      stepErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== formData.userPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare user data for API
      const userData = {
        ...formData,
        userName: formData.userName.replace(/\s+/g, ''), // Remove spaces for API
      };

      // Register user
      await registerUser(userData);
      
      // Success! Redirect to login with success message
      router.push('/auth/login?message=Registration successful! Please sign in.');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          1
        </div>
        <div className={`w-8 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
            <p className="text-text-secondary text-sm">Let's start with your basic details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              required
            />
            
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+251 9XX XXX XXX"
            value={formData.userName}
            onChange={handleInputChange('userName')}
            error={errors.userName}
            helperText="This will be used as your username"
            required
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <Button 
            type="button" 
            onClick={handleNextStep}
            variant="primary" 
            size="lg" 
            className="w-full"
          >
            Next Step
          </Button>
        </div>
      )}

      {/* Step 2: Address & Password */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Address & Security</h3>
            <p className="text-text-secondary text-sm">Complete your profile setup</p>
          </div>

          <AddressInput
            value={formData.address}
            onChange={handleAddressChange}
            errors={{
              street: errors.addressStreet,
              city: errors.addressCity,
            }}
          />

          <div className="space-y-4">
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData.userPassword}
              onChange={handleInputChange('userPassword')}
              error={errors.userPassword}
              helperText="At least 6 characters"
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              error={errors.confirmPassword}
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={handlePreviousStep}
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="flex-1"
            >
              Create Account
            </Button>
          </div>
        </div>
      )}

      {/* Login Link */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-text-secondary">Already have an account?</span>
        </div>
      </div>

      <Link href="/auth/login">
        <Button variant="outline" size="lg" className="w-full">
          Sign In Instead
        </Button>
      </Link>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join EthioPromo and start your journey"
    >
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      }>
        <RegistrationForm />
      </Suspense>
    </AuthLayout>
  );
}