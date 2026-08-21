'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Container from '@/components/layout/Container';
import Card from '@/components/ui/Card';
import Loading from '@/components/ui/Loading';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (status === 'authenticated' && session) {
      if (session.accessToken) localStorage.setItem('token', session.accessToken);
      if (session.user?.pid) localStorage.setItem('pid', session.user.pid);

      // Redirect non-admin users to regular dashboard
      const roles = session.roles || [];
      if (!roles.includes('ADMIN')) {
        router.push('/dashboard');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
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
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Manage restaurants and platform settings</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/subscription/features" className="h-full">
              <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Manage Features</h3>
                    <p className="text-sm text-text-secondary">Create & edit subscription features</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/subscription/plans" className="h-full">
              <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Manage Plans</h3>
                    <p className="text-sm text-text-secondary">Plans, pricing & features</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/admin/subscription/payments" className="h-full">
              <Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Payment Approvals</h3>
                    <p className="text-sm text-text-secondary">Review & approve payments</p>
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
