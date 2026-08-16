'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/navigation/MainNavigation';
import Loading from '@/components/ui/Loading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null; // Will redirect
  }

  // Mobile layout - use header navigation
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <main className="px-4 py-6">
          {children}
        </main>
      </div>
    );
  }

  // Desktop layout - use sidebar navigation
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
        <div className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm">
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-heading font-bold gradient-text">
                      EthioPromo
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <svg 
                    className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-4">
              <div className="space-y-2">
                <SidebarNavItem
                  href="/dashboard"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  }
                  label="Dashboard"
                  collapsed={sidebarCollapsed}
                />
                
                <SidebarNavItem
                  href="/profile"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  label="Profile"
                  collapsed={sidebarCollapsed}
                />
                
                <SidebarNavItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="Settings"
                  collapsed={sidebarCollapsed}
                  disabled
                  badge="Soon"
                />
                
                <SidebarNavItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Help & Support"
                  collapsed={sidebarCollapsed}
                  onClick={() => window.open('mailto:info@ethioclicks.com', '_blank')}
                />
              </div>
            </nav>

            {/* User Section */}
            {!sidebarCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // This would trigger logout
                    window.location.href = '/auth/login';
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// Sidebar Navigation Item Component
interface SidebarNavItemProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  disabled?: boolean;
  badge?: string;
}

function SidebarNavItem({ 
  href, 
  onClick, 
  icon, 
  label, 
  collapsed, 
  disabled = false, 
  badge 
}: SidebarNavItemProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  const isActive = href ? router.pathname === href : false;

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-primary-50 text-primary-700' 
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
      disabled={disabled}
    >
      <span className={`${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
        {icon}
      </span>
      
      {!collapsed && (
        <>
          <span className="ml-3">{label}</span>
          {badge && (
            <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}