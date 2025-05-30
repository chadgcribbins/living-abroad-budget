import { CurrencyCode, Identifiable, Money, Timestamped } from './base';

/**
 * Exchange rate data point
 */
export interface ExchangeRate extends Identifiable, Timestamped {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  provider: string;
  bid?: number;
  ask?: number;
  spread?: number;
}

/**
 * Historical exchange rate data
 */
export interface HistoricalRates extends Identifiable {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  period: {
    start: Date;
    end: Date;
  };
  dataPoints: {
    date: Date;
    rate: number;
    volume?: number;
  }[];
  source: string;
}

/**
 * FX rate sensitivity configuration
 */
export interface FXSensitivity extends Identifiable {
  baseCurrency: CurrencyCode;
  targetCurrencies: CurrencyCode[];
  scenarios: FXScenario[];
  impactThreshold: number; // Percentage change threshold for alerts
  updateFrequency: number; // Days between updates
}

/**
 * FX rate scenario for analysis
 */
export interface FXScenario extends Identifiable {
  name: string;
  description: string;
  rateChanges: {
    currency: CurrencyCode;
    percentageChange: number;
  }[];
  probability?: number; // 0-1 probability of scenario occurring
  impact?: {
    category: string;
    amount: Money;
    percentage: number;
  }[];
}

/**
 * Currency conversion preferences
 */
export interface ConversionPreferences extends Identifiable {
  defaultFromCurrency: CurrencyCode;
  defaultToCurrency: CurrencyCode;
  rateProvider: string;
  markupPercentage: number;
  roundingRules: {
    currency: CurrencyCode;
    precision: number;
    roundingMethod: 'up' | 'down' | 'nearest';
  }[];
  cacheTimeout: number; // Minutes to cache rates
}

/**
 * FX transaction details
 */
export interface FXTransaction extends Identifiable, Timestamped {
  fromAmount: Money;
  toAmount: Money;
  rate: number;
  fees: Money[];
  provider: string;
  type: 'spot' | 'forward' | 'swap';
  settlementDate: Date;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
}

/**
 * Currency exposure analysis
 */
export interface CurrencyExposure extends Identifiable {
  baseCurrency: CurrencyCode;
  exposures: {
    currency: CurrencyCode;
    amount: Money;
    percentage: number;
    type: 'income' | 'expense' | 'asset' | 'liability';
  }[];
  netExposure: {
    currency: CurrencyCode;
    amount: Money;
    percentage: number;
  }[];
  hedgingStrategies?: {
    description: string;
    cost: Money;
    effectiveness: number; // 0-1 rating
    implementation: string;
  }[];
} 