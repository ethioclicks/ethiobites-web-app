import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-warm via-white to-secondary-50 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 gradient-primary rounded-full blur-2xl opacity-10"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary-400 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-accent-green rounded-full blur-2xl opacity-10"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-heading font-bold gradient-text">
            EthioPromo
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>

          {/* Auth Card */}
          <div className="glass-effect rounded-2xl p-8 shadow-xl">
            {children}
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-text-secondary">
              Need help?{' '}
              <Link href="/contact" className="text-primary-500 hover:text-primary-600 font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-sm text-text-secondary">
        <p>&copy; 2024 EthioPromo. All rights reserved.</p>
      </footer>
    </div>
  );
}