import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const baseStyles = 'inline-block text-center font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed border-standard';

 const variantStyles = {
  primary: 'bg-brand-button text-blackish hover:bg-brand-button-hover',
  secondary: 'bg-gray-200 text-blackish hover:bg-gray-300',
  danger: 'bg-brand-error text-white hover:opacity-90',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};


export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, disabled, ...props }, ref) => {

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={finalClassName}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);


Button.displayName = 'Button';


interface LinkButtonProps extends Omit<LinkProps, 'className'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </Link>
  );
}




