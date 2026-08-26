import React from 'react';
import FieldLabel from './FieldLabel';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string | undefined; label: string }>;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <FieldLabel className="block mb-2" required={props.required}>
            {label}
          </FieldLabel>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 bg-brand-input focus:ring-2 focus:ring-brand-button-hover focus:border-transparent ${
            error ? 'border-standard-error' : 'border-standard'
          } ${className || ''}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value ?? 'empty'} value={option.value == null ? '' : option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
