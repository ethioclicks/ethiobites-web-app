'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { getRestaurantByPublicId, getRestaurant } from '@/lib/api/restaurant';
import {
  getActivePlans,
  getRestaurantSubscription,
  getRestaurantSubscriptionHistory,
  subscribeRestaurant,
  Plan,
  PlanPricing,
  Subscription,
} from '@/lib/api/subscription';
import { uploadFileToSupabase } from '@/lib/supabase';
import { Restaurant } from '@/types/restaurant';

export default function ManageSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const restaurantId = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Subscribe form state
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string>('MONTHLY');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);
      loadData();
    }
  }, [status, session]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine if restaurantId is a numeric ID or a UUID
      let restaurantData: Restaurant;
      if (/^\d+$/.test(restaurantId)) {
        restaurantData = await getRestaurant(parseInt(restaurantId));
      } else {
        restaurantData = await getRestaurantByPublicId(restaurantId);
      }
      setRestaurant(restaurantData);

      if (restaurantData.id) {
        const [plansData, subscriptionData, historyData] = await Promise.all([
          getActivePlans(),
          getRestaurantSubscription(restaurantData.id).catch(() => null),
          getRestaurantSubscriptionHistory(restaurantData.id).catch(() => []),
        ]);
        setPlans(plansData);
        setActiveSubscription(subscriptionData);
        setHistory(historyData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !receiptFile || !restaurant?.id) return;

    try {
      setSubscribing(true);
      setError(null);
      setSuccess(null);

      // Upload receipt image
      const receiptUrl = await uploadFileToSupabase(
        receiptFile,
        'ethio-bites',
        `subscription-receipts/${restaurant.restaurantPublicId || restaurant.id}`
      );

      // Submit subscription
      await subscribeRestaurant(
        restaurant.id,
        selectedPlan.id!,
        selectedBillingCycle,
        receiptUrl,
        notes || undefined
      );

      setSuccess('Subscription request submitted! It will be activated once payment is approved by admin.');
      setShowSubscribeForm(false);
      setSelectedPlan(null);
      setReceiptFile(null);
      setNotes('');

      // Reload data
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  const getSelectedPricing = (): PlanPricing | undefined => {
    return selectedPlan?.pricings?.find(p => p.billingCycle === selectedBillingCycle);
  };

  const formatBillingCycle = (cycle: string) => {
    return cycle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (status === 'loading' || loading) {
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

  return (
    <>
      <Header />
      <Container>
        <div className="py-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <button onClick={() => router.push('/dashboard')} className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Subscription — {restaurant?.name}
            </h1>
            <p className="text-text-secondary">
              Manage your restaurant&apos;s subscription plan
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Active Subscription Card */}
          {activeSubscription && (
            <Card className="p-6 mb-8 border-green-200 bg-green-50">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Active Subscription</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-green-600">Plan</p>
                  <p className="font-medium text-green-900">{activeSubscription.plan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Billing</p>
                  <p className="font-medium text-green-900">{formatBillingCycle(activeSubscription.billingCycle)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Start</p>
                  <p className="font-medium text-green-900">{activeSubscription.startDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Expires</p>
                  <p className="font-medium text-green-900">{activeSubscription.endDate || 'N/A'}</p>
                </div>
              </div>
              {activeSubscription.plan.features && activeSubscription.plan.features.length > 0 && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-green-600 mb-2">Included Features</p>
                  <div className="flex flex-wrap gap-2">
                    {activeSubscription.plan.features.map((f, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{f.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Subscribe / Renew Button */}
          {!showSubscribeForm && (
            <button
              onClick={() => setShowSubscribeForm(true)}
              className="mb-8 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {activeSubscription ? 'Renew / Upgrade' : 'Subscribe Now'}
            </button>
          )}

          {/* Subscribe Form */}
          {showSubscribeForm && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Choose a Plan</h2>

              {/* Plan Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan);
                      // Auto-select first available billing cycle
                      if (plan.pricings && plan.pricings.length > 0) {
                        setSelectedBillingCycle(plan.pricings[0].billingCycle);
                      }
                    }}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Billing Cycle Selection */}
              {selectedPlan && selectedPlan.pricings && selectedPlan.pricings.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedPlan.pricings.map(pricing => (
                      <button
                        key={pricing.billingCycle}
                        type="button"
                        onClick={() => setSelectedBillingCycle(pricing.billingCycle)}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          selectedBillingCycle === pricing.billingCycle
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-700">{formatBillingCycle(pricing.billingCycle)}</div>
                        <div className="text-lg font-bold text-primary-600">{pricing.price} {pricing.currency}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Receipt Upload */}
              {selectedPlan && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Receipt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a screenshot of your payment receipt (max 5MB)</p>
                </div>
              )}

              {/* Notes */}
              {selectedPlan && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Any additional notes for the admin..."
                  />
                </div>
              )}

              {/* Summary & Submit */}
              {selectedPlan && getSelectedPricing() && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {getSelectedPricing()?.price} {getSelectedPricing()?.currency}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowSubscribeForm(false); setSelectedPlan(null); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={subscribing || !receiptFile}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {subscribing ? 'Processing...' : 'Submit Subscription'}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Subscription History */}
          {history.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Subscription History</h2>
              <div className="space-y-3">
                {history.map(sub => (
                  <Card key={sub.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{sub.plan.name} — {formatBillingCycle(sub.billingCycle)}</p>
                        <p className="text-sm text-gray-500">
                          {sub.startDate || 'Pending'} → {sub.endDate || 'Pending'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        sub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        sub.status === 'EXPIRED' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
