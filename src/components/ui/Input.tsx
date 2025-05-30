'use client';

import React from 'react';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'bordered' | 'ghost';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  currencySymbol?: string;
  isCurrencyInput?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    helperText,
    error,
    size = 'md',
    variant = 'bordered',
    leftAddon,
    rightAddon,
    leftIcon,
    rightIcon,
    fullWidth = false,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    helperTextClassName = '',
    errorClassName = '',
    currencySymbol,
    isCurrencyInput = false,
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

  const inputContainerClasses = [
    'input-group',
    size !== 'md' ? `input-group-${size}` : '',
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'input',
    variant !== 'default' ? `input-${variant}` : '',
    size !== 'md' ? `input-${size}` : '',
    error ? 'input-error' : '',
    'focus:outline-none',
    inputClassName,
  ].filter(Boolean).join(' ');

  const helperTextClasses = [
    'text-sm text-base-content/70 mt-1',
    helperTextClassName,
  ].filter(Boolean).join(' ');

  const errorClasses = [
    'text-sm text-error mt-1',
    errorClassName,
  ].filter(Boolean).join(' ');

  // Helper to wrap input with addons and icons if needed
  const renderInput = () => {
    // Just the input itself if no addons or icons
    if (!leftAddon && !rightAddon && !leftIcon && !rightIcon && !isCurrencyInput) {
      return <input className={inputClasses} {...props} ref={ref} />;
    }

    // Input with addons/icons
    return (
      <div className={inputContainerClasses}>
        {leftAddon && <span className="input-group-addon">{leftAddon}</span>}
        {isCurrencyInput && <span className="input-group-addon">{currencySymbol || '€'}</span>}
        <div className="relative flex-1">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${
              rightIcon ? 'pr-10' : ''
            }`}
            {...props}
            ref={ref}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {rightAddon && <span className="input-group-addon">{rightAddon}</span>}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          <span className="label-text">{label}</span>
        </label>
      )}
      {renderInput()}
      {helperText && !error && <div className={helperTextClasses}>{helperText}</div>}
      {error && <div className={errorClasses}>{error}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 