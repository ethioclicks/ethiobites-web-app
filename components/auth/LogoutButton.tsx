'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  variant = 'ghost', 
  size = 'md',
  className,
  children = 'Sign Out'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      loading={isLoading}
      className={className}
    >
      {children}
    </Button>
  );
}