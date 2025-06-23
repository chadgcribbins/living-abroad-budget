import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { RootState } from './types'
import { StoreApi } from 'zustand'

const STORAGE_KEY = 'living-abroad-budget-store'
const STORAGE_VERSION = 1

/**
 * Custom storage implementation with version handling
 */
const versionedStorage: StateStorage = {
  getItem: (name) => {
    const storedData = localStorage.getItem(name)
    
    if (!storedData) return null
    
    try {
      const { state, version } = JSON.parse(storedData)
      
      // Handle version upgrades here
      if (version < STORAGE_VERSION) {
        console.info(`Migrating store from version ${version} to ${STORAGE_VERSION}`)
        // Perform version-specific migrations here
        // Example: if (version === 1) { state.newProp = defaultValue }
      }
      
      return JSON.stringify(state)
    } catch (e) {
      console.error('Error parsing stored state', e)
      return null
    }
  },
  
  setItem: (name, value) => {
    try {
      const state = JSON.parse(value)
      const versionedState = {
        state,
        version: STORAGE_VERSION
      }
      localStorage.setItem(name, JSON.stringify(versionedState))
    } catch (e) {
      console.error('Error storing state', e)
    }
  },
  
  removeItem: (name) => {
    localStorage.removeItem(name)
  }
}

/**
 * Configure which parts of the state should be persisted
 * Typically we don't persist:
 * 1. Transient UI state (theme can be persisted)
 * 2. Derived computed values that can be recalculated
 * 3. Any sensitive data
 */
const persistConfig = {
  name: STORAGE_KEY,
  storage: createJSONStorage(() => versionedStorage),
  partialize: (state: RootState) => ({
    profile: {
      household: state.profile.household,
      activeCountry: state.profile.activeCountry,
      // Don't persist the isComplete flag - recalculate it
    },
    income: {
      incomeSources: state.income.incomeSources,
      primaryCurrency: state.income.primaryCurrency,
      // Don't persist the totalIncome - recalculate it
    },
    housing: {
      selectedType: state.housing.selectedType,
      expenses: state.housing.expenses,
    },
    education: {
      expenses: state.education.expenses,
    },
    healthcare: {
      selectedType: state.healthcare.selectedType,
      expenses: state.healthcare.expenses,
    },
    transportation: {
      selectedType: state.transportation.selectedType,
      expenses: state.transportation.expenses,
    },
    lifestyle: {
      expenses: state.lifestyle.expenses,
    },
    utilities: {
      expenses: state.utilities.expenses,
    },
    emergency: {
      fund: state.emergency.fund,
    },
    fx: {
      settings: state.fx.settings,
      rates: state.fx.rates,
    },
    scenarios: {
      scenarios: state.scenarios.scenarios,
      activeScenarioId: state.scenarios.activeScenarioId,
    },
    ui: {
      // Only persist theme preference
      theme: state.ui.theme,
    }
  }),
  // Do not persist the store on first hydration if it wasn't yet written
  skipHydration: true,
  // Run migration or validation on hydration if needed
  onRehydrateStorage: () => (state?: RootState, error?: unknown) => {
    if (state) {
      console.info('State hydrated from localStorage')
    } else if (error) {
      console.error('Failed to hydrate state:', error)
    }
  }
}

// Define the initializer type
type StoreInitializer = (
  set: (state: Partial<RootState>) => void,
  get: () => RootState,
  api: StoreApi<RootState>
) => RootState;

export const persistMiddleware = (initializer: StoreInitializer) => 
  persist(initializer, persistConfig) 