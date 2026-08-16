'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { deactivateAccount } from '@/lib/api/password-reset';

interface DeactivateAccountProps {
  onClose?: () => void;
}

export default function DeactivateAccount({ onClose }: DeactivateAccountProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = warning, 2 = confirmation form

  const router = useRouter();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep(1);
    setPassword('');
    setReason('');
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setPassword('');
    setReason('');
    setError('');
    onClose?.();
  };

  const handleProceedToConfirmation = () => {
    setStep(2);
  };

  const handleDeactivate = async () => {
    if (!password.trim()) {
      setError('Please enter your password to confirm account deactivation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await deactivateAccount(password, reason.trim() || undefined);
      
      // Successfully deactivated, sign out and redirect
      await signOut({ redirect: false });
      router.push('/auth/login?message=Your account has been deactivated. Contact support to reactivate.');
      
    } catch (error: any) {
      console.error('Deactivate account error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenModal}
        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
      >
        Deactivate Account
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Deactivate Account"
      >
        {step === 1 && (
          <div className="space-y-4">
            {/* Warning Step */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Warning: This action cannot be undone easily
                  </h4>
                  <p className="text-sm text-red-700">
                    Deactivating your account will immediately disable your access to EthioPromo.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">What happens when you deactivate:</h4>
              <ul className="text-sm text-text-secondary space-y-2 ml-4">
                <li>• Your account will be immediately disabled</li>
                <li>• You will be signed out of all devices</li>
                <li>• Your profile will no longer be accessible</li>
                <li>• You'll need to contact support to reactivate</li>
                <li>• Some data may be permanently deleted after 30 days</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Before you continue:</h4>
              <ul className="text-sm text-text-secondary space-y-2 ml-4">
                <li>• Consider temporarily disabling notifications instead</li>
                <li>• Download any important data you need</li>
                <li>• Try contacting support for assistance</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={handleCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleProceedToConfirmation}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                I Understand, Proceed
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Confirmation Form */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="text-center mb-4">
              <p className="text-text-secondary text-sm">
                Please confirm by entering your password and optionally tell us why you're leaving.
              </p>
            </div>

            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              required
              disabled={isLoading}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-text-primary">
                Reason for leaving (optional)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              >
                <option value="">Choose a reason (optional)</option>
                <option value="Privacy concerns">Privacy concerns</option>
                <option value="Too many emails">Too many emails</option>
                <option value="Not useful">Not useful</option>
                <option value="Found alternative">Found alternative</option>
                <option value="Technical issues">Technical issues</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Last chance:</strong> Are you sure you want to deactivate your account?
                This action will immediately disable your access.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleDeactivate}
                loading={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Deactivate My Account
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}