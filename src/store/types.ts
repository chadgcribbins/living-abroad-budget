import { 
  CountryCode,
  CurrencyCode,
} from '@/types/base'

import {
  ExchangeRate
} from '@/types/fx'

import {
  Household,
  HouseholdMember
} from '@/types/household'

import {
  Scenario,
  CreateScenarioInput,
  UpdateScenarioInput,
  ScenarioMap,
  ScenarioListItem,
  ScenarioStorageStats,
  ScenarioContent
} from '@/types/scenario'

// Re-export Scenario and related types that might be needed externally
export type { 
  Scenario, 
  CreateScenarioInput, 
  UpdateScenarioInput, 
  ScenarioMap, 
  ScenarioListItem, 
  ScenarioStorageStats,
  ScenarioContent 
} from '@/types/scenario';

/**
 * FX settings for currency conversion and sensitivity analysis
 * Essential for PRD-v7 multi-currency support
 */
export interface FXSettings {
  baseCurrency: CurrencyCode;
  displayCurrency: CurrencyCode;
  manualRates: boolean;
  customRates: Record<string, number>;
  sensitivityRange: [number, number];
}

// Define ExchangeRates type
export type ExchangeRates = Record<CurrencyCode, number>; // e.g. { EUR: 0.9, GBP: 0.8 } (against base)

/**
 * State for the profile/household slice
 * Core for PRD-v7 family composition and country management
 */
export interface ProfileState {
  household: Household | null;
  isComplete: boolean;
  activeCountry: CountryCode | null;
  isHydrated: boolean;
  setHousehold: (household: Household) => void;
  updateHousehold: (updates: Partial<Household>) => void;
  updateHouseholdMembers: (members: HouseholdMember[]) => void;
  clearHousehold: () => void;
  setActiveCountry: (country: CountryCode) => void;
  setHydrated: () => void;
}

/**
 * State for the FX slice
 * Essential for PRD-v7 currency conversion and analysis
 */
export interface FXState {
  settings: FXSettings;
  rates: Record<string, number>;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  loadInitialFXData: () => Promise<void>;
  updateFXSettings: (settings: Partial<FXSettings>) => void;
  addExchangeRate: (rate: ExchangeRate) => void;
  updateExchangeRate: (currencyCodeToUpdate: string, newRate: Partial<{ rate: number }>) => void;
  getExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => ExchangeRate | null;
  convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => number | null;
}

/**
 * State for the UI slice
 * Basic UI state management for navigation and theming
 */
export interface UIState {
  activeView: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setActiveView: (view: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * State for the scenario slice
 * Core feature for PRD-v7 scenario creation and comparison
 */
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
 * Clean RootState with only the working features
 * Removed: income, housing, education, healthcare, transportation, lifestyle, utilities, emergency
 * These will be added back properly when implemented for real
 */
export interface RootState extends Omit<ScenarioState, 'scenarios' | 'activeScenario' | 'scenarioList'> {
  profile: ProfileState;
  fx: FXState;
  scenarios: ScenarioMap; // Explicitly define the scenarios map property
  activeScenario: Scenario | null; // Add activeScenario to RootState
  scenarioList: ScenarioListItem[]; // Add scenarioList to RootState
  ui: UIState;
} 