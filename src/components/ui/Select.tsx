'use client';

import React from 'react';

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'bordered' | 'ghost';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((
  {
    options,
    label,
    helperText,
    error,
    size = 'md',
    variant = 'bordered',
    fullWidth = false,
    placeholder,
    containerClassName = '',
    labelClassName = '',
    selectClassName = '',
    helperTextClassName = '',
    errorClassName = '',
    ...props
  },
  ref
) => {
  // Building classes
  const containerClasses = [
    'form-control',
    fullWidth ? 'w-full' : '',
    containerClassName,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'label',
    labelClassName,
  ].filter(Boolean).join(' ');

  const selectClasses = [
    'select',
    variant !== 'default' ? `select-${variant}` : '',
    size !== 'md' ? `select-${size}` : '',
    error ? 'select-error' : '',
    fullWidth ? 'w-full' : '',
    selectClassName,
  ].filter(Boolean).join(' ');

  const helperTextClasses = [
    'text-sm text-base-content/70 mt-1',
    helperTextClassName,
  ].filter(Boolean).join(' ');

  const errorClasses = [
    'text-sm text-error mt-1',
    errorClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <select className={selectClasses} {...props} ref={ref}>
        {placeholder && (
          <option value="" disabled selected={!props.value}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && <div className={helperTextClasses}>{helperText}</div>}
      {error && <div className={errorClasses}>{error}</div>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 