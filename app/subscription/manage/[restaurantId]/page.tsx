'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { uploadReceiptImage } from '@/lib/supabase';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { 
  getActivePlans, 
  getMySubscription, 
  subscribe, 
  Plan, 
  Subscription 
} from '@/lib/api/subscription';
import { getRestaurantByPublicId } from '@/lib/api/restaurant';
import { Restaurant } from '@/types/restaurant';

const BILLING_CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly (3 months)' },
  { value: 'SEMI_YEARLY', label: 'Semi-Yearly (6 months)' },
  { value: 'YEARLY', label: 'Yearly (12 months)' },
];

export default function ManageSubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCycle, setSelectedCycle] = useState('MONTHLY');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(`/subscription/manage/${restaurantId}`));
    }
    if (status === 'authenticated' && session && restaurantId) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadData();
    }
  }, [status, session, restaurantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [plansData, subData, restaurantData] = await Promise.all([
        getActivePlans(),
        getMySubscription(),
        getRestaurantByPublicId(restaurantId)
      ]);
      
      setPlans(plansData);
      setCurrentSubscription(subData);
      setRestaurant(restaurantData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setError('');
      
      // Upload using Supabase (consistent with mobile app)
      const downloadURL = await uploadReceiptImage(file, restaurantId);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setReceiptFile(file);
    const uploadedUrl = await handleFileUpload(file);
    if (uploadedUrl) {
      setReceiptUrl(uploadedUrl);
      setSuccess('Receipt uploaded successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan?.id) {
      setError('Please select a plan');
      return;
    }
    
    if (!receiptUrl) {
      setError('Please upload your payment receipt');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await subscribe(selectedPlan.id, selectedCycle, receiptUrl, notes);
      setSuccess('Subscription request submitted successfully! We will review your payment and activate your plan within 24 hours.');
      
      // Reload data to show updated subscription
      loadData();
      
      // Reset form
      setSelectedPlan(null);
      setReceiptFile(null);
      setReceiptUrl('');
      setNotes('');
      
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to submit subscription request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrice = (plan: Plan, cycle: string) => {
    const pricing = plan.pricings?.find(p => p.billingCycle === cycle);
    return pricing ? `${pricing.price} ${pricing.currency}` : 'Contact us for pricing';
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" />
          </div>
        </Container>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <Header />
        <Container>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Restaurant Not Found</h1>
            <p className="text-gray-600 mb-6">The restaurant you're trying to access could not be found.</p>
            <Button onClick={() => router.push('/dashboard')} variant="primary">
              Back to Dashboard
            </Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Restaurant Info */}
          <Card className="p-6 mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-900 mb-2">
                  Subscription Management
                </h1>
                <h2 className="text-xl font-semibold text-blue-700 mb-1">
                  {restaurant.name}
                </h2>
                <p className="text-blue-600 text-sm">
                  Restaurant ID: {restaurantId}
                </p>
                {restaurant.street && restaurant.city && (
                  <p className="text-blue-600 text-sm">
                    📍 {restaurant.street}, {restaurant.city}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  restaurant.restaurantStatus === 'APPROVED' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {restaurant.restaurantStatus}
                </div>
                {restaurant.subscriptionEndDate && (
                  <p className="text-blue-600 text-sm mt-2">
                    Current expires: {new Date(restaurant.subscriptionEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Status Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Current Subscription */}
          {currentSubscription && (
            <Card className="p-6 mb-8 border-green-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-700">Current Active Plan</h3>
                  <p className="text-green-600 font-medium">{currentSubscription.plan?.name}</p>
                  <p className="text-green-600 text-sm">
                    Status: {currentSubscription.status} | 
                    Billing: {currentSubscription.billingCycle.replace('_', ' ').toLowerCase()}
                  </p>
                  {currentSubscription.endDate && (
                    <p className="text-green-600 text-sm">
                      Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                  ACTIVE
                </div>
              </div>
            </Card>
          )}

          {/* Available Plans */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentSubscription ? 'Upgrade/Change Plan' : 'Choose Your Plan'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    selectedPlan?.id === plan.id 
                      ? 'ring-2 ring-primary-500 border-primary-300 bg-primary-50' 
                      : 'hover:shadow-lg hover:border-primary-200'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    <input
                      type="radio"
                      checked={selectedPlan?.id === plan.id}
                      onChange={() => setSelectedPlan(plan)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  {/* Price Display */}
                  <div className="mb-4">
                    {plan.pricings?.[0] && (
                      <p className="text-2xl font-bold text-primary-600">
                        {plan.pricings[0].price} 
                        <span className="text-sm font-normal text-gray-500">
                          {plan.pricings[0].currency}/{plan.pricings[0].billingCycle.toLowerCase().replace('_', ' ')}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-1">
                    {plan.features?.map(feature => (
                      <li key={feature.id} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscription Form */}
          {selectedPlan && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Subscribe to {selectedPlan.name}
              </h3>

              <div className="space-y-6">
                {/* Billing Cycle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    value={selectedCycle}
                    onChange={(e) => setSelectedCycle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  >
                    {BILLING_CYCLES.map(cycle => (
                      <option key={cycle.value} value={cycle.value}>
                        {cycle.label} - {getPrice(selectedPlan, cycle.value)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h4>
                  <div className="text-blue-700 text-sm space-y-1">
                    <p>1. Transfer <strong>{getPrice(selectedPlan, selectedCycle)}</strong> to our bank account</p>
                    <p>2. Take a screenshot or photo of your payment receipt</p>
                    <p>3. Upload the receipt image below</p>
                    <p>4. We'll review and activate your subscription within 24 hours</p>
                  </div>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Receipt Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    {receiptFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(receiptFile)}
                            alt="Receipt preview"
                            className="max-w-full max-h-48 rounded-lg shadow-md"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{receiptFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReceiptFile(null);
                            setReceiptUrl('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-4">
                          <label htmlFor="receipt-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {isUploading ? 'Uploading...' : 'Click to upload receipt image'}
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </span>
                          </label>
                          <input
                            id="receipt-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                    placeholder="Any additional information about your payment..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubscribe}
                    loading={isSubmitting || isUploading}
                    disabled={!receiptUrl}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Subscription Request'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </>
  );
}