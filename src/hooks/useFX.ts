import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store';
import { CurrencyCode, Money } from '@/types/base';
import { ExchangeRate } from '@/types/fx';
import { shallow } from 'zustand/shallow';
import { FXSettings } from '@/store/types';

export interface UseFXReturn {
  isLoading: boolean;
  error: Error | null;
  rates: Record<string, number>;
  settings: FXSettings;
  lastUpdated: Date | null;
  loadInitialFXData: () => Promise<void>;
  updateFXSettings: (newSettings: Partial<FXSettings>) => void;
  refreshRates: () => Promise<void>;
  convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => number | null;
  convertMoney: (money: Money, toCurrency: CurrencyCode) => Money | null;
  displayWithCurrency: (amount: number, currency: CurrencyCode) => string;
  getExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => ExchangeRate | null;
  manualRatesEnabled: boolean;
  setManualRatesEnabled: (enabled: boolean) => void;
  setCustomRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rate: number) => void;
  baseCurrency: CurrencyCode;
  displayCurrency: CurrencyCode;
  setBaseCurrency: (currency: CurrencyCode) => void;
  setDisplayCurrency: (currency: CurrencyCode) => void;
}

// A simple display formatter, can be enhanced later
const formatCurrency = (amount: number, currency: CurrencyCode, locale: string = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes or other errors
    // console.error(`Error formatting currency ${currency}:`, error);
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * Custom hook for handling all FX related functionality
 * @returns FX utilities for currency conversion and rate management
 */
export const useFX = (): UseFXReturn => {
  console.log('[useFX.ts] useFX hook called.');

  const {
    rates: storeRates,
    settings: storeSettings,
    isLoading: storeIsLoading,
    error: storeError,
    lastUpdated: storeLastUpdated,
    loadInitialFXData: storeLoadInitialFXData,
    updateFXSettings: storeUpdateFXSettings,
    convertAmount: storeConvertAmount,
    getExchangeRate: storeGetExchangeRate,
  } = useStore(
    (state) => {
      // console.log('[useFX.ts] Zustand selector running. state.fx:', state.fx); // Potentially too noisy
      return state.fx;
    },
    shallow
  );

  // console.log('[useFX.ts] Destructured from store - typeof storeConvertAmount:', typeof storeConvertAmount);
  // console.log('[useFX.ts] Destructured from store - typeof storeGetExchangeRate:', typeof storeGetExchangeRate);

  // Handle settings null case providing a robust default
  const safeSettings = storeSettings || {
    baseCurrency: CurrencyCode.USD,
    displayCurrency: CurrencyCode.USD,
    manualRates: false,
    customRates: {},
    sensitivityRange: [-0.1, 0.1],
  };

  useEffect(() => {
    // console.log('[useFX.ts] useEffect triggered. storeLastUpdated:', storeLastUpdated, 'storeIsLoading:', storeIsLoading, 'storeError:', storeError);
    if (typeof window !== 'undefined' && !storeLastUpdated && !storeIsLoading && !storeError) {
      // console.log('[useFX.ts] useEffect: Conditions met, calling storeLoadInitialFXData.');
      if (typeof storeLoadInitialFXData === 'function') {
        storeLoadInitialFXData();
      } else {
        console.warn('[useFX.ts] storeLoadInitialFXData is not a function in useEffect');
      }
    } else {
      // console.log('[useFX.ts] useEffect: Conditions NOT met for storeLoadInitialFXData. typeof window:', typeof window);
    }
  }, [storeLoadInitialFXData, storeLastUpdated, storeIsLoading, storeError]);

  const safeLoadInitialFXData = useCallback(async () => {
    if (typeof storeLoadInitialFXData === 'function') {
      return storeLoadInitialFXData();
    }
    console.warn('[useFX.ts] safeLoadInitialFXData: storeLoadInitialFXData is not a function.');
    return Promise.resolve();
  }, [storeLoadInitialFXData]);

  const safeUpdateFXSettings = useCallback((newSettings: Partial<FXSettings>) => {
    if (typeof storeUpdateFXSettings === 'function') {
      storeUpdateFXSettings(newSettings);
    } else {
      console.warn('[useFX.ts] safeUpdateFXSettings: storeUpdateFXSettings is not a function.');
    }
  }, [storeUpdateFXSettings]);

  const safeConvertAmount = useCallback(
    (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number | null => {
      if (typeof storeConvertAmount === 'function') {
        return storeConvertAmount(amount, fromCurrency, toCurrency);
      }
      console.warn('[useFX.ts] safeConvertAmount: storeConvertAmount is not a function. Returning null.');
      return null;
    },
    [storeConvertAmount]
  );

  const safeGetExchangeRate = useCallback(
    (fromCurrency: CurrencyCode, toCurrency: CurrencyCode): ExchangeRate | null => {
      if (typeof storeGetExchangeRate === 'function') {
        return storeGetExchangeRate(fromCurrency, toCurrency);
      }
      console.warn('[useFX.ts] safeGetExchangeRate: storeGetExchangeRate is not a function. Returning null.');
      return null;
    },
    [storeGetExchangeRate]
  );

  const refreshRates = useCallback(async () => {
    if (typeof storeLoadInitialFXData === 'function') {
      await storeLoadInitialFXData();
    } else {
      console.warn('[useFX.ts] refreshRates: storeLoadInitialFXData is not a function.');
    }
  }, [storeLoadInitialFXData]);

  const convertMoney = useCallback(
    (money: Money, toCurrency: CurrencyCode): Money | null => {
      const convertedAmount = safeConvertAmount(money.amount, money.currency, toCurrency);
      return convertedAmount !== null ? { amount: convertedAmount, currency: toCurrency } : null;
    },
    [safeConvertAmount]
  );

  const displayWithCurrency = useCallback(
    (amount: number, currency: CurrencyCode): string => {
      return formatCurrency(amount, currency);
    },
    []
  );

  const setManualRatesEnabled = useCallback(
    (enabled: boolean) => {
      safeUpdateFXSettings({ manualRates: enabled });
    },
    [safeUpdateFXSettings]
  );

  const setCustomRate = useCallback(
    (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rate: number) => {
      if (fromCurrency === toCurrency) return;
      safeUpdateFXSettings({
        customRates: {
          ...(safeSettings.customRates || {}),
          [`${fromCurrency}-${toCurrency}`]: rate,
        },
      });
    },
    [safeSettings.customRates, safeUpdateFXSettings]
  );

  const setBaseCurrency = useCallback(
    (currency: CurrencyCode) => {
      safeUpdateFXSettings({ baseCurrency: currency });
    },
    [safeUpdateFXSettings]
  );

  const setDisplayCurrency = useCallback(
    (currency: CurrencyCode) => {
      safeUpdateFXSettings({ displayCurrency: currency });
    },
    [safeUpdateFXSettings]
  );

  return {
    isLoading: storeIsLoading || false,
    error: storeError || null,
    rates: storeRates || {},
    settings: safeSettings,
    lastUpdated: storeLastUpdated || null,
    loadInitialFXData: safeLoadInitialFXData,
    updateFXSettings: safeUpdateFXSettings,
    refreshRates,
    convertAmount: safeConvertAmount,
    convertMoney,
    displayWithCurrency,
    getExchangeRate: safeGetExchangeRate,
    manualRatesEnabled: safeSettings.manualRates,
    setManualRatesEnabled,
    setCustomRate,
    baseCurrency: safeSettings.baseCurrency,
    displayCurrency: safeSettings.displayCurrency,
    setBaseCurrency,
    setDisplayCurrency,
  };
}; 