'use client';

import React from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: React.ReactNode;
  message: React.ReactNode;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
  titleClassName?: string;
  messageClassName?: string;
  isDismissible?: boolean;
}

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  showIcon = true,
  className = '',
  titleClassName = '',
  messageClassName = '',
  isDismissible = false,
}: AlertProps) => {
  // Alert type classes
  const alertTypeClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  // Icon for each alert type
  const alertIcon = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  // Build class names
  const alertClasses = [
    'alert',
    alertTypeClasses[type],
    className
  ].filter(Boolean).join(' ');

  const titleClasses = [
    'font-bold',
    titleClassName
  ].filter(Boolean).join(' ');

  const messageClasses = [
    'text-sm',
    messageClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={alertClasses} role="alert">
      {showIcon && alertIcon[type]}
      <div>
        {title && <h3 className={titleClasses}>{title}</h3>}
        <div className={messageClasses}>{message}</div>
      </div>
      {isDismissible && onClose && (
        <button 
          onClick={onClose} 
          className="btn btn-circle btn-ghost btn-sm"
          aria-label="Close alert"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert; 