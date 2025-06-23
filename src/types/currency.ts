import { CurrencyCode } from './base';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: CurrencyCode.GBP, name: 'British Pound', symbol: '£' },
  { code: CurrencyCode.EUR, name: 'Euro', symbol: '€' },
  { code: CurrencyCode.USD, name: 'US Dollar', symbol: '$' },
  { code: CurrencyCode.JPY, name: 'Japanese Yen', symbol: '¥' },
  { code: CurrencyCode.CAD, name: 'Canadian Dollar', symbol: 'CA$' },
  { code: CurrencyCode.AUD, name: 'Australian Dollar', symbol: 'A$' },
  // Add more from CurrencyCode in base.ts as needed
]; 