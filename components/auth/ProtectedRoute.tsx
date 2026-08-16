'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Loading from '@/components/ui/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check for required roles if specified
    if (requiredRoles.length > 0) {
      const userRoles = session.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        router.push('/auth/error?error=AccessDenied');
        return;
      }
    }
  }, [session, status, router, requiredRoles, redirectTo]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-warm">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-warm">
        <Loading size="lg" text="Redirecting to login..." />
      </div>
    );
  }

  // Check roles again after session is confirmed
  if (requiredRoles.length > 0) {
    const userRoles = session.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-warm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
            <p className="text-text-secondary">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}