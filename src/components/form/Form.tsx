'use client';

import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'compact';
  loading?: boolean;
  error?: string;
  success?: string;
}

const Form = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  layout = 'vertical',
  loading = false,
  error,
  success,
  ...props
}: FormProps) => {
  const layoutClasses = {
    vertical: 'space-y-6',
    horizontal: 'grid grid-cols-12 gap-4',
    compact: 'space-y-3',
  };

  const formClasses = [
    layoutClasses[layout],
    loading ? 'opacity-70 pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <form className={formClasses} {...props}>
      {/* Form Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {subtitle && <p className="text-base-content/70 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Form Content */}
      <div className={layout === 'horizontal' ? 'col-span-12' : ''}>{children}</div>

      {/* Form Footer */}
      {footer && (
        <div className={`pt-4 ${layout === 'horizontal' ? 'col-span-12' : ''}`}>
          {footer}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-base-100 bg-opacity-50 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </form>
  );
};

export default Form; 