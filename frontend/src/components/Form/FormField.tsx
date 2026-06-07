import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {props.required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border-2 rounded-md bg-brand-input focus:ring-2 focus:ring-brand-button-hover focus:border-transparent ${
            error ? 'border-brand-error' : 'border-black'
          } ${className || ''}`}
          {...props}
        />
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-900 italic text-sm mt-1"><i>{helperText}</i></p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
