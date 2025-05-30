import { Address, FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of housing arrangements
 */
export enum HousingType {
  RENT = 'RENT',
  OWN = 'OWN',
  TEMPORARY = 'TEMPORARY', // For short-term stays like hotels/airbnb
}

/**
 * Types of property insurance
 */
export enum InsuranceType {
  RENTERS = 'RENTERS',
  HOMEOWNERS = 'HOMEOWNERS',
  CONTENTS = 'CONTENTS',
  LIABILITY = 'LIABILITY',
}

/**
 * Base interface for housing expenses
 */
export interface HousingExpense extends Identifiable, Timestamped {
  type: HousingType;
  address: Address;
  mainCost: Money & { frequency: FrequencyType }; // Rent or mortgage payment
  utilities?: UtilityExpense[];
  insurance?: InsurancePolicy[];
  propertyTax?: Money & { frequency: FrequencyType };
  maintenanceFees?: Money & { frequency: FrequencyType };
  furnished: boolean;
  squareMeters?: number;
  bedrooms: number;
  bathrooms: number;
  notes?: string;
}

/**
 * Insurance policy details
 */
export interface InsurancePolicy extends Identifiable {
  type: InsuranceType;
  provider: string;
  cost: Money & { frequency: FrequencyType };
  coverage: Money;
  deductible?: Money;
  startDate: Date;
  endDate?: Date;
}

/**
 * Utility expense types
 */
export enum UtilityType {
  ELECTRICITY = 'ELECTRICITY',
  GAS = 'GAS',
  WATER = 'WATER',
  INTERNET = 'INTERNET',
  TV = 'TV',
  PHONE = 'PHONE',
  TRASH = 'TRASH',
  OTHER = 'OTHER',
}

/**
 * Utility expense details
 */
export interface UtilityExpense extends Identifiable {
  type: UtilityType;
  provider?: string;
  cost: Money & { frequency: FrequencyType };
  included: boolean; // Whether it's included in rent/fees
  notes?: string;
} 