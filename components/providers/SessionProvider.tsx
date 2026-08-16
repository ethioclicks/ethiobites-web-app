'use client';

import { SessionProvider as NextAuthSessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Syncs NextAuth session tokens to localStorage so the API client
 * interceptor can attach them to outgoing requests.
 */
function TokenSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.accessToken) {
        localStorage.setItem('token', session.accessToken);
      }
      if (session.user?.pid) {
        localStorage.setItem('pid', session.user.pid);
      }
    } else if (status === 'unauthenticated') {
      localStorage.removeItem('token');
      localStorage.removeItem('pid');
    }
  }, [session, status]);

  return null;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <TokenSync />
      {children}
    </NextAuthSessionProvider>
  );
}