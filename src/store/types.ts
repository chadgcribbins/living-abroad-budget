import { 
  CountryCode,
  CurrencyCode,
  Money,
  Identifiable, 
  Timestamped
} from '@/types/base'

import { 
  HousingType, 
  HousingExpense,
  InsurancePolicy,
  UtilityExpense
} from '@/types/housing'

import { 
  IncomeSource, 
  EmploymentType,
  PassiveIncomeType,
  EmploymentIncome,
  PassiveIncome
} from '@/types/income'

import { 
  EducationExpense,
  InstitutionType,
  ProgramType
} from '@/types/education'

import { 
  TransportExpense,
  TransportType
} from '@/types/transport'

import { 
  HealthcareExpense
} from '@/types/healthcare'

import { 
  LifestyleExpense 
} from '@/types/lifestyle'

import { 
  UtilityExpense as UtilitiesExpense, 
  UtilityServiceType
} from '@/types/utilities'

import { 
  EmergencyFund 
} from '@/types/emergency'

import {
  ExchangeRate
} from '@/types/fx'

import {
  Household,
  HouseholdMember,
  HouseholdRelationship
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
 */
export interface FXSettings {
  baseCurrency: CurrencyCode;
  displayCurrency: CurrencyCode;
  manualRates: boolean;
  customRates: Record<string, number>;
  sensitivityRange: [number, number];
}

/**
 * State for the profile/household slice
 */
export interface ProfileState {
  household: Household | null;
  isComplete: boolean;
  activeCountry: CountryCode | null;
  setHousehold: (household: Household) => void;
  updateHousehold: (updates: Partial<Household>) => void;
  clearHousehold: () => void;
  setActiveCountry: (country: CountryCode) => void;
}

/**
 * State for the income slice
 */
export interface IncomeState {
  incomeSources: IncomeSource[];
  primaryCurrency: CurrencyCode;
  totalIncome: Money | null;
  addIncomeSource: (source: IncomeSource) => void;
  updateIncomeSource: (id: string, updates: Partial<IncomeSource>) => void;
  removeIncomeSource: (id: string) => void;
  setPrimaryCurrency: (currency: CurrencyCode) => void;
}

/**
 * State for the housing slice
 */
export interface HousingState {
  selectedType: HousingType | null;
  expenses: HousingExpense | null;
  setHousingType: (type: HousingType) => void;
  updateHousingExpenses: (expenses: Partial<HousingExpense>) => void;
  addInsurancePolicy: (policy: InsurancePolicy) => void;
  removeInsurancePolicy: (id: string) => void;
  addUtilityExpense: (utility: UtilityExpense) => void;
  removeUtilityExpense: (id: string) => void;
}

/**
 * State for the education slice
 */
export interface EducationState {
  expenses: Record<string, EducationExpense>; // keyed by household member ID
  setInstitutionType: (memberId: string, type: InstitutionType) => void;
  setProgramType: (memberId: string, type: ProgramType) => void;
  updateEducationExpense: (memberId: string, expense: Partial<EducationExpense>) => void;
  removeEducationExpense: (memberId: string) => void;
}

/**
 * Healthcare types enum (not imported from types file)
 */
export enum HealthcareType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  HYBRID = 'HYBRID',
  TRAVEL_INSURANCE = 'TRAVEL_INSURANCE'
}

/**
 * State for the healthcare slice
 */
export interface HealthcareState {
  selectedType: HealthcareType | null;
  expenses: Record<string, HealthcareExpense>; // keyed by household member ID
  setHealthcareType: (type: HealthcareType) => void;
  updateHealthcareExpense: (memberId: string, expense: Partial<HealthcareExpense>) => void;
  removeHealthcareExpense: (memberId: string) => void;
}

/**
 * State for the transportation slice
 */
export interface TransportationState {
  selectedType: TransportType | null;
  expenses: TransportExpense | null;
  setTransportType: (type: TransportType) => void;
  updateTransportExpense: (expense: Partial<TransportExpense>) => void;
}

/**
 * State for the lifestyle and discretionary expenses slice
 */
export interface LifestyleState {
  expenses: LifestyleExpense[] | null;
  addLifestyleExpense: (expense: LifestyleExpense) => void;
  updateLifestyleExpense: (id: string, expense: Partial<LifestyleExpense>) => void;
  removeLifestyleExpense: (id: string) => void;
}

/**
 * State for the utilities slice
 */
export interface UtilitiesState {
  expenses: Record<UtilityServiceType, UtilitiesExpense> | null;
  updateUtilityExpense: (type: UtilityServiceType, expense: Partial<UtilitiesExpense>) => void;
}

/**
 * State for the emergency fund calculator slice
 */
export interface EmergencyState {
  fund: EmergencyFund | null;
  updateEmergencyFund: (fund: Partial<EmergencyFund>) => void;
}

/**
 * State for the FX sensitivity analysis slice
 */
export interface FXState {
  settings: FXSettings | null;
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
 * State for the UI slice (controls UI-specific state that doesn't need to be persisted)
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
 * State for managing scenarios
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
 * Root state of the application, combining all slices.
 * ScenarioState properties are merged directly into RootState.
 */
export interface RootState extends Omit<ScenarioState, 'scenarios' | 'activeScenario' | 'scenarioList'> { // Omit derived/map to avoid conflict if we name map 'scenarios'
  profile: ProfileState;
  income: IncomeState;
  housing: HousingState;
  education: EducationState;
  healthcare: HealthcareState;
  transportation: TransportationState;
  lifestyle: LifestyleState;
  utilities: UtilitiesState;
  emergency: EmergencyState;
  fx: FXState;
  scenarios: ScenarioMap; // Explicitly define the scenarios map property
  activeScenario: Scenario | null; // Add activeScenario to RootState
  scenarioList: ScenarioListItem[]; // Add scenarioList to RootState
  ui: UIState;
} 