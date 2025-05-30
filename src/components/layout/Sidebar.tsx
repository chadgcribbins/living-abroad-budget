'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppNavigation } from '@/hooks';

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ScenarioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

const navigationItems = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
  { path: '/scenarios', label: 'Scenarios', icon: <ScenarioIcon /> },
];

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { sidebarOpen, toggleSidebar, setActiveView, currentRoute, currentSection } = useAppNavigation();
  
  // Update active view based on currentSection
  useEffect(() => {
    if (setActiveView && typeof setActiveView === 'function') {
      setActiveView(currentSection);
    }
  }, [currentSection, setActiveView]);

  return (
    <div 
      className={`h-screen bg-base-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${className} fixed left-0 top-0 z-10 flex flex-col shadow-lg`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen ? (
          <Link href="/" className="text-xl font-bold">
            Living Abroad
          </Link>
        ) : (
          <Link href="/" className="text-xl font-bold">
            LAB
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>

      <nav className="mt-5 flex-1 px-2">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentRoute === item.path || 
              (item.path !== '/' && currentRoute?.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center rounded-lg p-2 text-base font-normal transition duration-150 ease-in-out hover:bg-base-300 ${
                    isActive ? 'bg-primary text-primary-content' : 'text-base-content'
                  }`}
                >
                  <span className="min-w-[24px]">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4">
        {sidebarOpen && (
          <div className="text-xs text-base-content/70">
            <p>Living Abroad Budget v0.1</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 