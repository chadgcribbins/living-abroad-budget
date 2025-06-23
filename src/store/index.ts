import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { RootState } from './types'
import createProfileSlice from './slices/profileSlice'
import createScenarioSlice from './slices/scenarioSlice'
import { createFXSlice } from './slices/fxSlice'
import { createUISlice } from './slices/uiSlice'
import createIncomeSlice from './slices/incomeSlice'

/**
 * Clean store with only the working features for PRD-v7:
 * - Profile & household management ✅
 * - Scenario creation & comparison ✅ (primary feature)
 * - FX for multi-currency support ✅
 * - UI state management ✅
 * - Income module ✅ (First Phase 2 module)
 * 
 * Removed unused placeholder slices:
 * - Housing, Education, Healthcare, Transportation, Lifestyle, Utilities, Emergency
 * These will be added back properly when implemented for real
 */
export const useStore = create<RootState>()(
  devtools(
    persist(
      (set, get, api): RootState => {
        // Clean store creation for PRD-v7 core features
        
        // Create the working slices
        const profileSlice = createProfileSlice(set, get, api);
        const scenarioSlice = createScenarioSlice(set, get, api);
        const fxSlice = createFXSlice(set, get, api);
        const uiSlice = createUISlice(set, get, api);
        const incomeSlice = createIncomeSlice(set, get, api);
        
        // Return only the working features
        return {
          // Profile management
          profile: profileSlice,
          
          // Scenario management (core PRD-v7 feature)
          scenarios: scenarioSlice.scenarios,
          activeScenarioId: scenarioSlice.activeScenarioId,
          isLoading: scenarioSlice.isLoading,
          error: scenarioSlice.error,
          storageStats: scenarioSlice.storageStats,
          activeScenario: scenarioSlice.activeScenario,
          scenarioList: scenarioSlice.scenarioList,
          loadScenarios: scenarioSlice.loadScenarios,
          setActiveScenarioId: scenarioSlice.setActiveScenarioId,
          createScenario: scenarioSlice.createScenario,
          updateScenario: scenarioSlice.updateScenario,
          deleteScenario: scenarioSlice.deleteScenario,
          duplicateScenario: scenarioSlice.duplicateScenario,
          exportScenarios: scenarioSlice.exportScenarios,
          importScenarios: scenarioSlice.importScenarios,
          createTemplateScenario: scenarioSlice.createTemplateScenario,
          refreshStorageStats: scenarioSlice.refreshStorageStats,
          scheduleAutoSave: scenarioSlice.scheduleAutoSave,
          fromActiveScenario: scenarioSlice.fromActiveScenario,
          
          // FX management
          fx: fxSlice,
          
          // Income management (Phase 2 implementation)
          income: incomeSlice,
          
          // UI management
          ui: uiSlice.ui,
        };
      },
      {
        name: 'living-abroad-budget-store',
        // Clean persistence - no complex custom implementation
        onRehydrateStorage: () => {
          // Hydration handler
          return (state, error) => {
            if (error) {
              console.error('[store] Hydration error:', error);
            } else {
              // Hydration complete
              // Set hydration flag on client
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  if (state?.profile?.setHydrated) {
                    state.profile.setHydrated();
                  }
                }, 0);
              }
            }
          };
        },
      }
    ),
    {
      name: 'living-abroad-budget-devtools',
    }
  )
);

// Export types for components
export type { RootState } from './types'
export * from './types' 