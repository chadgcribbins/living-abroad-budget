import { CurrencyCode } from './base';

export interface Country {
  code: string;
  name: string;
  currencyCode: CurrencyCode;
  flag?: string;
}

export const countries: Country[] = [
  { code: 'GB', name: 'United Kingdom', currencyCode: CurrencyCode.GBP, flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', currencyCode: CurrencyCode.EUR, flag: '🇵🇹' },
  { code: 'US', name: 'United States', currencyCode: CurrencyCode.USD, flag: '🇺🇸' },
  { code: 'ES', name: 'Spain', currencyCode: CurrencyCode.EUR, flag: '🇪🇸' },
  { code: 'FR', name: 'France', currencyCode: CurrencyCode.EUR, flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', currencyCode: CurrencyCode.EUR, flag: '🇮🇹' },
  { code: 'DE', name: 'Germany', currencyCode: CurrencyCode.EUR, flag: '🇩🇪' },
  { code: 'CA', name: 'Canada', currencyCode: CurrencyCode.CAD, flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currencyCode: CurrencyCode.AUD, flag: '🇦🇺' },
]; 