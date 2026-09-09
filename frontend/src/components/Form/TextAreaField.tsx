import React, { useEffect, useRef, useState } from 'react';
import FieldLabel from './FieldLabel';

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Shows a live "x / maxWords Wörter" counter below the field, turning red once exceeded. */
  maxWords?: number;
}

const countWords = (value: string): number => {
  const trimmed = value.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, helperText, className, maxWords, defaultValue, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [wordCount, setWordCount] = useState(0);

    // React-hook-form's register() sets the uncontrolled input's initial value via its
    // own ref callback rather than the `defaultValue` prop, so read the actual DOM
    // value once mounted (e.g. when editing an existing review) instead of assuming empty.
    useEffect(() => {
      if (maxWords != null) setWordCount(countWords(innerRef.current?.value ?? ''));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setRefs = (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    };

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
      if (maxWords != null) setWordCount(countWords(e.target.value));
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <FieldLabel className="block mb-2" required={props.required}>
            {label}
          </FieldLabel>
        )}
        <textarea
          ref={setRefs}
          defaultValue={defaultValue}
          onChange={maxWords != null ? handleChange : onChange}
          className={`w-full px-3 py-2 bg-brand-input focus:ring-2 focus:ring-brand-button-hover focus:border-transparent ${
            error ? 'border-standard-error' : 'border-standard'
          } ${className || ''}`}
          {...props}
        />
        {maxWords != null && (
          <p className={`text-sm mt-1 ${wordCount > maxWords ? 'text-brand-error' : 'text-gray-500'}`}>
            {wordCount} / {maxWords} Wörter
          </p>
        )}
        {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
