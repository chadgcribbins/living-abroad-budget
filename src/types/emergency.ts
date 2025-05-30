import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of emergency expenses
 */
export enum EmergencyExpenseType {
  MEDICAL = 'MEDICAL',
  HOUSING = 'HOUSING',
  TRANSPORTATION = 'TRANSPORTATION',
  INCOME_LOSS = 'INCOME_LOSS',
  RELOCATION = 'RELOCATION',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
}

/**
 * Emergency fund configuration
 */
export interface EmergencyFund extends Identifiable, Timestamped {
  targetMonths: number; // Number of months of expenses to cover
  currentBalance: Money;
  monthlyContribution: Money;
  minimumBalance: Money;
  location: string; // Where the fund is held
  isLiquid: boolean;
  notes?: string;
}

/**
 * Monthly expense calculation for emergency fund
 */
export interface MonthlyExpenseCalculation extends Identifiable {
  totalMonthlyExpenses: Money;
  includedExpenses: {
    category: string;
    amount: Money;
    isEssential: boolean;
  }[];
  excludedExpenses: {
    category: string;
    amount: Money;
    reason: string;
  }[];
  adjustmentFactor: number; // Multiplier for emergency scenarios
}

/**
 * Emergency fund status and metrics
 */
export interface EmergencyFundStatus extends Identifiable {
  currentCoverage: number; // Months of coverage based on current balance
  fundingProgress: number; // Percentage of target
  timeToTarget: number; // Months until target at current contribution rate
  shortfall: Money;
  surplus: Money;
  lastUpdated: Date;
}

/**
 * Planned emergency fund withdrawals
 */
export interface EmergencyWithdrawal extends Identifiable {
  type: EmergencyExpenseType;
  amount: Money;
  date: Date;
  description: string;
  isPlanned: boolean;
  replenishmentPlan?: {
    monthlyAmount: Money;
    startDate: Date;
    endDate: Date;
  };
  notes?: string;
}

/**
 * Emergency fund contribution schedule
 */
export interface ContributionSchedule extends Identifiable {
  baseAmount: Money & { frequency: FrequencyType };
  additionalContributions: {
    amount: Money;
    date: Date;
    source: string;
  }[];
  adjustmentRules: {
    trigger: string; // e.g., "balance below minimum", "income increase"
    adjustment: number; // Percentage or fixed amount
    temporary: boolean;
    duration?: number; // Months if temporary
  }[];
} 