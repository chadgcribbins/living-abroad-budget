import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Categories of lifestyle expenses
 */
export enum LifestyleCategory {
  DINING = 'DINING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  FITNESS = 'FITNESS',
  HOBBIES = 'HOBBIES',
  TRAVEL = 'TRAVEL',
  PERSONAL_CARE = 'PERSONAL_CARE',
  PETS = 'PETS',
  GIFTS = 'GIFTS',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  OTHER = 'OTHER',
}

/**
 * Frequency of lifestyle activities
 */
export enum ActivityFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  OCCASIONAL = 'OCCASIONAL',
}

/**
 * Base interface for lifestyle expenses
 */
export interface LifestyleExpense extends Identifiable, Timestamped {
  category: LifestyleCategory;
  description: string;
  amount: Money & { frequency: FrequencyType };
  priority: 'essential' | 'important' | 'optional';
  shared: boolean; // Whether this is a shared household expense
  notes?: string;
}

/**
 * Regular activity expenses
 */
export interface ActivityExpense extends LifestyleExpense {
  frequency: ActivityFrequency;
  participants: number;
  location?: string;
  membership?: boolean;
  membershipFee?: Money & { frequency: FrequencyType };
}

/**
 * Subscription-based expenses
 */
export interface SubscriptionExpense extends LifestyleExpense {
  provider: string;
  autoRenew: boolean;
  cancellationFee?: Money;
  startDate: Date;
  endDate?: Date;
  features?: string[];
}

/**
 * Travel and vacation expenses
 */
export interface TravelExpense extends LifestyleExpense {
  destination: string;
  duration: number; // in days
  transportation: Money;
  accommodation: Money;
  activities: Money;
  insurance?: Money;
  dates?: {
    departure: Date;
    return: Date;
  };
}

/**
 * Pet-related expenses
 */
export interface PetExpense extends LifestyleExpense {
  petType: string;
  food: Money & { frequency: FrequencyType };
  supplies: Money & { frequency: FrequencyType };
  insurance?: Money & { frequency: FrequencyType };
  veterinary?: Money & { frequency: FrequencyType };
  grooming?: Money & { frequency: FrequencyType };
}

/**
 * Personal care and wellness expenses
 */
export interface PersonalCareExpense extends LifestyleExpense {
  type: string; // e.g., "haircut", "massage", "gym"
  frequency: ActivityFrequency;
  provider?: string;
  membership?: boolean;
  membershipFee?: Money & { frequency: FrequencyType };
  includes?: string[];
} 