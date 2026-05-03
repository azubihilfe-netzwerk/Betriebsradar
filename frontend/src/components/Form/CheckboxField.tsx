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
            className={`w-4 h-4 rounded border-gray-300 text-navbar-blue focus:ring-navbar-blue cursor-pointer ${
              error ? 'border-red-500' : ''
            } ${className || ''}`}
            {...props}
          />
          <span className="ml-3 text-gray-700">{label}</span>
        </label>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
