'use client';

import React from 'react';

export type CardVariant = 'default' | 'bordered' | 'shadow' | 'compact' | 'glass';

export interface CardProps {
  variant?: CardVariant;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  footerClassName?: string;
  children: React.ReactNode;
}

const Card = ({
  variant = 'default',
  title,
  subtitle,
  footer,
  headerAction,
  className = '',
  bodyClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  footerClassName = '',
  children,
}: CardProps) => {
  // Build variant-specific classes
  const variantClasses = {
    default: 'card bg-base-100',
    bordered: 'card bg-base-100 border border-base-300',
    shadow: 'card bg-base-100 shadow-lg',
    compact: 'card card-compact bg-base-100',
    glass: 'card glass',
  };

  const cardClass = [
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  const bodyClass = [
    'card-body',
    bodyClassName
  ].filter(Boolean).join(' ');

  const titleClass = [
    'card-title',
    titleClassName
  ].filter(Boolean).join(' ');

  const subtitleClass = [
    'text-sm text-base-content/70',
    subtitleClassName
  ].filter(Boolean).join(' ');

  const footerClass = [
    'card-actions justify-end mt-4',
    footerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className={bodyClass}>
        {title && (
          <div className="flex justify-between items-center">
            <h2 className={titleClass}>{title}</h2>
            {headerAction && <div>{headerAction}</div>}
          </div>
        )}
        {subtitle && <p className={subtitleClass}>{subtitle}</p>}
        <div className="mt-2">{children}</div>
        {footer && <div className={footerClass}>{footer}</div>}
      </div>
    </div>
  );
};

export default Card; 