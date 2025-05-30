import React from 'react';

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const PageContainer = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  containerClassName = '',
  headerClassName = '',
  contentClassName = '',
  fullWidth = false,
  noPadding = false,
}: PageContainerProps) => {
  // Building classes
  const containerClasses = [
    'bg-base-100 min-h-screen',
    className
  ].filter(Boolean).join(' ');

  const innerContainerClasses = [
    fullWidth ? 'w-full' : 'container mx-auto',
    !noPadding ? 'px-4 md:px-6' : '',
    containerClassName
  ].filter(Boolean).join(' ');

  const headerClasses = [
    'py-6 flex flex-col md:flex-row md:items-center md:justify-between',
    'border-b border-base-300 mb-6',
    headerClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'pb-8',
    contentClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={innerContainerClasses}>
        {(title || subtitle || actions) && (
          <header className={headerClasses}>
            <div>
              {title && <h1 className="text-2xl font-bold">{title}</h1>}
              {subtitle && <p className="text-base-content/70 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="mt-4 md:mt-0">{actions}</div>}
          </header>
        )}
        <main className={contentClasses}>{children}</main>
      </div>
    </div>
  );
};

export default PageContainer; 