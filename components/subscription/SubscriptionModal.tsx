import { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { subscribeRestaurant, getSubscriptionPlans } from '@/lib/api/restaurant';
import Loading from '@/components/ui/Loading';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionModal({
  restaurant,
  isOpen,
  onClose,
  onSuccess
}: SubscriptionModalProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await getSubscriptionPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load plans:', error);
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!restaurant.id) return;

    try {
      setSubscribing(planId);
      setError(null);
      
      await subscribeRestaurant(restaurant.id, planId);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Subscription failed:', error);
      setError(error.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Subscription Plans
              </h2>
              <p className="text-gray-600">
                Choose a subscription plan for <strong>{restaurant.name}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
              disabled={subscribing !== null}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Current Status</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  restaurant.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-blue-800">
                  {restaurant.isActive ? 'Active subscription' : 'No active subscription'}
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  restaurant.isApproved ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-blue-800">
                  {restaurant.isApproved ? 'Approved' : 'Pending approval'}
                </span>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`relative border-2 rounded-xl p-6 transition-all ${
                    plan.isPopular 
                      ? 'border-primary-500 bg-primary-50 transform scale-105' 
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  } ${
                    subscribing === plan.id 
                      ? 'opacity-75 pointer-events-none' 
                      : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-1">ETB</span>
                      <div className="text-sm text-gray-600">
                        per {plan.duration} days
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing !== null}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      plan.isPopular
                        ? 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-400'
                        : 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-600'
                    } ${
                      subscribing === plan.id
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {subscribing === plan.id ? (
                      <div className="flex items-center justify-center">
                        <Loading size="sm" className="mr-2" />
                        Processing...
                      </div>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>

                  {/* Value Indicator */}
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500">
                      ~{Math.round(plan.price / plan.duration)} ETB per day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Instant Activation</h4>
              <p className="text-sm text-gray-600">
                Your restaurant becomes active immediately after subscription
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-sm text-gray-600">
                Track orders, revenue, and customer insights
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l.01 0M12 12l.01 0M12 12l.01 0M12 12l.01 0" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                Get help whenever you need it from our support team
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Can I change my plan later?</h4>
                <p className="text-sm text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What happens if I don't renew?</h4>
                <p className="text-sm text-gray-600">
                  Your restaurant will be deactivated but your data remains safe. You can reactivate anytime.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Do I get a refund if I cancel?</h4>
                <p className="text-sm text-gray-600">
                  We offer prorated refunds within the first 7 days of subscription.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How do I track my usage?</h4>
                <p className="text-sm text-gray-600">
                  Your dashboard shows real-time usage statistics and remaining limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}