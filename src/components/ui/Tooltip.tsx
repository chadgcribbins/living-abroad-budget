'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipColor = 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  color?: TooltipColor;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
  delay?: number; // Delay before showing tooltip in ms
  disabled?: boolean;
}

const Tooltip = ({
  children,
  content,
  position = 'top',
  color = 'default',
  className = '',
  contentClassName = '',
  showArrow = true,
  delay = 300,
  disabled = false,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Position classes
  const positionClasses = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right',
  };

  // Color classes
  const colorClasses = {
    default: '',
    primary: 'tooltip-primary',
    secondary: 'tooltip-secondary',
    accent: 'tooltip-accent',
    info: 'tooltip-info',
    success: 'tooltip-success',
    warning: 'tooltip-warning',
    error: 'tooltip-error',
  };

  // Combine classes
  const tooltipClasses = [
    'tooltip',
    positionClasses[position],
    colorClasses[color],
    showArrow ? '' : 'tooltip-no-arrow',
    className
  ].filter(Boolean).join(' ');

  const tooltipContentClasses = [
    'tooltip-content',
    contentClassName
  ].filter(Boolean).join(' ');

  // Wrap updateTooltipPosition in useCallback to prevent recreating the function on every render
  const updateTooltipPosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    
    // Get trigger and viewport dimensions
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate positions for each placement
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 8;
        break;
    }
    
    // Adjust to ensure tooltip stays within viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }
    
    // Update position
    setTooltipStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 50,
    });
  }, [position]);

  // Handle mouse enter event
  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Wait for next render cycle to ensure tooltip is in DOM
      setTimeout(updateTooltipPosition, 0);
    }, delay);
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  // Add resize and scroll listeners
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition, true);
      updateTooltipPosition();
    }

    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [isVisible, updateTooltipPosition]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={triggerRef} 
        className={tooltipClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef} 
          role="tooltip"
          className={tooltipContentClasses}
          style={tooltipStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip; 