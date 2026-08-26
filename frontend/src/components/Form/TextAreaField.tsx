import React from 'react';
import FieldLabel from './FieldLabel';

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <FieldLabel className="block mb-2" required={props.required}>
            {label}
          </FieldLabel>
        )}
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 bg-brand-input focus:ring-2 focus:ring-brand-button-hover focus:border-transparent ${
            error ? 'border-standard-error' : 'border-standard'
          } ${className || ''}`}
          {...props}
        />
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
