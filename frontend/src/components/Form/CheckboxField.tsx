import React from 'react';

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={`w-4 h-4 rounded border-gray-300 text-brand-button accent-brand-button focus:ring-brand-button-hover cursor-pointer ${
              error ? 'border-brand-error' : ''
            } ${className || ''}`}
            {...props}
          />
          <span className="ml-3 text-gray-700">{label}</span>
        </label>
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
