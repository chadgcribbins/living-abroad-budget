import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of transportation methods
 */
export enum TransportType {
  PUBLIC = 'PUBLIC',
  PRIVATE_CAR = 'PRIVATE_CAR',
  LEASED_CAR = 'LEASED_CAR',
  TAXI = 'TAXI',
  RIDESHARE = 'RIDESHARE',
  BICYCLE = 'BICYCLE',
  WALKING = 'WALKING',
  OTHER = 'OTHER',
}

/**
 * Types of public transportation passes
 */
export enum PassType {
  SINGLE = 'SINGLE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  PAY_AS_YOU_GO = 'PAY_AS_YOU_GO',
}

/**
 * Base interface for transportation expenses
 */
export interface TransportExpense extends Identifiable, Timestamped {
  type: TransportType;
  mainCost: Money & { frequency: FrequencyType }; // Primary transport cost
  additionalCosts?: TransportAdditionalCost[];
  isCommute: boolean;
  distance?: number; // in kilometers
  timePerTrip?: number; // in minutes
  notes?: string;
}

/**
 * Public transportation specific details
 */
export interface PublicTransportExpense extends TransportExpense {
  type: TransportType.PUBLIC;
  passType: PassType;
  zones?: string[];
  routes?: string[];
}

/**
 * Vehicle-related expenses
 */
export interface VehicleExpense extends TransportExpense {
  type: TransportType.PRIVATE_CAR | TransportType.LEASED_CAR;
  vehicle: VehicleDetails;
  insurance: VehicleInsurance;
  fuel?: Money & { frequency: FrequencyType };
  maintenance?: Money & { frequency: FrequencyType };
  parking?: Money & { frequency: FrequencyType };
  roadTax?: Money & { frequency: FrequencyType };
}

/**
 * Vehicle details
 */
export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  isElectric: boolean;
  fuelEfficiency?: number; // L/100km or kWh/100km
}

/**
 * Vehicle insurance details
 */
export interface VehicleInsurance extends Identifiable {
  provider: string;
  cost: Money & { frequency: FrequencyType };
  coverage: Money;
  deductible?: Money;
  startDate: Date;
  endDate?: Date;
  isComprehensive: boolean;
}

/**
 * Additional transportation costs
 */
export interface TransportAdditionalCost extends Identifiable {
  description: string;
  cost: Money & { frequency: FrequencyType };
  isRequired: boolean;
} 