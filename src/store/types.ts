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
  UtilityExpense as UtilitiesExpense
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
 * Utility type enum (not imported from types file)
 */
export enum UtilityType {
  ELECTRICITY = 'ELECTRICITY',
  GAS = 'GAS',
  WATER = 'WATER',
  INTERNET = 'INTERNET',
  TV = 'TV',
  PHONE = 'PHONE',
  TRASH = 'TRASH',
  OTHER = 'OTHER'
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
  expenses: Record<UtilityType, UtilitiesExpense> | null;
  updateUtilityExpense: (type: UtilityType, expense: Partial<UtilitiesExpense>) => void;
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
  rates: ExchangeRate[];
  updateFXSettings: (settings: Partial<FXSettings>) => void;
  addExchangeRate: (rate: ExchangeRate) => void;
  updateExchangeRate: (id: string, rate: Partial<ExchangeRate>) => void;
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
 * Scenario represents a complete budget scenario that can be saved, loaded, and compared
 */
export interface Scenario extends Identifiable, Timestamped {
  name: string;
  description?: string;
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  household: Household;
  incomeSources: IncomeSource[];
  housingType: HousingType;
  housingExpense: HousingExpense;
  educationExpenses: Record<string, EducationExpense>;
  healthcareType: HealthcareType;
  healthcareExpenses: Record<string, HealthcareExpense>;
  transportType: TransportType;
  transportExpense: TransportExpense;
  lifestyleExpenses: LifestyleExpense[];
  utilityExpenses: Record<UtilityType, UtilitiesExpense>;
  emergencyFund: EmergencyFund;
  fxSettings: FXSettings;
}

/**
 * State for managing scenarios
 */
export interface ScenarioState {
  scenarios: Record<string, Scenario>;
  activeScenarioId: string | null;
  createScenario: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScenario: (id: string, updates: Partial<Omit<Scenario, 'id'>>) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  duplicateScenario: (id: string, newName: string) => void;
}

/**
 * The complete application state combining all slices
 */
export interface RootState {
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
  scenarios: ScenarioState;
  ui: UIState;
} 