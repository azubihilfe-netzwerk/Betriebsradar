import React from 'react';
import FieldLabel from './FieldLabel';

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  helperText?: string;
}

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <FieldLabel className="flex items-center cursor-pointer" required={props.required}>
          <input
            ref={ref}
            type="checkbox"
            className={`w-4 h-4  outline-solid outline-3 outline-black bg-brand-input text-brand-button  focus:ring-brand-button-hover cursor-pointer
             ${className || ''}`}
            {...props}
          />
          <span className="ml-3">{label}</span>
        </FieldLabel>
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
