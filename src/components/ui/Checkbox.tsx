'use client';

import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((
  {
    label,
    helperText,
    error,
    size = 'md',
    containerClassName = '',
    labelClassName = '',
    checkboxClassName = '',
    helperTextClassName = '',
    errorClassName = '',
    ...props
  },
  ref
) => {
  // Build class names
  const containerClasses = [
    'form-control',
    containerClassName,
  ].filter(Boolean).join(' ');

  const checkboxClasses = [
    'checkbox',
    size !== 'md' ? `checkbox-${size}` : '',
    error ? 'checkbox-error' : '',
    checkboxClassName,
  ].filter(Boolean).join(' ');

  const labelContainerClasses = [
    'flex items-center gap-2',
    labelClassName,
  ].filter(Boolean).join(' ');

  const helperTextClasses = [
    'text-sm text-base-content/70 mt-1 ml-7',
    helperTextClassName,
  ].filter(Boolean).join(' ');

  const errorClasses = [
    'text-sm text-error mt-1 ml-7',
    errorClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <label className={labelContainerClasses}>
        <input 
          type="checkbox" 
          className={checkboxClasses} 
          aria-invalid={error ? 'true' : 'false'}
          {...props} 
          ref={ref}
        />
        {label && <span className="label-text">{label}</span>}
      </label>
      {helperText && !error && <div className={helperTextClasses}>{helperText}</div>}
      {error && <div className={errorClasses} role="alert">{error}</div>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 