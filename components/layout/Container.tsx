import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'md', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-none',
    };

    const paddings = {
      none: 'px-0',
      sm: 'px-4 lg:px-6',
      md: 'px-6 lg:px-8',
      lg: 'px-8 lg:px-12',
    };

    return (
      <div
        className={cn(
          'mx-auto w-full',
          sizes[size],
          paddings[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;