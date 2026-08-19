'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import { getActivePlans, getMySubscription, subscribe, Plan, Subscription } from '@/lib/api/subscription';
import { getRestaurantByPublicId } from '@/lib/api/restaurant';
import { Restaurant } from '@/types/restaurant';

const BILLING_CYCLES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly (3 months)' },
  { value: 'SEMI_YEARLY', label: 'Semi-Yearly (6 months)' },
  { value: 'YEARLY', label: 'Yearly (12 months)' },
];

function SubscriptionContent() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCycle, setSelectedCycle] = useState('MONTHLY');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantParam = searchParams.get('restaurant'); // This is now expected to be a public ID

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login?callbackUrl=/subscription');
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadData();
    }
  }, [status, session]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Load plans and subscription in parallel
      const promises: Promise<any>[] = [getActivePlans(), getMySubscription()];
      
      // If we have a restaurant parameter, fetch restaurant details
      if (restaurantParam) {
        promises.push(getRestaurantByPublicId(restaurantParam));
      }
      
      const results = await Promise.all(promises);
      setPlans(results[0]);
      setCurrentSubscription(results[1]);
      
      // Set restaurant if we fetched it
      if (restaurantParam && results[2]) {
        setRestaurant(results[2]);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan?.id || !receiptUrl) {
      setError('Please upload your payment receipt');
      return;
    }
    try {
      setIsSubmitting(true);
      await subscribe(selectedPlan.id, selectedCycle, receiptUrl, notes);
      setShowSubscribeModal(false);
      setSuccess('Subscription request submitted! We will review your payment and activate your plan.');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedCycle('MONTHLY');
    setReceiptUrl('');
    setNotes('');
    setError('');
    setShowSubscribeModal(true);
  };

  const getPrice = (plan: Plan, cycle: string) => {
    const pricing = plan.pricings?.find(p => p.billingCycle === cycle);
    return pricing ? `${pricing.price} ${pricing.currency}` : 'N/A';
  };

  if (status === 'loading' || isLoading) {
    return (<><Header /><Container><div className="flex justify-center items-center min-h-[400px]"><Loading size="lg" /></div></Container></>);
  }

  return (
    <>
      <Header />
      <Container>
        <div className="max-w-5xl mx-auto py-8">
          {/* Back to Dashboard Button */}
          {restaurantParam && (
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
          )}

          {/* Restaurant Info (if viewing specific restaurant) */}
          {restaurant && (
            <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-blue-700">Managing subscription for:</h2>
                  <p className="text-lg font-bold text-blue-900">{restaurant.name}</p>
                  <p className="text-sm text-blue-600">Restaurant ID: {restaurantParam}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">
                    Status: {restaurant.restaurantStatus}
                  </p>
                  {restaurant.subscriptionEndDate && (
                    <p className="text-sm text-blue-600">
                      Expires: {new Date(restaurant.subscriptionEndDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {restaurantParam ? 'Restaurant Subscription Management' : 'Choose Your Plan'}
            </h1>
            <p className="text-text-secondary">
              {restaurantParam ? 'Manage subscription for your restaurant' : 'Select the plan that best fits your business needs'}
            </p>
          </div>

          {success && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm mb-6 text-center">{success}</div>}
          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}

          {currentSubscription && (
            <Card className="p-4 mb-8 border-primary-200 bg-primary-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary-700">Current Plan: {currentSubscription.plan?.name}</p>
                  <p className="text-sm text-primary-600">
                    Status: {currentSubscription.status} | Expires: {currentSubscription.endDate || 'N/A'}
                  </p>
                </div>
                <span className="text-xs bg-primary-200 text-primary-800 px-3 py-1 rounded-full font-medium">ACTIVE</span>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-secondary mb-4">{plan.description}</p>

                  {/* Price display */}
                  <div className="mb-4">
                    {plan.pricings?.length > 0 ? (
                      <p className="text-2xl font-bold text-primary-600">
                        {plan.pricings[0].price} <span className="text-sm font-normal text-text-secondary">{plan.pricings[0].currency}/{plan.pricings[0].billingCycle.toLowerCase().replace('_', ' ')}</span>
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-green-600">Free</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features?.map(f => (
                      <li key={f.id} className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.pricings?.length ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => openSubscribe(plan)}
                  disabled={currentSubscription?.plan?.id === plan.id}
                >
                  {currentSubscription?.plan?.id === plan.id ? 'Current Plan' : 'Subscribe'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Modal isOpen={showSubscribeModal} onClose={() => setShowSubscribeModal(false)} title={`Subscribe to ${selectedPlan?.name}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Billing Cycle</label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 outline-none"
              >
                {BILLING_CYCLES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label} - {selectedPlan ? getPrice(selectedPlan, c.value) : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">Payment Instructions:</p>
              <p className="text-sm text-blue-600">Transfer the amount to our bank account and upload the receipt screenshot below.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Payment Receipt URL</label>
              <input
                type="url"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 outline-none"
                placeholder="Paste image URL of your payment receipt"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Upload your receipt image and paste the URL here</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary-500 outline-none resize-none"
                rows={2}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setShowSubscribeModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSubscribe} loading={isSubmitting} className="flex-1">Submit Payment</Button>
            </div>
          </div>
        </Modal>
      </Container>
    </>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loading size="lg" />
          </div>
        </Container>
      </>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
