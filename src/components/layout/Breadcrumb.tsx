'use client';

import React from 'react';
import Link from 'next/link';
import { useAppNavigation } from '@/hooks';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  hideOnMobile?: boolean;
}

/**
 * Breadcrumb component for navigation trails and wizard steps
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '',
  hideOnMobile = false,
}) => {
  // Using useAppNavigation for future enhancements
  useAppNavigation();

  if (items.length === 0) return null;

  return (
    <div className={`${hideOnMobile ? 'hidden md:block' : ''} ${className}`}>
      <div className="text-sm breadcrumbs">
        <ul>
          {items.map((item, index) => {
            // Different styling based on status
            const getItemClasses = () => {
              let classes = '';
              
              if (item.active) classes += ' font-semibold text-primary';
              if (item.disabled) classes += ' opacity-50 cursor-not-allowed';
              
              return classes;
            };
            
            // If the item has an onClick handler and is not disabled
            if (item.onClick && !item.disabled) {
              return (
                <li key={index}>
                  <button 
                    onClick={item.onClick}
                    className={`hover:underline ${getItemClasses()}`}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }
            
            // If the item has a href and is not disabled
            if (item.href && !item.disabled) {
              return (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className={`hover:underline ${getItemClasses()}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            
            // Otherwise, it's just text (last item or disabled)
            return (
              <li key={index} className={getItemClasses()}>
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb; 