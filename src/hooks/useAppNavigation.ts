'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '@/store/hooks';
import { useMemo } from 'react';

// Type for application routes to ensure type safety
export type AppRoutes = 
  | "/"
  | "/dashboard" 
  | "/profile"
  | "/scenarios"
  | "/scenarios/create"
  | `/scenarios/${string}`;

export interface NavigationHistory {
  previousRoute?: string;
  currentRoute: string;
  routeParams?: Record<string, string>;
}

/**
 * Enhanced navigation hook that provides additional functionality
 * beyond the Next.js router
 */
export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeView, setActiveView, sidebarOpen, toggleSidebar } = useNavigation();
  
  // Extract route parameters from the pathname
  const routeParams = useMemo(() => {
    const params: Record<string, string> = {};
    
    // Extract scenario ID
    if (pathname?.startsWith('/scenarios/') && pathname !== '/scenarios/create') {
      const id = pathname.split('/').pop();
      if (id) params.scenarioId = id;
    }
    
    return params;
  }, [pathname]);
  
  // Extract current section (first part of the path)
  const currentSection = useMemo(() => {
    if (!pathname) return 'home';
    const section = pathname.split('/')[1] || 'home';
    return section;
  }, [pathname]);
  
  // Navigate to a typesafe route
  const navigateTo = (route: AppRoutes) => {
    router.push(route);
  };
  
  // Go back in navigation history
  const goBack = () => {
    router.back();
  };
  
  return {
    // From useNavigation
    activeView,
    setActiveView,
    sidebarOpen,
    toggleSidebar,
    
    // Enhanced navigation
    currentRoute: pathname || '/',
    currentSection,
    routeParams,
    navigateTo,
    goBack,
  };
} 