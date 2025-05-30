'use client';

'use client';

import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'boxed' | 'lifted' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

const Tabs = ({
  tabs,
  defaultActiveTab,
  onChange,
  variant = 'bordered',
  size = 'md',
  className = '',
  tabsClassName = '',
  contentClassName = '',
}: TabsProps) => {
  // Set the active tab to defaultActiveTab if provided, otherwise use the first tab
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : '')
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Build class names
  const containerClasses = [
    'tab-container',
    className
  ].filter(Boolean).join(' ');

  const tabsClasses = [
    'tabs',
    `tabs-${variant}`,
    size !== 'md' ? `tabs-${size}` : '',
    tabsClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'tab-content p-4',
    contentClassName
  ].filter(Boolean).join(' ');

  // Find the active tab's content
  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={containerClasses}>
      <div className={tabsClasses}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            className={`tab ${tab.id === activeTab ? 'tab-active' : ''} ${
              tab.disabled ? 'tab-disabled' : ''
            }`}
            disabled={tab.disabled}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div 
        className={contentClasses}
      >
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs; 