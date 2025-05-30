'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastProps {
  type?: ToastType;
  title?: React.ReactNode;
  message: React.ReactNode;
  duration?: number; // in milliseconds
  isVisible: boolean;
  onClose: () => void;
  position?: ToastPosition;
  showIcon?: boolean;
  showProgress?: boolean;
  className?: string;
  bodyClassName?: string;
}

const Toast = ({
  type = 'info',
  title,
  message,
  duration = 5000, // Default 5 seconds
  isVisible,
  onClose,
  position = 'bottom-right',
  showIcon = true,
  showProgress = true,
  className = '',
  bodyClassName = '',
}: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Toast type classes and colors
  const toastTypeClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  // Icons for each toast type
  const toastIcon = {
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

  // Position classes
  const positionClasses = {
    'top-right': 'toast-top toast-end',
    'top-left': 'toast-top toast-start',
    'bottom-right': 'toast-bottom toast-end',
    'bottom-left': 'toast-bottom toast-start',
    'top-center': 'toast-top',
    'bottom-center': 'toast-bottom',
  };

  // Handle creating portal element
  useEffect(() => {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.setAttribute('id', 'toast-container');
      document.body.appendChild(toastContainer);
    }
    setPortalElement(toastContainer);

    return () => {
      if (toastContainer && toastContainer.childNodes.length === 0) {
        toastContainer.remove();
      }
    };
  }, []);

  // Auto-dismiss timer and progress bar
  useEffect(() => {
    if (!isVisible || duration === Infinity) return;

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Update progress bar
    if (showProgress) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const percent = Math.max(0, (remaining / duration) * 100);
        setProgress(percent);
        
        if (percent === 0) {
          clearInterval(interval);
        }
      }, 16); // ~60fps

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, duration, onClose, showProgress]);

  // Build class names
  const toastContainerClasses = [
    'toast',
    positionClasses[position],
    className
  ].filter(Boolean).join(' ');

  const alertClasses = [
    'alert',
    toastTypeClasses[type],
    'shadow-lg',
    bodyClassName
  ].filter(Boolean).join(' ');

  // Animation classes
  const animationClass = isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
  const transitionClasses = 'transform transition-all duration-300 ease-in-out';

  if (!portalElement) return null;

  return createPortal(
    <div className={toastContainerClasses}>
      <div className={`${alertClasses} ${animationClass} ${transitionClasses}`} role="alert">
        {showIcon && toastIcon[type]}
        <div>
          {title && <h3 className="font-bold">{title}</h3>}
          <div className="text-sm">{message}</div>
        </div>
        <button 
          onClick={onClose} 
          className="btn btn-ghost btn-circle btn-sm"
          aria-label="Close notification"
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
        {showProgress && (
          <div className="absolute bottom-0 left-0 h-1 bg-base-content opacity-20 w-full">
            <div 
              className="h-full bg-base-content opacity-40" 
              style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
            />
          </div>
        )}
      </div>
    </div>,
    portalElement
  );
};

export { Toast }; 