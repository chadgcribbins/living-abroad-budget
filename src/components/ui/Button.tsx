'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = 'btn';
  const variantClasses = variant !== 'primary' ? `btn-${variant}` : '';
  const sizeClasses = size !== 'md' ? `btn-${size}` : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  const stateClasses = [
    isLoading ? 'loading' : '',
    isDisabled ? 'btn-disabled' : '',
  ].filter(Boolean).join(' ');

  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    stateClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 