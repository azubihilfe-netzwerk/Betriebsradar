import { Link, type LinkProps } from 'react-router-dom';

interface LinkButtonProps extends Omit<LinkProps, 'className'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const baseStyles = 'inline-block font-semibold rounded-lg transition';

const variantStyles = {
  primary: 'bg-brand-button text-gray-800 hover:bg-brand-button-hover',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-brand-error text-white hover:opacity-90',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function LinkButton({
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
