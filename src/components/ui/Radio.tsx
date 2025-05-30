'use client';

import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  options: RadioOption[];
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'horizontal' | 'vertical';
  containerClassName?: string;
  labelClassName?: string;
  radioClassName?: string;
  optionClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>((
  {
    options,
    label,
    helperText,
    error,
    size = 'md',
    direction = 'vertical',
    containerClassName = '',
    labelClassName = '',
    radioClassName = '',
    optionClassName = '',
    helperTextClassName = '',
    errorClassName = '',
    name,
    ...props
  },
  ref
) => {
  // Build class names
  const containerClasses = [
    'form-control',
    containerClassName,
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'label',
    labelClassName,
  ].filter(Boolean).join(' ');

  const optionsContainerClasses = [
    direction === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2',
    'mt-1',
  ].filter(Boolean).join(' ');

  const radioClasses = [
    'radio',
    size !== 'md' ? `radio-${size}` : '',
    error ? 'radio-error' : '',
    radioClassName,
  ].filter(Boolean).join(' ');

  const optionContainerClasses = [
    'flex items-center gap-2',
    optionClassName,
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
      <div className={optionsContainerClasses} role="radiogroup">
        {options.map((option, index) => (
          <label key={option.value} className={optionContainerClasses}>
            <input
              type="radio"
              className={radioClasses}
              value={option.value}
              disabled={option.disabled}
              name={name}
              ref={index === 0 ? ref : undefined}
              {...props}
            />
            <span className="label-text">{option.label}</span>
          </label>
        ))}
      </div>
      {helperText && !error && <div className={helperTextClasses}>{helperText}</div>}
      {error && <div className={errorClasses} role="alert">{error}</div>}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio; 