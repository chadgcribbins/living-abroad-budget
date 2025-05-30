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

/**
 * Custom hook for handling all FX related functionality
 * @returns FX utilities for currency conversion and rate management
 */
export const useFX = (): UseFXReturn => {
  console.log('[useFX.ts] useFX hook called.');

  const {
    rates,       // Changed from fxRates to rates
    settings,     
    isLoading,
    error: fxError, 
    lastUpdated,
    loadInitialFXData,
    updateFXSettings,
    convertAmount,
    getExchangeRate,
  } = useStore(
    (state) => {
      // console.log('[useFX.ts] Zustand selector running. state.fx:', state.fx); // Potentially too noisy
      return state.fx;
    },
    shallow
  );

  console.log('[useFX.ts] Destructured from store - typeof convertAmount:', typeof convertAmount);
  console.log('[useFX.ts] Destructured from store - typeof getExchangeRate:', typeof getExchangeRate);
  // console.log('[useFX.ts] isLoading from store:', isLoading, 'lastUpdated:', lastUpdated, 'fxError:', fxError); // Optional detailed log

  // Local state for error - removed unused setError
  const [error] = useState<Error | null>(null);

  // Handle settings null case
  const fxSettings = settings || {
    baseCurrency: CurrencyCode.USD,
    displayCurrency: CurrencyCode.USD,
    manualRates: false,
    customRates: {},
    sensitivityRange: [-0.1, 0.1],
  };

  useEffect(() => {
    console.log('[useFX.ts] useEffect triggered. lastUpdated:', lastUpdated, 'isLoading:', isLoading, 'fxError:', fxError);
    if (!lastUpdated && !isLoading && !fxError) {
      console.log('[useFX.ts] useEffect: Conditions met, calling loadInitialFXData.');
      loadInitialFXData();
    } else {
      console.log('[useFX.ts] useEffect: Conditions NOT met for loadInitialFXData.');
    }
  }, [loadInitialFXData, lastUpdated, isLoading, fxError]);

  /**
   * Refreshes the exchange rates by calling the store action.
   * The store action itself will handle isLoading and error states.
   */
  const refreshRates = useCallback(async () => {
    await loadInitialFXData();
  }, [loadInitialFXData]);

  /**
   * Converts a Money object to a different currency
   */
  const convertMoney = useCallback(
    (money: Money, toCurrency: CurrencyCode): Money | null => {
      const convertedAmount = convertAmount(money.amount, money.currency, toCurrency);
      return convertedAmount !== null ? { amount: convertedAmount, currency: toCurrency } : null;
    },
    [convertAmount]
  );

  /**
   * Formats an amount with its currency symbol
   */
  const displayWithCurrency = useCallback(
    (amount: number, currency: CurrencyCode): string => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatter.format(amount);
    },
    []
  );

  /**
   * Sets manual rate mode on/off
   */
  const setManualRatesEnabled = useCallback(
    (enabled: boolean) => {
      updateFXSettings({ manualRates: enabled });
    },
    [updateFXSettings]
  );

  /**
   * Sets a custom exchange rate
   */
  const setCustomRate = useCallback(
    (fromCurrency: CurrencyCode, toCurrency: CurrencyCode, rate: number) => {
      if (fromCurrency === toCurrency) return;
      
      updateFXSettings({
        customRates: {
          ...fxSettings.customRates,
          [`${fromCurrency}-${toCurrency}`]: rate,
        },
      });
    },
    [fxSettings.customRates, updateFXSettings]
  );

  /**
   * Sets the base currency
   */
  const setBaseCurrency = useCallback(
    (currency: CurrencyCode) => {
      updateFXSettings({ baseCurrency: currency });
    },
    [updateFXSettings]
  );

  /**
   * Sets the display currency
   */
  const setDisplayCurrency = useCallback(
    (currency: CurrencyCode) => {
      updateFXSettings({ displayCurrency: currency });
    },
    [updateFXSettings]
  );

  return {
    isLoading: isLoading || false,
    error: fxError || error,
    rates,
    settings: fxSettings,
    lastUpdated,
    loadInitialFXData,
    updateFXSettings,
    refreshRates,
    convertAmount,
    convertMoney,
    displayWithCurrency,
    getExchangeRate,
    manualRatesEnabled: fxSettings.manualRates,
    setManualRatesEnabled,
    setCustomRate,
    baseCurrency: fxSettings.baseCurrency,
    displayCurrency: fxSettings.displayCurrency,
    setBaseCurrency,
    setDisplayCurrency,
  };
}; 