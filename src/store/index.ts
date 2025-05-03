import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { persistMiddleware } from './persistMiddleware'
import { createProfileSlice } from './slices/profileSlice'
import { RootState } from './types'
import { StoreApi } from 'zustand'

// Import other slice creators
// These will be created as needed for each domain
// import { createIncomeSlice } from './slices/incomeSlice'
// import { createHousingSlice } from './slices/housingSlice'
// etc.

/**
 * Create the store with all slices combined and middleware applied
 * Each slice manages its own part of the global state
 */
export const useStore = create<RootState>()(
  devtools(
    persistMiddleware(
      // @ts-expect-error - We need to fix the typing of our store slices in a future task
      (set, get, api: StoreApi<RootState>) => ({
        // Profile slice
        ...createProfileSlice(set, get, api),
        
        // Placeholder implementations for other slices
        // These will be replaced with proper implementations as we build them
        income: {
          incomeSources: [],
          primaryCurrency: 'USD',
          totalIncome: null,
          addIncomeSource: () => {},
          updateIncomeSource: () => {},
          removeIncomeSource: () => {},
          setPrimaryCurrency: () => {}
        },
        housing: {
          selectedType: null,
          expenses: null,
          setHousingType: () => {},
          updateHousingExpenses: () => {},
          addInsurancePolicy: () => {},
          removeInsurancePolicy: () => {},
          addUtilityExpense: () => {},
          removeUtilityExpense: () => {}
        },
        education: {
          expenses: {},
          setInstitutionType: () => {},
          setProgramType: () => {},
          updateEducationExpense: () => {},
          removeEducationExpense: () => {}
        },
        healthcare: {
          selectedType: null,
          expenses: {},
          setHealthcareType: () => {},
          updateHealthcareExpense: () => {},
          removeHealthcareExpense: () => {}
        },
        transportation: {
          selectedType: null,
          expenses: null,
          setTransportType: () => {},
          updateTransportExpense: () => {}
        },
        lifestyle: {
          expenses: [],
          addLifestyleExpense: () => {},
          updateLifestyleExpense: () => {},
          removeLifestyleExpense: () => {}
        },
        utilities: {
          expenses: null,
          updateUtilityExpense: () => {}
        },
        emergency: {
          fund: null,
          updateEmergencyFund: () => {}
        },
        fx: {
          settings: null,
          rates: [],
          updateFXSettings: () => {},
          addExchangeRate: () => {},
          updateExchangeRate: () => {}
        },
        scenarios: {
          scenarios: {},
          activeScenarioId: null,
          createScenario: () => {},
          updateScenario: () => {},
          deleteScenario: () => {},
          setActiveScenario: () => {},
          duplicateScenario: () => {}
        },
        ui: {
          activeView: 'dashboard',
          sidebarOpen: true,
          theme: 'system',
          setActiveView: () => {},
          toggleSidebar: () => {},
          setTheme: () => {}
        }
      })
    ),
    {
      name: 'living-abroad-budget-store',
    }
  )
)

// Export types for use in components
export * from './types'

// Export hooks for accessing state in components
export * from './hooks' 