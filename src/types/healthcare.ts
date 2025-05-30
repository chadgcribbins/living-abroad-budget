import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of healthcare coverage
 */
export enum HealthcareCoverageType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  HYBRID = 'HYBRID',
  TRAVEL = 'TRAVEL',
}

/**
 * Types of healthcare services
 */
export enum HealthcareServiceType {
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  SPECIALIST = 'SPECIALIST',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  PRESCRIPTION = 'PRESCRIPTION',
  EMERGENCY = 'EMERGENCY',
  HOSPITALIZATION = 'HOSPITALIZATION',
  PREVENTIVE = 'PREVENTIVE',
  ALTERNATIVE = 'ALTERNATIVE',
}

/**
 * Base interface for healthcare expenses
 */
export interface HealthcareExpense extends Identifiable, Timestamped {
  type: HealthcareCoverageType;
  provider: string;
  premium: Money & { frequency: FrequencyType };
  deductible?: Money;
  outOfPocketMax?: Money;
  coverageStart: Date;
  coverageEnd?: Date;
  coveredServices: HealthcareService[];
  familyCoverage: boolean;
  notes?: string;
}

/**
 * Healthcare service coverage details
 */
export interface HealthcareService extends Identifiable {
  type: HealthcareServiceType;
  coverage: number; // Percentage covered
  copay?: Money;
  waitingPeriod?: number; // in days
  annualLimit?: Money;
  preExistingConditions: boolean;
  restrictions?: string[];
}

/**
 * Regular medication or treatment costs
 */
export interface RegularTreatment extends Identifiable {
  description: string;
  cost: Money & { frequency: FrequencyType };
  covered: boolean;
  copay?: Money;
  provider?: string;
  notes?: string;
}

/**
 * Expected or planned medical procedures
 */
export interface PlannedProcedure extends Identifiable {
  description: string;
  expectedDate?: Date;
  estimatedCost: Money;
  provider?: string;
  covered: boolean;
  expectedCopay?: Money;
  requiresPreApproval: boolean;
  notes?: string;
}

/**
 * Healthcare savings or reimbursement accounts
 */
export interface HealthcareSavings extends Identifiable {
  type: string; // e.g., "HSA", "FSA", "HRA"
  balance: Money;
  annualContribution: Money;
  employerContribution?: Money;
  taxAdvantaged: boolean;
  rollsOver: boolean;
  expirationDate?: Date;
  notes?: string;
} 