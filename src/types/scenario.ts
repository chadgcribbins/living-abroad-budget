import { 
  CountryCode,
  Identifiable, 
  Timestamped
} from '@/types/base'

import { 
  HousingType, 
  HousingExpense
} from '@/types/housing'

import { 
  IncomeSource
} from '@/types/income'

import { 
  EducationExpense
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
  UtilityExpense
} from '@/types/utilities'

import { 
  EmergencyFund 
} from '@/types/emergency'

import {
  Household
} from './household'

import { HealthcareCoverageType as HealthcareType } from './healthcare'
import { FXSettings } from '@/store/types'
import { UtilityServiceType } from './utilities'

/**
 * Schema version for managing data migrations
 */
export interface SchemaVersioned {
  schemaVersion: number;
}

/**
 * Current schema version - increment when making breaking changes to scenario structure
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * ScenarioContent contains the actual data of a scenario
 */
export interface ScenarioContent extends SchemaVersioned {
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
  utilityExpenses: Partial<Record<UtilityServiceType, UtilityExpense>>;
  emergencyFund: EmergencyFund;
  fxSettings: FXSettings;
  completionStatus: 'draft' | 'complete';
}

/**
 * Scenario combines metadata with content
 */
export interface Scenario extends Identifiable, Timestamped {
  name: string;
  description?: string;
  content: ScenarioContent;
}

/**
 * ScenarioStorageItem is the format used for storing in LocalStorage
 */
export interface ScenarioStorageItem extends SchemaVersioned {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  content: ScenarioContent;
}

/**
 * ScenarioMap is a map of scenario IDs to scenarios
 */
export type ScenarioMap = Record<string, Scenario>;

/**
 * StorageOperationResult represents the result of a storage operation
 */
export interface StorageOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * CreateScenarioInput is the input for creating a new scenario
 */
export type CreateScenarioInput = Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * UpdateScenarioInput is the input for updating a scenario
 */
export type UpdateScenarioInput = Partial<Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * ScenarioListItem is a lightweight representation of a scenario for listing
 */
export interface ScenarioListItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  completionStatus: 'draft' | 'complete';
}

/**
 * Scenario storage statistics
 */
export interface ScenarioStorageStats {
  totalScenarios: number;
  totalSize: number; // in bytes
  remainingSpace: number; // in bytes
  usagePercentage: number; // 0-100
  estimatedCapacity: number; // in bytes
} 