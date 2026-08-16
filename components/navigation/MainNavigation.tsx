'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import LogoutButton from '@/components/auth/LogoutButton';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

const publicNavItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'About',
    href: '/about',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const authenticatedNavItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    disabled: true,
  },
  {
    name: 'Help',
    href: '/help',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    disabled: true,
  },
];

interface MainNavigationProps {
  variant?: 'default' | 'sidebar';
}

export default function MainNavigation({ variant = 'default' }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (variant === 'sidebar') {
    return (
      <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              EthioPromo
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActiveLink(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <span className={cn(
                  isActiveLink(item.href) ? "text-primary-600" : "text-gray-400"
                )}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
                {item.disabled && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* User Section */}
          {isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
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
              <LogoutButton variant="ghost" size="sm" className="w-full justify-start">
                Sign Out
              </LogoutButton>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Default horizontal navigation (header)
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              EthioPromo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActiveLink(item.href)
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs ml-1">
                    {item.badge}
                  </span>
                )}
                {item.disabled && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading && (
              <div className="w-6 h-6 animate-pulse bg-gray-200 rounded"></div>
            )}
            
            {!isAuthenticated && !isLoading && (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {session?.user?.name?.split(' ')[0]}
                </span>
                <LogoutButton variant="outline" size="sm">
                  Sign Out
                </LogoutButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium",
                    isActiveLink(item.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className={cn(
                    isActiveLink(item.href) ? "text-primary-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.disabled && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {!isAuthenticated && !isLoading && (
                <div className="space-y-2">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full justify-start">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                  <LogoutButton variant="outline" size="sm" className="w-full justify-start">
                    Sign Out
                  </LogoutButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}