import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of utility services
 */
export enum UtilityServiceType {
  ELECTRICITY = 'ELECTRICITY',
  GAS = 'GAS',
  WATER = 'WATER',
  SEWAGE = 'SEWAGE',
  INTERNET = 'INTERNET',
  MOBILE = 'MOBILE',
  LANDLINE = 'LANDLINE',
  TV = 'TV',
  STREAMING = 'STREAMING',
  TRASH = 'TRASH',
  RECYCLING = 'RECYCLING',
  OTHER = 'OTHER',
}

/**
 * Types of utility plans
 */
export enum UtilityPlanType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  PREPAID = 'PREPAID',
  PAY_AS_YOU_GO = 'PAY_AS_YOU_GO',
}

/**
 * Base interface for utility expenses
 */
export interface UtilityExpense extends Identifiable, Timestamped {
  type: UtilityServiceType;
  provider: string;
  planType: UtilityPlanType;
  baseCost: Money & { frequency: FrequencyType };
  variableCosts?: UtilityVariableCost[];
  setupFee?: Money;
  deposit?: Money;
  contractLength?: number; // in months
  earlyTerminationFee?: Money;
  included: boolean; // Whether included in rent/housing costs
  notes?: string;
}

/**
 * Variable cost component of a utility
 */
export interface UtilityVariableCost extends Identifiable {
  description: string;
  unitType: string; // e.g., "kWh", "GB", "liters"
  unitCost: Money;
  estimatedUnitsPerMonth: number;
  minimumUnits?: number;
  maximumUnits?: number;
}

/**
 * Internet/Mobile plan details
 */
export interface ConnectivityPlan extends UtilityExpense {
  type: UtilityServiceType.INTERNET | UtilityServiceType.MOBILE | UtilityServiceType.LANDLINE;
  speed?: number; // Mbps
  dataLimit?: number; // GB
  isUnlimited: boolean;
  includes: {
    wifi?: boolean;
    router?: boolean;
    internationalCalls?: boolean;
    streaming?: boolean;
  };
}

/**
 * TV/Streaming service details
 */
export interface EntertainmentPlan extends UtilityExpense {
  type: UtilityServiceType.TV | UtilityServiceType.STREAMING;
  channels?: number;
  includes: {
    sports?: boolean;
    movies?: boolean;
    internationalChannels?: boolean;
    streaming?: boolean;
    recordingStorage?: boolean;
  };
  devices: number; // Number of simultaneous devices/streams allowed
} 