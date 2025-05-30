'use client';

import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  optional?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
  layout?: 'vertical' | 'horizontal' | 'compact';
  innerClassName?: string;
  id?: string;
}

const FormGroup = ({
  children,
  label,
  required = false,
  optional = false,
  helpText,
  error,
  className = '',
  labelClassName = '',
  contentClassName = '',
  layout = 'vertical',
  innerClassName = '',
  id,
}: FormGroupProps) => {
  const formGroupClasses = {
    vertical: 'mb-4',
    horizontal: 'grid grid-cols-12 gap-4 items-start mb-4',
    compact: 'mb-2',
  };

  const labelClasses = {
    vertical: 'block text-sm font-medium mb-1',
    horizontal: 'block text-sm font-medium col-span-3 pt-2',
    compact: 'block text-sm font-medium mb-1',
  };

  const contentClasses = {
    vertical: 'w-full',
    horizontal: 'col-span-9',
    compact: 'w-full',
  };

  const containerClass = [
    formGroupClasses[layout],
    className,
  ].filter(Boolean).join(' ');

  const labelClass = [
    labelClasses[layout],
    labelClassName,
  ].filter(Boolean).join(' ');

  const contentClass = [
    contentClasses[layout],
    contentClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label className={labelClass} htmlFor={id}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
          {optional && <span className="text-base-content/50 text-xs ml-1">(Optional)</span>}
        </label>
      )}
      <div className={contentClass}>
        <div className={innerClassName}>{children}</div>
        {helpText && !error && (
          <p className="mt-1 text-xs text-base-content/70">{helpText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    </div>
  );
};

export default FormGroup; 