import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder-gray-400';
    
    const variants = {
      default: 'bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-300',
      filled: 'bg-gray-50 border-gray-200 focus:border-primary-500 focus:ring-primary-300 focus:bg-white',
    };

    const errorStyles = 'border-red-300 focus:border-red-500 focus:ring-red-300';
    const disabledStyles = 'bg-gray-100 text-gray-500 cursor-not-allowed';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            className={cn(
              baseStyles,
              variants[variant],
              error && errorStyles,
              disabled && disabledStyles,
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">{rightIcon}</div>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-500' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;