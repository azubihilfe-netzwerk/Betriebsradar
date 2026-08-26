import React from 'react';

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ children, required, className = '', ...props }, ref) => {
    return (
      <label ref={ref} className={`text-sm font-medium ${className}`} {...props}>
        {children}
        {required && <span className="text-brand-error ml-1">*</span>}
      </label>
    );
  }
);

FieldLabel.displayName = 'FieldLabel';

export default FieldLabel;
