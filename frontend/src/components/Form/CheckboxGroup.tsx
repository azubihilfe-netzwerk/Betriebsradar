import React from 'react';
import FieldLabel from './FieldLabel';

export interface CheckboxGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, className, label }) => {
  return (
    <div className='space-y-2'>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={`w-full border-standard bg-brand-input p-4 space-y-2 ${className || ''}`}>
        {children}
      </div>
    </div>
   
  );
};

export default CheckboxGroup;
