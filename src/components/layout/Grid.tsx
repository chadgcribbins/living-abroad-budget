'use client';

import React from 'react';

export interface GridProps {
  children: React.ReactNode;
  cols?: number;
  gap?: number;
  rowGap?: number;
  colGap?: number;
  className?: string;
}

export interface GridItemProps {
  children: React.ReactNode;
  span?: number | {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

export const Grid = ({
  children,
  cols = 12,
  gap,
  rowGap,
  colGap,
  className = '',
}: GridProps) => {
  // Calculate grid template columns
  const gridCols = `grid-cols-${cols}`;
  
  // Calculate gaps
  const gapClasses = [];
  if (gap !== undefined) gapClasses.push(`gap-${gap}`);
  if (rowGap !== undefined) gapClasses.push(`row-gap-${rowGap}`);
  if (colGap !== undefined) gapClasses.push(`col-gap-${colGap}`);
  
  const combinedClasses = [
    'grid',
    gridCols,
    ...gapClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export const GridItem = ({ children, span = 1, className = '' }: GridItemProps) => {
  // Handle responsive spans
  let spanClasses = '';
  
  if (typeof span === 'object') {
    const classes = [];
    
    // Default (xs) span - mobile first
    classes.push(`col-span-${span.sm || 'full'}`);
    
    // Responsive spans
    if (span.sm) classes.push(`sm:col-span-${span.sm}`);
    if (span.md) classes.push(`md:col-span-${span.md}`);
    if (span.lg) classes.push(`lg:col-span-${span.lg}`);
    if (span.xl) classes.push(`xl:col-span-${span.xl}`);
    
    spanClasses = classes.join(' ');
  } else {
    // Simple span
    spanClasses = `col-span-${span}`;
  }
  
  const combinedClasses = [
    spanClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

// Export a composed object with renamed components
const GridComponents = {
  Container: Grid,
  Item: GridItem,
  Row: Grid,
  Col: GridItem
};

export default GridComponents; 