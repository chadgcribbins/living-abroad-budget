'use client';

import React, { useState, useCallback } from 'react';
import { Toast, ToastType, ToastPosition } from './Toast';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: React.ReactNode;
  message: React.ReactNode;
  duration?: number;
  position?: ToastPosition;
  showIcon?: boolean;
  showProgress?: boolean;
}

export interface ToastManagerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

export interface ToastOptions {
  title?: React.ReactNode;
  duration?: number;
  position?: ToastPosition;
  showIcon?: boolean;
  showProgress?: boolean;
}

export interface ToastMethods {
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

let toastCounter = 0;

// Create a function for managing toasts
const createToastManager = () => {
  // Static methods with empty stub implementations
  // They will be properly implemented in the component
  const toastMethods: ToastMethods = {
    success: () => '',
    error: () => '',
    warning: () => '',
    info: () => '',
    dismiss: () => {},
    dismissAll: () => {},
  };

  // The actual component
  const ToastManagerComponent: React.FC<ToastManagerProps> = ({ position = 'bottom-right', maxToasts = 5 }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    
    // Remove a toast by its ID
    const removeToast = useCallback((id: string) => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    // Add a new toast
    const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${++toastCounter}`;
      
      setToasts(prevToasts => {
        // If we have too many toasts, remove the oldest ones
        const newToasts = [...prevToasts];
        if (newToasts.length >= maxToasts) {
          newToasts.splice(0, newToasts.length - maxToasts + 1);
        }
        return [...newToasts, { ...toast, id }];
      });
      
      return id;
    }, [maxToasts]);

    // Override the static methods with actual implementations
    toastMethods.success = (message: React.ReactNode, options = {}) => 
      addToast({ type: 'success', message, ...options });
    
    toastMethods.error = (message: React.ReactNode, options = {}) => 
      addToast({ type: 'error', message, ...options });
    
    toastMethods.warning = (message: React.ReactNode, options = {}) => 
      addToast({ type: 'warning', message, ...options });
    
    toastMethods.info = (message: React.ReactNode, options = {}) => 
      addToast({ type: 'info', message, ...options });
    
    toastMethods.dismiss = (id: string) => removeToast(id);
    
    toastMethods.dismissAll = () => setToasts([]);

    // Group toasts by position
    const toastsByPosition = toasts.reduce<Record<ToastPosition, ToastItem[]>>(
      (acc, toast) => {
        const pos = toast.position || position;
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(toast);
        return acc;
      },
      {} as Record<ToastPosition, ToastItem[]>
    );

    return (
      <>
        {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
          <React.Fragment key={pos}>
            {positionToasts.map(toast => (
              <Toast
                key={toast.id}
                type={toast.type}
                title={toast.title}
                message={toast.message}
                duration={toast.duration}
                isVisible={true}
                onClose={() => removeToast(toast.id)}
                position={pos as ToastPosition}
                showIcon={toast.showIcon}
                showProgress={toast.showProgress}
              />
            ))}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Attach the methods to the component
  Object.assign(ToastManagerComponent, toastMethods);

  return ToastManagerComponent as typeof ToastManagerComponent & ToastMethods;
};

// Create and export the ToastManager component with static methods
const ToastManager = createToastManager();
export default ToastManager; 