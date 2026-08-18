'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';
import { getUserProfile } from '@/lib/api/profile';
import { UserProfileModel } from '@/types/user';
import { Restaurant } from '@/types/restaurant';
import { getUserRestaurants } from '@/lib/api/restaurant';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfileModel | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  // Load profile data and restaurants
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Ensure token and pid are in localStorage for API client
      if (session.accessToken) {
        localStorage.setItem('token', session.accessToken);
      }
      if (session.user?.pid) {
        localStorage.setItem('pid', session.user.pid);
      }
      loadProfile();
      loadUserRestaurants();
    }
  }, [status, session]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRestaurants = async () => {
    if (!session?.accessToken) return;
    
    try {
      setRestaurantsLoading(true);
      
      const response = await getUserRestaurants({ 
        page: 0, 
        size: 10
      });
      
      setRestaurants(response.content || []);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
      setRestaurants([]);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
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

  if (status !== 'authenticated') {
    return null; // Will redirect
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <Header />
      <Container>
        <div className="py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {greeting}{profile?.firstName ? `, ${profile.firstName}` : ''}!
            </h1>
            <p className="text-text-secondary">
              Manage your restaurants and subscriptions from your dashboard.
            </p>
          </div>

          {/* Mobile App Promotion */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Register Your Restaurant
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Use our mobile app to easily register your restaurant, upload menus, and manage your business on the go. 
                      Once registered, you can manage subscriptions here on the web dashboard.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="https://play.google.com/store/apps/details?id=com.ethiobites"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L16.5 12l1.198-2.491zM5.864 2.658L16.802 8.99 14.5 11.293 5.864 2.658z"/>
                        </svg>
                        Google Play
                      </a>
                      <a 
                        href="https://apps.apple.com/app/ethiobites"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        App Store
                      </a>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Restaurant Management Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-text-primary">Your Restaurants</h2>
              <a 
                href="https://play.google.com/store/apps/details?id=com.ethiobites" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Restaurant (Mobile App)
              </a>
            </div>

            {restaurantsLoading ? (
              <div className="flex justify-center py-8">
                <Loading size="md" />
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onManageSubscription={(restaurant) => {
                      setSelectedRestaurant(restaurant);
                      setShowSubscriptionModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">No Restaurants Yet</h3>
                <p className="text-text-secondary mb-4">
                  Use our mobile app to register your first restaurant and start managing your business.
                </p>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.ethiobites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Download EthioBites App
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
              <Link href="/profile" className="h-full">
                <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Profile</h3>
                      <p className="text-sm text-text-secondary">Edit your info</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/support" className="h-full">
                <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 2.83a4.978 4.978 0 01-1.414-2.83m2.829 0a9 9 0 015.656 0m2.829 2.829a9 9 0 01-5.656 0" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">Support</h3>
                      <p className="text-sm text-text-secondary">Get help</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedRestaurant && (
        <SubscriptionModal
          restaurant={selectedRestaurant}
          isOpen={showSubscriptionModal}
          onClose={() => {
            setShowSubscriptionModal(false);
            setSelectedRestaurant(null);
          }}
          onSuccess={() => {
            loadUserRestaurants();
          }}
        />
      )}
    </>
  );
}