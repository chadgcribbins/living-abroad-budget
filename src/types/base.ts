/**
 * Base types and enumerations for the Living Abroad Budget application
 */

/**
 * Supported countries in the application
 */
export enum CountryCode {
  GB = 'GB', // United Kingdom
  PT = 'PT', // Portugal
  US = 'US', // United States
  ES = 'ES', // Spain
  FR = 'FR', // France
  IT = 'IT', // Italy
  DE = 'DE', // Germany
  CA = 'CA', // Canada
  AU = 'AU', // Australia
  NZ = 'NZ', // New Zealand
  IE = 'IE', // Ireland
  CH = 'CH', // Switzerland
  GR = 'GR', // Greece
  AT = 'AT', // Austria
  BE = 'BE', // Belgium
  NL = 'NL', // Netherlands
  SE = 'SE', // Sweden
  NO = 'NO', // Norway
  DK = 'DK', // Denmark
  FI = 'FI', // Finland
  JP = 'JP', // Japan
  CN = 'CN', // China
  SG = 'SG', // Singapore
  AE = 'AE', // United Arab Emirates
  BR = 'BR', // Brazil
  MX = 'MX', // Mexico
  // Add more countries as needed
}

/**
 * Supported currencies in the application
 */
export enum CurrencyCode {
  GBP = 'GBP',
  EUR = 'EUR',
  USD = 'USD',
  JPY = 'JPY', // Japan Yen
  CAD = 'CAD', // Canadian Dollar
  AUD = 'AUD', // Australian Dollar
  // Add more currencies as needed
}

/**
 * Frequency of income or expenses
 */
export enum FrequencyType {
  ONCE = 'ONCE',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

/**
 * Represents a monetary value with its currency
 */
export interface Money {
  amount: number;
  currency: CurrencyCode;
}

/**
 * Common address structure
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: CountryCode;
}

/**
 * Residency status types
 */
export enum ResidencyType {
  CITIZEN = 'CITIZEN',
  PERMANENT_RESIDENT = 'PERMANENT_RESIDENT',
  TEMPORARY_RESIDENT = 'TEMPORARY_RESIDENT',
  NON_RESIDENT = 'NON_RESIDENT',
}

/**
 * Tax regime types (e.g., Portugal NHR)
 */
export enum TaxRegimeType {
  STANDARD = 'STANDARD',
  PORTUGAL_NHR = 'PORTUGAL_NHR',
  // Add more tax regimes as needed
}

/**
 * Type guard to check if a value is a valid Money object
 */
export function isMoney(value: unknown): value is Money {
  return (
    typeof value === 'object' &&
    value !== null &&
    'amount' in value &&
    'currency' in value &&
    typeof (value as Money).amount === 'number' &&
    Object.values(CurrencyCode).includes((value as Money).currency)
  );
}

/**
 * Interface for objects with ID
 */
export interface Identifiable {
  id: string;
}

/**
 * Interface for objects with timestamp fields
 */
export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Utility type to make certain properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type to make certain properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Common status types
 */
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

/**
 * Frequency type for recurring items
 */
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time'; 