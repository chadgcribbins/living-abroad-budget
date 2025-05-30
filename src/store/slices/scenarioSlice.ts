import { StateCreator } from 'zustand'
import { debounce } from 'lodash'
import { RootState } from '../types'
import { 
  Scenario, 
  CreateScenarioInput, 
  UpdateScenarioInput, 
  ScenarioMap,
  ScenarioListItem,
  ScenarioStorageStats,
  ScenarioContent
} from '@/types/scenario'

import {
  createScenario as createScenarioStorage,
  updateScenario as updateScenarioStorage,
  deleteScenario as deleteScenarioStorage,
  listScenarios as listScenariosStorage,
  duplicateScenario as duplicateScenarioStorage,
  getScenarioStorageStats as getScenarioStorageStatsStorage,
  exportScenarios as exportScenariosStorage,
  importScenarios as importScenariosStorage,
  createTemplateScenario as createTemplateScenarioStorage,
  generateScenarioName
} from '@/utils/scenarioStorage'
import { CountryCode } from '@/types/base'

export interface ScenarioState {
  // State
  scenarios: ScenarioMap;
  activeScenarioId: string | null;
  isLoading: boolean;
  error: string | null;
  storageStats: ScenarioStorageStats | null;

  // Derived state
  activeScenario: Scenario | null;
  scenarioList: ScenarioListItem[];

  // Actions
  loadScenarios: () => void;
  setActiveScenarioId: (id: string | null) => void;
  createScenario: (input: CreateScenarioInput) => Promise<string | null>; // Returns new ID on success
  updateScenario: (id: string, updates: UpdateScenarioInput) => Promise<boolean>;
  deleteScenario: (id: string) => Promise<boolean>;
  duplicateScenario: (id: string, newName?: string) => Promise<string | null>; // Returns new ID on success
  exportScenarios: () => Promise<string | null>; // Returns JSON string on success
  importScenarios: (jsonData: string, overwrite?: boolean) => Promise<boolean>;
  createTemplateScenario: (name: string, originCountry: CountryCode, destinationCountry: CountryCode) => Promise<string | null>; // Returns new ID on success
  refreshStorageStats: () => void;
  
  // Auto-save functionality
  scheduleAutoSave: (id: string, updates: UpdateScenarioInput) => void;
  
  // Internal utility methods
  fromActiveScenario: <T extends keyof ScenarioContent>(key: T) => ScenarioContent[T] | undefined;
}

/**
 * This creates a slice of the store for handling budget scenarios
 */
const createScenarioSlice: StateCreator<RootState, [], [], ScenarioState> = (set, get, _api) => {
  console.log('Initializing scenario slice...')
  
  // Create a debounced auto-save function
  const debouncedAutoSave = debounce(
    async (id: string, updates: UpdateScenarioInput) => {
      const result = await updateScenarioStorage(id, updates);
      if (result.success && result.data) {
        set((state) => ({
          ...state,
          scenarios: {
            ...state.scenarios,
            [id]: result.data as Scenario
          },
          error: null
        }));
      } else {
        console.error('Auto-save failed:', result.error);
        set((state) => ({ ...state, error: `Auto-save failed: ${result.error}` }));
      }
    },
    2000, // 2 second delay
    { maxWait: 5000 } // Maximum delay of 5 seconds
  );

  return {
    // State
    scenarios: {},
    activeScenarioId: null,
    isLoading: false,
    error: null,
    storageStats: null,

    // Computed/derived state (getters)
    get activeScenario() {
      const state = get();
      if (!state) return null;
      const scenariosMap = state.scenarios || {};
      const activeId = state.activeScenarioId;
      return activeId ? scenariosMap[activeId] || null : null;
    },

    get scenarioList() {
      const state = get();
      if (!state || !state.scenarios) {
        return [];
      }
      
      const scenariosMap = state.scenarios || {};
      return Object.values(scenariosMap)
        .map(scenario => ({
          id: scenario.id,
          name: scenario.name,
          description: scenario.description,
          createdAt: scenario.createdAt.toISOString(),
          updatedAt: scenario.updatedAt.toISOString(),
          originCountry: scenario.content.originCountry,
          destinationCountry: scenario.content.destinationCountry
        }))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },

    // Actions
    loadScenarios: () => {
      console.log('scenarioSlice: loadScenarios called');
      
      // Start with a properly structured state update that preserves all fields
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        console.log('scenarioSlice: calling listScenariosStorage');
        const result = listScenariosStorage();
        console.log('scenarioSlice: listScenariosStorage result:', result);
        
        if (result.success && result.data) {
          console.log('scenarioSlice: setting scenarios data', Object.keys(result.data).length);
          // Ensure we're setting a valid object even if result.data is undefined
          const scenariosData = result.data || {};
          console.log('scenarioSlice: scenarios data to set:', scenariosData);
          
          // Handle any potential errors in the set operation
          try {
            set(state => ({ 
              ...state,
              scenarios: scenariosData,
              isLoading: false,
              error: null
            }));
            console.log('scenarioSlice: successfully set scenarios data');
            
            // Get storage stats - avoid circular reference
            try {
              const storageStatsResult = getScenarioStorageStatsStorage();
              if (storageStatsResult.success && storageStatsResult.data) {
                set(state => ({ ...state, storageStats: storageStatsResult.data }));
              }
            } catch (statsError) {
              console.error('scenarioSlice: error while getting storage stats:', statsError);
            }
            
          } catch (setError) {
            console.error('scenarioSlice: error while setting scenarios data:', setError);
            set(state => ({ 
              ...state,
              isLoading: false, 
              error: `Error setting scenarios data: ${setError instanceof Error ? setError.message : String(setError)}`
            }));
          }
        } else {
          console.error('scenarioSlice: failed to load scenarios', result.error);
          set(state => ({ ...state, isLoading: false, error: result.error || 'Failed to load scenarios' }));
        }
      } catch (error) {
        console.error('scenarioSlice: error in loadScenarios', error);
        set(state => ({ ...state, isLoading: false, error: `Error loading scenarios: ${error instanceof Error ? error.message : String(error)}` }));
      }
    },

    setActiveScenarioId: (id: string | null) => {
      set(state => ({ ...state, activeScenarioId: id }));
    },

    createScenario: async (input: CreateScenarioInput) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        // Log the input to help debug type issues
        console.log('Input for createScenario:', JSON.stringify(input, null, 2));
        
        // Transform input if needed for type compatibility
        const transformedInput = {
          ...input,
          // Add any transformations needed to make the input compatible with the storage layer
        };
        
        const result = await createScenarioStorage(transformedInput);
        
        if (result.success && result.data) {
          const newScenario = result.data;
          set((state) => ({
            ...state,
            scenarios: {
              ...state.scenarios,
              [newScenario.id]: newScenario
            },
            activeScenarioId: newScenario.id,
            isLoading: false
          }));
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return newScenario.id;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || 'Failed to create scenario' }));
          return null;
        }
      } catch (error) {
        console.error('Error in createScenario:', error);
        set(state => ({ ...state, isLoading: false, error: `Error creating scenario: ${error instanceof Error ? error.message : String(error)}` }));
        return null;
      }
    },

    updateScenario: async (id: string, updates: UpdateScenarioInput) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await updateScenarioStorage(id, updates);
        
        if (result.success && result.data) {
          set((state) => ({
            ...state,
            scenarios: {
              ...state.scenarios,
              [id]: result.data as Scenario
            },
            isLoading: false
          }));
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return true;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || `Failed to update scenario ${id}` }));
          return false;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error updating scenario: ${error instanceof Error ? error.message : String(error)}` }));
        return false;
      }
    },

    deleteScenario: async (id: string) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await deleteScenarioStorage(id);
        
        if (result.success) {
          set((state) => {
            // Create a new scenarios object without the deleted scenario
            const { [id]: deleted, ...remainingScenarios } = state.scenarios as ScenarioMap;
            
            // Reset activeScenarioId if it was the deleted scenario
            const newActiveScenarioId = 
              state.activeScenarioId === id ? null : state.activeScenarioId;
            
            return {
              ...state,
              scenarios: remainingScenarios,
              activeScenarioId: newActiveScenarioId,
              isLoading: false
            };
          });
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return true;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || `Failed to delete scenario ${id}` }));
          return false;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error deleting scenario: ${error instanceof Error ? error.message : String(error)}` }));
        return false;
      }
    },

    duplicateScenario: async (id: string, newName?: string) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await duplicateScenarioStorage(id, newName);
        
        if (result.success && result.data) {
          const newScenario = result.data;
          set((state) => ({
            ...state,
            scenarios: {
              ...state.scenarios,
              [newScenario.id]: newScenario
            },
            isLoading: false
          }));
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return newScenario.id;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || `Failed to duplicate scenario ${id}` }));
          return null;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error duplicating scenario: ${error instanceof Error ? error.message : String(error)}` }));
        return null;
      }
    },

    exportScenarios: async () => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await exportScenariosStorage();
        
        if (result.success && result.data) {
          set(state => ({ ...state, isLoading: false }));
          return result.data;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || 'Failed to export scenarios' }));
          return null;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error exporting scenarios: ${error instanceof Error ? error.message : String(error)}` }));
        return null;
      }
    },

    importScenarios: async (jsonData: string, overwrite = false) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const result = await importScenariosStorage(jsonData, overwrite);
        
        if (result.success && result.data) {
          set((state) => ({
            ...state,
            scenarios: {
              ...state.scenarios,
              ...(result.data as ScenarioMap)
            },
            isLoading: false
          }));
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return true;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || 'Failed to import scenarios' }));
          return false;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error importing scenarios: ${error instanceof Error ? error.message : String(error)}` }));
        return false;
      }
    },

    createTemplateScenario: async (name: string, originCountry: CountryCode, destinationCountry: CountryCode) => {
      set(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const scenarioName = name || generateScenarioName(originCountry, destinationCountry);
        const result = await createTemplateScenarioStorage(scenarioName, originCountry, destinationCountry);
        
        if (result.success && result.data) {
          const newScenario = result.data;
          set((state) => ({
            ...state,
            scenarios: {
              ...state.scenarios,
              [newScenario.id]: newScenario
            },
            activeScenarioId: newScenario.id,
            isLoading: false
          }));
          
          // Update storage stats directly
          try {
            const storageStatsResult = getScenarioStorageStatsStorage();
            if (storageStatsResult.success && storageStatsResult.data) {
              set(state => ({ ...state, storageStats: storageStatsResult.data }));
            }
          } catch (statsError) {
            console.error('Error updating storage stats:', statsError);
          }
          
          return newScenario.id;
        } else {
          set(state => ({ ...state, isLoading: false, error: result.error || 'Failed to create template scenario' }));
          return null;
        }
      } catch (error) {
        set(state => ({ ...state, isLoading: false, error: `Error creating template scenario: ${error instanceof Error ? error.message : String(error)}` }));
        return null;
      }
    },

    refreshStorageStats: () => {
      try {
        const state = get();
        if (!state) {
          console.warn('Cannot refresh storage stats: store not fully initialized');
          return;
        }
        
        const result = getScenarioStorageStatsStorage();
        
        if (result.success && result.data) {
          set(state => ({ ...state, storageStats: result.data }));
        } else {
          console.warn('Failed to get storage stats:', result.error);
        }
      } catch (error) {
        console.error('Error refreshing storage stats:', error);
      }
    },

    scheduleAutoSave: (id: string, updates: UpdateScenarioInput) => {
      // Call the debounced function
      debouncedAutoSave(id, updates);
    },

    // Utility to get values from the active scenario
    fromActiveScenario: <T extends keyof ScenarioContent>(key: T): ScenarioContent[T] | undefined => {
      const state = get();
      const activeScen = state.activeScenario; 
      return activeScen?.content?.[key];
    }
  };
}

export default createScenarioSlice; 