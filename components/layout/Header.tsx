'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import Container from './Container';
import LogoutButton from '../auth/LogoutButton';

interface HeaderProps {
  variant?: 'default' | 'transparent' | 'glass';
  showAuth?: boolean;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default', showAuth = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const variants = {
    default: 'bg-white border-b border-gray-100 shadow-sm',
    transparent: 'bg-transparent',
    glass: 'bg-white/80 backdrop-blur-sm border-b border-white/20',
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return (
    <header className={cn('sticky top-0 z-40 w-full', variants[variant])}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={isAuthenticated ? (session?.roles?.includes('ADMIN') ? '/admin-dashboard' : '/dashboard') : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              EthoBites
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated && (
              <>
                <Link 
                  href="/about" 
                  className="text-text-secondary hover:text-primary-500 transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/services" 
                  className="text-text-secondary hover:text-primary-500 transition-colors"
                >
                  Services
                </Link>
                <Link 
                  href="/contact" 
                  className="text-text-secondary hover:text-primary-500 transition-colors"
                >
                  Contact
                </Link>
              </>
            )}
            
            {isAuthenticated && (
              <>
                <Link 
                  href={session?.roles?.includes('ADMIN') ? '/admin-dashboard' : '/dashboard'}
                  className="text-text-secondary hover:text-primary-500 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="text-text-secondary hover:text-primary-500 transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          {showAuth && (
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
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-text-secondary">
                    Welcome, {session?.user?.name?.split(' ')[0]}
                  </span>
                  <LogoutButton variant="outline" size="sm">
                    Sign Out
                  </LogoutButton>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary-500"
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
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              {!isAuthenticated && (
                <>
                  <Link 
                    href="/about"
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/services"
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link 
                    href="/contact"
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <>
                  <Link 
                    href={session?.roles?.includes('ADMIN') ? '/admin-dashboard' : '/dashboard'}
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile"
                    className="text-text-secondary hover:text-primary-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              
              {showAuth && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  {!isAuthenticated && !isLoading && (
                    <>
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="primary" size="sm" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {isAuthenticated && (
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary text-center">
                        Welcome, {session?.user?.name}
                      </p>
                      <LogoutButton variant="outline" size="sm" className="w-full">
                        Sign Out
                      </LogoutButton>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;