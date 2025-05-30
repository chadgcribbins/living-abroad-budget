import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { RootState, IncomeState, HousingState, EducationState, HealthcareState, TransportationState, LifestyleState, UtilitiesState, EmergencyState } from './types'
import createProfileSlice from './slices/profileSlice'
import createScenarioSlice from './slices/scenarioSlice'
import { createFXSlice } from './slices/fxSlice'
import { createUISlice } from './slices/uiSlice'

// Import other slice creators
// These will be created as needed for each domain
// import { createIncomeSlice } from './slices/incomeSlice'
// import { createHousingSlice } from './slices/housingSlice'
// etc.

/**
 * Create the store with all slices
 */
export const useStore = create<RootState>()(
  devtools(
    persist(
      (set, get, api): RootState => {
        console.log('Creating Zustand store...');
        
        // Create slice instances
        const scenarioSliceInstance = createScenarioSlice(set, get, api);
        const profileSliceInstance = createProfileSlice(set, get, api);
        
        console.log('[store/index.ts] Creating fxSlice instance...');
        const fxSliceInstance = createFXSlice(set, get, api);

        console.log('[store/index.ts] Creating uiSlice instance...');
        const uiSliceFull = createUISlice(set, get, api);

        // TODO: Create instances for other slices (income, housing, etc.)

        // Explicitly construct the RootState object
        const rootStateResult: RootState = {
          // --- Profile Slice --- 
          profile: profileSliceInstance,

          // --- Scenario Slice (Flattened) --- 
          scenarios: scenarioSliceInstance.scenarios,
          activeScenarioId: scenarioSliceInstance.activeScenarioId,
          isLoading: scenarioSliceInstance.isLoading,
          error: scenarioSliceInstance.error,
          storageStats: scenarioSliceInstance.storageStats,
          activeScenario: scenarioSliceInstance.activeScenario,
          scenarioList: scenarioSliceInstance.scenarioList,
          loadScenarios: scenarioSliceInstance.loadScenarios,
          setActiveScenarioId: scenarioSliceInstance.setActiveScenarioId,
          createScenario: scenarioSliceInstance.createScenario,
          updateScenario: scenarioSliceInstance.updateScenario,
          deleteScenario: scenarioSliceInstance.deleteScenario,
          duplicateScenario: scenarioSliceInstance.duplicateScenario,
          exportScenarios: scenarioSliceInstance.exportScenarios,
          importScenarios: scenarioSliceInstance.importScenarios,
          createTemplateScenario: scenarioSliceInstance.createTemplateScenario,
          refreshStorageStats: scenarioSliceInstance.refreshStorageStats,
          scheduleAutoSave: scenarioSliceInstance.scheduleAutoSave,
          fromActiveScenario: scenarioSliceInstance.fromActiveScenario,
          
          // --- UI Slice --- 
          ui: uiSliceFull.ui,
          
          // --- Other Slices (Placeholders - Replace with actual instances or defaults) ---
          income: {} as IncomeState, 
          housing: {} as HousingState,
          education: {} as EducationState,
          healthcare: {} as HealthcareState,
          transportation: {} as TransportationState,
          lifestyle: {} as LifestyleState,
          utilities: {} as UtilitiesState,
          emergency: {} as EmergencyState,
          fx: fxSliceInstance, 
        };

        return rootStateResult;
      },
      {
        name: 'living-abroad-budget',
        partialize: (state) => ({
          profile: state.profile,
          scenarios: state.scenarios,
          activeScenarioId: state.activeScenarioId,
          ui: state.ui,
          income: state.income,
          housing: state.housing,
          education: state.education,
          healthcare: state.healthcare,
          transportation: state.transportation,
          lifestyle: state.lifestyle,
          utilities: state.utilities,
          emergency: state.emergency,
        }),
      }
    )
  )
)

// Export types for use in components
export * from './types'

// Export hooks for accessing state in components
export * from './hooks' 