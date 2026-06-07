import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Lädt...' }) => (
  <div className="flex items-center justify-center py-12 text-gray-500">
    <span>{message}</span>
  </div>
);

export interface ErrorStateProps {
  message: string;
  /** Shown below the message — e.g. a retry button */
  action?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, action }) => (
  <div className="flex flex-col items-center gap-3 py-12">
    <div className="px-4 py-3 bg-brand-surface border border-brand-error rounded-lg text-brand-error text-sm">
      {message}
    </div>
    {action}
  </div>
);

export interface AlertProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
  className?: string;
}

const alertStyles: Record<NonNullable<AlertProps['variant']>, string> = {
  info:    'bg-brand-surface border-brand text-gray-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  error:   'bg-brand-surface border-brand-error text-brand-error',
  success: 'bg-brand-surface border-brand text-brand',
};

export const Alert: React.FC<AlertProps> = ({ variant = 'info', children, className = '' }) => (
  <div className={`px-4 py-3 border-2 rounded-lg ${alertStyles[variant]} ${className}`}>
    {children}
  </div>
);
