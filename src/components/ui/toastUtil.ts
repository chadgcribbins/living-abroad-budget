import { ReactNode } from 'react';
import { useToast } from './ToastContext';

type ToastOptions = {
  title?: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
};

// A simple toast function for use outside of React components
export const toast = (options: ToastOptions) => {
  const { title, description, type = 'info', duration } = options;
  
  // This is a workaround for using toast outside of React components
  // It will be replaced with proper useToast hook usage within components
  // In a real-world application, we would use a global event emitter approach
  
  // Display console fallback for now
  console.log(`[Toast - ${type}] ${title || ''}: ${description}`);
  
  // Return a mock ID
  return 'toast-1';
};

// For use inside React components
export const useCustomToast = () => {
  const toastContext = useToast();
  
  return {
    toast: (options: ToastOptions) => {
      const { title, description, type, duration } = options;
      
      switch (type) {
        case 'success':
          return toastContext.success(description, { title, duration });
        case 'error':
          return toastContext.error(description, { title, duration });
        case 'warning':
          return toastContext.warning(description, { title, duration });
        case 'info':
        default:
          return toastContext.info(description, { title, duration });
      }
    }
  };
};

// Default export for the toast function
export default toast; 