'use client';

import { useState } from 'react';
import { CurrencyCode } from '@/types/base';
import { useFX } from '@/hooks/useFX';

export interface CurrencyConverterProps {
  initialAmount?: number;
  initialFromCurrency?: CurrencyCode;
  initialToCurrency?: CurrencyCode;
}

/**
 * Currency converter component that demonstrates FX functionality
 */
export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialAmount = 100,
  initialFromCurrency = CurrencyCode.USD,
  initialToCurrency = CurrencyCode.EUR,
}) => {
  console.log('[CurrencyConverter.tsx] Component rendering.');

  // Local state for form inputs
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(initialToCurrency);

  // Get FX functionality from our hook - RESTORED
  const {
    isLoading,
    error,
    convertAmount, // Restored
    displayWithCurrency,
    refreshRates,
    getExchangeRate // Restored
  } = useFX();

  console.log('[CurrencyConverter.tsx] From useFX - typeof convertAmount:', typeof convertAmount);
  console.log('[CurrencyConverter.tsx] From useFX - typeof getExchangeRate:', typeof getExchangeRate);

  // Convert the amount with typeof checks
  console.log('[CurrencyConverter.tsx] Before calling convertAmount. Amount:', amount, 'From:', fromCurrency, 'To:', toCurrency);
  const convertedValue = typeof convertAmount === 'function' 
    ? convertAmount(amount, fromCurrency, toCurrency) 
    : (
        console.warn('[CurrencyConverter.tsx] convertAmount is not a function! Returning null.'),
        null
      );
  console.log('[CurrencyConverter.tsx] convertAmount result (convertedValue):', convertedValue);

  console.log('[CurrencyConverter.tsx] Before calling getExchangeRate. From:', fromCurrency, 'To:', toCurrency);
  const exchangeRateInfo = typeof getExchangeRate === 'function'
    ? getExchangeRate(fromCurrency, toCurrency)
    : (
        console.warn('[CurrencyConverter.tsx] getExchangeRate is not a function! Returning null.'),
        null
      );
  console.log('[CurrencyConverter.tsx] getExchangeRate result (exchangeRateInfo):', exchangeRateInfo);

  // Use the results or defaults
  const finalConvertedAmount = convertedValue !== null ? convertedValue : 0;
  const finalExchangeRate = exchangeRateInfo || { rate: 0, provider: 'unavailable', updatedAt: new Date() };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Currency Converter</h2>
      
      {/* Error message */}
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-800 rounded">
          An error occurred with FX rates. {(error as Error)?.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* From Currency Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="flex mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 rounded-l border border-gray-300 px-3 py-2"
              min="0"
              step="0.01"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
              className="rounded-r border border-gray-300 px-3 py-2 bg-gray-50"
            >
              {Object.values(CurrencyCode).map((currency) => (
                <option key={`from-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* To Currency Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Converted Amount</label>
          <div className="flex mb-4">
            <input
              type="number"
              value={finalConvertedAmount} // Use checked value
              readOnly
              className="flex-1 rounded-l border border-gray-300 px-3 py-2 bg-gray-50"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
              className="rounded-r border border-gray-300 px-3 py-2 bg-gray-50"
            >
              {Object.values(CurrencyCode).map((currency) => (
                <option key={`to-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Exchange Rate Display */}
      <div className="text-center my-4">
        <p className="text-gray-600">
          {isLoading ? (
            'Loading exchange rates...'
          ) : (
            <>
              <span className="font-medium">{displayWithCurrency(1, fromCurrency)}</span>
              {' = '}
              <span className="font-medium">
                {displayWithCurrency(finalExchangeRate?.rate || 0, toCurrency)} {/* Use checked value */}
              </span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-500" suppressHydrationWarning={true}>
          {finalExchangeRate?.provider ? `Provider: ${finalExchangeRate.provider}` : ''}
          {finalExchangeRate?.updatedAt ? 
            ` • Updated: ${new Date(finalExchangeRate.updatedAt).toLocaleString()}` 
            : ''}
        </p>
      </div>
      
      {/* Refresh Button */}
      <div className="text-center mt-4">
        <button
          onClick={refreshRates}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Rates'}
        </button>
      </div>
    </div>
  );
}; 