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

export default function Dashboard() {
  const [profile, setProfile] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  // Load profile data
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
    }
  }, [status, session]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Don't show error here, just continue without profile data
    } finally {
      setIsLoading(false);
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
            Welcome back to your EthoBites dashboard.
          </p>
        </div>

        {/* Quick Actions */}
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
                  <h3 className="font-semibold text-text-primary">Update Profile</h3>
                  <p className="text-sm text-text-secondary">Edit your personal info</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/profile" className="h-full">
            <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Change Password</h3>
                  <p className="text-sm text-text-secondary">Update your password</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </Container>
    </>
  );
}