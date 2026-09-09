import React from 'react';
import CheckboxField from './CheckboxField';
import SelectField from './SelectField';

export interface CheckboxSelectFieldProps {
  label: React.ReactNode;
  /** True whenever the stored value is not the "unchecked" value (e.g. not 'no'). */
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  options: Array<{ value: string; label: string }>;
  selectValue: string;
  onSelectChange: (value: string) => void;
  error?: string;
}

/**
 * A checkbox that, once ticked, reveals a select for choosing among a fixed
 * set of options. Backed by a single non-optional enum: unticking resets the
 * value to the "no" state, ticking defaults it to the first select option.
 */
const CheckboxSelectField: React.FC<CheckboxSelectFieldProps> = ({
  label,
  checked,
  onCheckedChange,
  options,
  selectValue,
  onSelectChange,
  error,
}) => (
  <div className="space-y-2">
    <CheckboxField label={label} checked={checked} onChange={e => onCheckedChange(e.target.checked)} />
    {checked && (
      <SelectField
        options={options}
        value={selectValue}
        onChange={e => onSelectChange(e.target.value)}
        error={error}
      />
    )}
  </div>
);

export default CheckboxSelectField;
