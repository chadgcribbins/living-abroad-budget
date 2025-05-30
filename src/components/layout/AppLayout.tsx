'use client';

import React from 'react';
import { Sidebar } from '@/components/layout';
import { useNavigation } from '@/store/hooks';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout component that includes the sidebar
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useNavigation();

  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar />
      
      {/* Main content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 