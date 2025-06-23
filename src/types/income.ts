import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * General income types
 */
export enum IncomeType {
  EMPLOYMENT = 'EMPLOYMENT',
  PASSIVE = 'PASSIVE',
  ONE_OFF = 'ONE_OFF',
  OTHER = 'OTHER',
}

/**
 * Base interface for all income sources
 */
export interface IncomeSource extends Identifiable, Timestamped {
  name: string;
  description?: string;
  type: IncomeType;
  amount: Money;
  frequency: FrequencyType;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  taxable: boolean;
}

/**
 * Types of employment income
 */
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
}

/**
 * Employment-specific income details
 */
export interface EmploymentIncome extends IncomeSource {
  type: IncomeType.EMPLOYMENT;
  employmentType: EmploymentType;
  employer: string;
  benefits?: EmploymentBenefit[];
  bonuses?: Bonus[];
  deductions?: Deduction[];
}

/**
 * Employment benefits
 */
export interface EmploymentBenefit extends Identifiable {
  name: string;
  description?: string;
  monetaryValue: Money;
  frequency: FrequencyType;
  taxable: boolean;
}

/**
 * Bonus payments
 */
export interface Bonus extends Identifiable {
  name: string;
  amount: Money;
  expectedDate: Date;
  probability: number; // 0-1 representing likelihood of receiving the bonus
  taxable: boolean;
}

/**
 * Salary deductions
 */
export interface Deduction extends Identifiable {
  name: string;
  amount: Money;
  frequency: FrequencyType;
  isMandatory: boolean;
  isPreTax: boolean;
}

/**
 * Types of passive income
 */
export enum PassiveIncomeType {
  RENTAL = 'RENTAL',
  DIVIDEND = 'DIVIDEND',
  INTEREST = 'INTEREST',
  ROYALTY = 'ROYALTY',
  OTHER = 'OTHER',
}

/**
 * Passive income details
 */
export interface PassiveIncome extends IncomeSource {
  type: IncomeType.PASSIVE;
  passiveType: PassiveIncomeType;
  source: string;
  reliability: number; // 0-1 representing income stability
}

/**
 * One-time income details
 */
export interface OneTimeIncome extends IncomeSource {
  expectedDate: Date;
  probability: number; // 0-1 representing likelihood of receiving the income
}

/**
 * Aggregate income from all sources
 */
export interface AggregateIncome {
  employment: EmploymentIncome[];
  passive: PassiveIncome[];
  oneTime: OneTimeIncome[];
  totalMonthlyGross: Money;
  totalMonthlyNet: Money;
  totalAnnualGross: Money;
  totalAnnualNet: Money;
}

/**
 * Utility function to calculate monthly amount from any frequency
 */
export function calculateMonthlyAmount(amount: number, frequency: FrequencyType): number {
  switch (frequency) {
    case FrequencyType.WEEKLY:
      return amount * 52 / 12;
    case FrequencyType.BIWEEKLY:
      return amount * 26 / 12;
    case FrequencyType.MONTHLY:
      return amount;
    case FrequencyType.QUARTERLY:
      return amount / 3;
    case FrequencyType.ANNUALLY:
      return amount / 12;
    case FrequencyType.ONCE:
      return amount / 12; // Spread over a year by default
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
}

/**
 * Utility function to calculate annual amount from any frequency
 */
export function calculateAnnualAmount(amount: number, frequency: FrequencyType): number {
  switch (frequency) {
    case FrequencyType.WEEKLY:
      return amount * 52;
    case FrequencyType.BIWEEKLY:
      return amount * 26;
    case FrequencyType.MONTHLY:
      return amount * 12;
    case FrequencyType.QUARTERLY:
      return amount * 4;
    case FrequencyType.ANNUALLY:
      return amount;
    case FrequencyType.ONCE:
      return amount;
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
} 