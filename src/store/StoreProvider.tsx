'use client';

import React, { ReactNode, useEffect } from 'react';
import { useStore } from './index';
// Removed unused Household and CountryCode imports as they are not directly used in this simplified provider
// import { Household } from '@/types/household';
// import { CountryCode } from '@/types/base';

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Provider component that ensures Zustand store is initialized properly
 * and only runs on the client side
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Force initialization of the store on the client by calling useStore()
  // This subscribes the component to store changes and ensures the store instance is created.
  useStore(); 
  
  useEffect(() => {
    console.log('StoreProvider: useEffect running. Attempting to load scenarios.');
    
    const { loadScenarios } = useStore.getState();

    if (typeof loadScenarios === 'function') {
      loadScenarios();
    } else {
      console.warn('StoreProvider: loadScenarios function is not available on the store during initial mount.');
    }

    // Log the initial state after setup
    console.log('StoreProvider: Initial store state after setup attempt', useStore.getState());
  }, []); // Runs once on mount

  return <>{children}</>;
} 