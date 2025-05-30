'use client';

import React from 'react';
import { useStore } from '@/store';
import { useHousehold, useNavigation, useUIState } from '@/store/hooks';
import { useAppNavigation } from '@/hooks';

/**
 * Test component to diagnose store initialization issues
 */
const TestComponent: React.FC = () => {
  // Direct store access
  const storeState = useStore(state => state);
  
  // Hooks access
  const { activeView, sidebarOpen } = useNavigation();
  const household = useHousehold();
  const ui = useUIState();
  
  // App navigation
  const appNav = useAppNavigation();
  
  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Store Diagnosis</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold">Direct Store Access:</h3>
          <pre className="bg-base-300 p-2 rounded overflow-auto text-xs">
            {JSON.stringify({
              profileExists: !!storeState.profile,
              householdExists: !!storeState.profile?.household,
              uiExists: !!storeState.ui,
              activeViewExists: !!storeState.ui?.activeView,
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-bold">useNavigation Hook:</h3>
          <pre className="bg-base-300 p-2 rounded overflow-auto text-xs">
            {JSON.stringify({ activeView, sidebarOpen }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-bold">useHousehold Hook:</h3>
          <pre className="bg-base-300 p-2 rounded overflow-auto text-xs">
            {JSON.stringify({
              exists: !!household,
              membersCount: household?.members?.length || 0
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-bold">useAppNavigation Hook:</h3>
          <pre className="bg-base-300 p-2 rounded overflow-auto text-xs">
            {JSON.stringify({
              currentRoute: appNav.currentRoute,
              currentSection: appNav.currentSection,
              activeView: appNav.activeView,
              sidebarOpen: appNav.sidebarOpen
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestComponent; 