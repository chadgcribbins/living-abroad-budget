import { CurrencyCode } from '@/types/base';
import { ExchangeRate } from '@/types/fx';
import { v4 as uuidv4 } from 'uuid';

// Interface for API response from OpenExchangeRates
interface OXRLatestResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
  note?: string;
}

interface OXRHistoricalResponse extends OXRLatestResponse {}

/**
 * Fetches the latest exchange rates using our Next.js API route
 * @param baseCurrency Base currency for rates (defaults to USD)
 * @returns Promise with the exchange rates data
 */
export const fetchLatestRates = async (
  baseCurrency: CurrencyCode = CurrencyCode.USD
): Promise<OXRLatestResponse> => {
  try {
    const url = `/api/fx/latest?base=${baseCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Exchange rates API error: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching latest exchange rates:', error);
    throw error;
  }
};

/**
 * Fetches historical exchange rates using our Next.js API route
 * @param date Date for historical data (YYYY-MM-DD format)
 * @param baseCurrency Base currency for rates (defaults to USD)
 * @returns Promise with the historical exchange rates data
 */
export const fetchHistoricalRates = async (
  date: string,
  baseCurrency: CurrencyCode = CurrencyCode.USD
): Promise<OXRHistoricalResponse> => {
  try {
    const url = `/api/fx/historical/${date}?base=${baseCurrency}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Exchange rates API error: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching historical exchange rates for ${date}:`, error);
    throw error;
  }
};

/**
 * Converts an amount from one currency to another using the latest exchange rates
 * @param amount Amount to convert
 * @param fromCurrency Source currency
 * @param toCurrency Target currency
 * @returns Promise with the converted amount
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> => {
  if (fromCurrency === toCurrency) return amount;

  try {
    const rates = await fetchLatestRates();
    
    // Get the rates relative to USD (base currency for free tier)
    const fromRate = rates.rates[fromCurrency];
    const toRate = rates.rates[toCurrency];
    
    if (!fromRate || !toRate) {
      throw new Error(`Could not find exchange rates for ${fromCurrency} or ${toCurrency}`);
    }
    
    // Convert the amount: first to USD, then to target currency
    const amountInUSD = amount / fromRate;
    const convertedAmount = amountInUSD * toRate;
    
    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

/**
 * Formats the API response into the application's ExchangeRate model
 * @param apiResponse Response from the OpenExchangeRates API
 * @param targetCurrencies List of currencies to include in the formatted result
 * @returns Array of ExchangeRate objects
 */
export const formatExchangeRates = (
  apiResponse: OXRLatestResponse,
  targetCurrencies: CurrencyCode[]
): ExchangeRate[] => {
  const { rates, base, timestamp } = apiResponse;
  const timestampDate = new Date(timestamp * 1000);
  
  return targetCurrencies.map(currency => {
    const rate = rates[currency];
    
    if (!rate) {
      throw new Error(`Rate not found for currency: ${currency}`);
    }
    
    return {
      id: uuidv4(),
      fromCurrency: base as CurrencyCode,
      toCurrency: currency,
      rate,
      provider: 'OpenExchangeRates',
      createdAt: timestampDate,
      updatedAt: timestampDate
    };
  });
};

/**
 * Calculates the inverse exchange rate (e.g., USD->EUR to EUR->USD)
 * @param rate Original exchange rate
 * @returns The inverse rate
 */
export const calculateInverseRate = (rate: number): number => {
  return Number((1 / rate).toFixed(6));
};

/**
 * Creates cross-currency exchange rates between non-USD currencies
 * @param baseCurrencyRates Exchange rates with USD as the base
 * @returns Additional cross-currency exchange rates
 */
export const createCrossCurrencyRates = (
  baseCurrencyRates: ExchangeRate[]
): ExchangeRate[] => {
  const crossRates: ExchangeRate[] = [];
  
  for (let i = 0; i < baseCurrencyRates.length; i++) {
    for (let j = 0; j < baseCurrencyRates.length; j++) {
      if (i !== j) {
        const fromRate = baseCurrencyRates[i];
        const toRate = baseCurrencyRates[j];
        
        // Calculate cross rate: fromCurrency -> toCurrency
        // First convert to USD, then to target currency
        const crossRate = toRate.rate / fromRate.rate;
        
        crossRates.push({
          id: uuidv4(),
          fromCurrency: fromRate.toCurrency,
          toCurrency: toRate.toCurrency,
          rate: Number(crossRate.toFixed(6)),
          provider: 'OpenExchangeRates (calculated)',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }
  
  return crossRates;
}; 