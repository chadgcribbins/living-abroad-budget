'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  footerClassName?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
  titleClassName = '',
  footerClassName = '',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLElement | null>(null);

  // Handle creating portal element for modal rendering
  useEffect(() => {
    // Find or create portal container
    let portalElement = document.getElementById('modal-root');
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.setAttribute('id', 'modal-root');
      document.body.appendChild(portalElement);
    }
    portalRef.current = portalElement;

    return () => {
      // Only remove the element if we created it and it's empty
      if (portalElement && portalElement.childNodes.length === 0) {
        portalElement.remove();
      }
    };
  }, []);

  // Handle keyboard events (Escape key)
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle clicking outside the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Apply body overflow hidden when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  // Build class names
  const modalClasses = [
    'modal modal-bottom sm:modal-middle',
    isOpen ? 'modal-open' : '',
    className
  ].filter(Boolean).join(' ');

  const modalBoxClasses = [
    'modal-box',
    sizeClasses[size],
    contentClassName
  ].filter(Boolean).join(' ');

  const modalTitleClasses = [
    'font-bold text-lg',
    titleClassName
  ].filter(Boolean).join(' ');

  const modalFooterClasses = [
    'modal-action',
    footerClassName
  ].filter(Boolean).join(' ');

  // If not open or no portal, don't render
  if (!isOpen || !portalRef.current) return null;

  return createPortal(
    <div className={modalClasses} onClick={handleOutsideClick} aria-modal="true" role="dialog">
      <div className={modalBoxClasses} ref={modalRef}>
        {showCloseButton && (
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close modal"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {title && <h3 className={modalTitleClasses}>{title}</h3>}
        <div className="py-4">{children}</div>
        {footer && <div className={modalFooterClasses}>{footer}</div>}
      </div>
    </div>,
    portalRef.current
  );
};

export default Modal; 