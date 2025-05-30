'use client';

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Toast, ToastType, ToastPosition } from './Toast';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: ReactNode;
  message: ReactNode;
  duration?: number;
  position?: ToastPosition;
  showIcon?: boolean;
  showProgress?: boolean;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  toasts: ToastItem[];
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastCounter = 0;

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'bottom-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${++toastCounter}`;

    setToasts((prevToasts) => {
      // If we have too many toasts, remove the oldest ones
      const newToasts = [...prevToasts];
      if (newToasts.length >= maxToasts) {
        newToasts.splice(0, newToasts.length - maxToasts + 1);
      }
      return [...newToasts, { ...toast, id }];
    });

    return id;
  }, [maxToasts]);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

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
    <ToastContext.Provider value={{ addToast, removeToast, toasts, clearToasts }}>
      {children}
      
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
        <React.Fragment key={pos}>
          {positionToasts.map((toast) => (
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
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: (message: ReactNode, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => 
      context.addToast({ type: 'info', message, ...options }),
    info: (message: ReactNode, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => 
      context.addToast({ type: 'info', message, ...options }),
    success: (message: ReactNode, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => 
      context.addToast({ type: 'success', message, ...options }),
    error: (message: ReactNode, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => 
      context.addToast({ type: 'error', message, ...options }),
    warning: (message: ReactNode, options?: Partial<Omit<ToastItem, 'id' | 'message' | 'type'>>) => 
      context.addToast({ type: 'warning', message, ...options }),
    dismiss: (id: string) => context.removeToast(id),
    dismissAll: () => context.clearToasts(),
  };
}; 