import { CountryCode } from '@/types/base';

/**
 * Country code to name mapping
 */
export const COUNTRIES: Record<CountryCode, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'PT': 'Portugal',
  'ES': 'Spain',
  'FR': 'France',
  'IT': 'Italy',
  'DE': 'Germany',
  'CA': 'Canada',
  'AU': 'Australia',
  'NZ': 'New Zealand',
  'IE': 'Ireland',
  'CH': 'Switzerland',
  'GR': 'Greece',
  'AT': 'Austria',
  'BE': 'Belgium',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'JP': 'Japan',
  'CN': 'China',
  'SG': 'Singapore',
  'AE': 'United Arab Emirates',
  'BR': 'Brazil',
  'MX': 'Mexico',
} as const;

/**
 * Default currency code for each country
 */
export const COUNTRY_CURRENCIES: Record<CountryCode, string> = {
  'US': 'USD',
  'GB': 'GBP',
  'PT': 'EUR',
  'ES': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'DE': 'EUR',
  'CA': 'CAD',
  'AU': 'AUD',
  'NZ': 'NZD',
  'IE': 'EUR',
  'CH': 'CHF',
  'GR': 'EUR',
  'AT': 'EUR',
  'BE': 'EUR',
  'NL': 'EUR',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',
  'FI': 'EUR',
  'JP': 'JPY',
  'CN': 'CNY',
  'SG': 'SGD',
  'AE': 'AED',
  'BR': 'BRL',
  'MX': 'MXN',
} as const;

/**
 * Popular expat destination countries
 */
export const POPULAR_DESTINATION_COUNTRIES: CountryCode[] = [
  CountryCode.PT, CountryCode.ES, CountryCode.FR, CountryCode.IT, CountryCode.GR, CountryCode.CH, CountryCode.DE, CountryCode.NL, CountryCode.IE, CountryCode.CA, CountryCode.AU, CountryCode.NZ, CountryCode.SG, CountryCode.AE
]; 