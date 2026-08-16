'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface QuickAction {
  name: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'disabled';
  badge?: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      name: 'Update Profile',
      description: 'Edit your personal information and preferences',
      href: '/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      variant: 'primary',
    },
    {
      name: 'Change Password',
      description: 'Update your account security settings',
      onClick: () => {
        // This would open the password change modal
        window.location.href = '/profile';
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      variant: 'secondary',
    },
    {
      name: 'View Activity',
      description: 'Check your recent account activity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      variant: 'disabled',
      badge: 'Soon',
    },
    {
      name: 'Get Help',
      description: 'Contact support or browse help articles',
      onClick: () => {
        window.open('mailto:info@ethioclicks.com', '_blank');
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      variant: 'success',
    },
  ];

  const getVariantClasses = (variant: QuickAction['variant']) => {
    const variants = {
      primary: {
        card: 'border-primary-200 hover:border-primary-300 hover:shadow-md',
        icon: 'bg-primary-100 text-primary-600',
        button: 'text-primary-600 hover:text-primary-700',
      },
      secondary: {
        card: 'border-blue-200 hover:border-blue-300 hover:shadow-md',
        icon: 'bg-blue-100 text-blue-600',
        button: 'text-blue-600 hover:text-blue-700',
      },
      success: {
        card: 'border-green-200 hover:border-green-300 hover:shadow-md',
        icon: 'bg-green-100 text-green-600',
        button: 'text-green-600 hover:text-green-700',
      },
      warning: {
        card: 'border-yellow-200 hover:border-yellow-300 hover:shadow-md',
        icon: 'bg-yellow-100 text-yellow-600',
        button: 'text-yellow-600 hover:text-yellow-700',
      },
      disabled: {
        card: 'border-gray-200 opacity-60',
        icon: 'bg-gray-100 text-gray-400',
        button: 'text-gray-400 cursor-not-allowed',
      },
    };

    return variants[variant];
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.variant === 'disabled') return;
    
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      // Will be handled by Link component
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const classes = getVariantClasses(action.variant);
        
        const ActionCard = (
          <Card 
            className={`p-6 transition-all duration-200 cursor-pointer ${classes.card}`}
            onClick={() => handleActionClick(action)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${classes.icon}`}>
                {action.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {action.name}
                  </h3>
                  {action.badge && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {action.badge}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                  {action.description}
                </p>
                
                <div className={`text-sm font-medium transition-colors ${classes.button}`}>
                  {action.variant === 'disabled' ? 'Coming Soon' : 'Take Action →'}
                </div>
              </div>
            </div>
          </Card>
        );

        // Wrap in Link if href is provided and not disabled
        if (action.href && action.variant !== 'disabled') {
          return (
            <Link key={action.name} href={action.href}>
              {ActionCard}
            </Link>
          );
        }

        return <div key={action.name}>{ActionCard}</div>;
      })}
    </div>
  );
}