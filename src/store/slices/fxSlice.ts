import { StateCreator } from 'zustand';
import { FXState, FXSettings } from '../types';
import { CurrencyCode } from '@/types/base';
import { ExchangeRate } from '@/types/fx';
import { fetchLatestRates } from '@/services/fx';
import { RootState } from '@/store';

// TODO: [Code Health] Review all internal method calls within this slice (e.g., one action calling another).
// Ensure that 'get()' is used correctly to access other actions/state from within an action
// to avoid issues with 'this' context or stale closures, especially if methods are destructured.
// Consider the implications of the "[DEPRECATED] Use createWithEqualityFn" warning seen in build logs.

/**
 * Default FX settings for new state initialization
 */
export const DEFAULT_FX_SETTINGS: FXSettings = {
  baseCurrency: CurrencyCode.USD,
  displayCurrency: CurrencyCode.USD,
  manualRates: false,
  customRates: {},
  sensitivityRange: [-0.1, 0.1], // Default: -10% to +10%
};

/**
 * Creates the FX slice for the Zustand store
 * @param set Zustand set function
 * @param get Zustand get function
 * @returns FX state and actions
 */
export const createFXSlice: StateCreator<RootState, [], [], FXState> = (set, get) => {
  console.log('[fxSlice.ts] ENTERING createFXSlice');

  const fxSliceObject = {
    // Initial state
    settings: DEFAULT_FX_SETTINGS,
    rates: {},
    isLoading: false,
    error: null,
    lastUpdated: null,

    // Actions
    loadInitialFXData: async () => {
      console.log('[fxSlice.ts] loadInitialFXData called.');
      set(state => ({ ...state, fx: { ...state.fx, isLoading: true, error: null } }));
      try {
        const baseCurrency = get().fx.settings?.baseCurrency || CurrencyCode.USD;
        const apiResponse = await fetchLatestRates(baseCurrency);
        
        if (apiResponse && apiResponse.rates) {
          set(state => ({ 
            ...state,
            fx: {
              ...state.fx,
              rates: apiResponse.rates,
              isLoading: false,
              lastUpdated: new Date(apiResponse.timestamp * 1000),
              error: null,
            }
          }));
        } else {
          throw new Error('Invalid API response structure for FX rates');
        }
      } catch (err) {
        console.error('Error in loadInitialFXData:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load exchange rates';
        set(state => ({ 
          ...state,
          fx: { ...state.fx, isLoading: false, error: new Error(errorMessage), rates: {} }
        }));
      }
    },

    /**
     * Updates FX settings
     * @param settings Partial FX settings to update
     */
    updateFXSettings: (newSettings: Partial<FXSettings>) => {
      console.log('[fxSlice.ts] updateFXSettings called with:', newSettings);
      set((state) => ({
        ...state,
        fx: {
          ...state.fx,
          settings: {
            ...(state.fx.settings || DEFAULT_FX_SETTINGS),
            ...newSettings,
          },
        }
      }));
    },

    /**
     * Adds a new exchange rate
     * @param rate Exchange rate to add
     */
    addExchangeRate: (rate: ExchangeRate) => {
      console.log('[fxSlice.ts] addExchangeRate called with:', rate);
      const baseCurrency = get().fx.settings?.baseCurrency || CurrencyCode.USD;
      
      let targetCurrencyCode: CurrencyCode | null = null;
      let rateToBase: number | null = null;

      if (rate.fromCurrency === baseCurrency) {
        targetCurrencyCode = rate.toCurrency;
        rateToBase = rate.rate;
      } else if (rate.toCurrency === baseCurrency) {
        targetCurrencyCode = rate.fromCurrency;
        if (rate.rate === 0) {
          console.error("[fxSlice.ts] Cannot add exchange rate with a zero inverse rate.");
          return;
        }
        rateToBase = 1 / rate.rate;
      } else {
        console.warn(`[fxSlice.ts] addExchangeRate: Rate ${rate.fromCurrency}-${rate.toCurrency} is not against the base currency ${baseCurrency}. Ignoring.`);
        return;
      }

      if (targetCurrencyCode && rateToBase !== null) {
        set((state) => ({
          ...state,
          fx: {
            ...state.fx,
            rates: {
              ...(state.fx.rates || {}),
              [targetCurrencyCode as string]: rateToBase,
            },
            lastUpdated: new Date(),
          }
        }));
      }
    },

    /**
     * Updates an existing exchange rate (Simplified for Record<string, number> structure)
     * @param id This 'id' might be a currency code string if rates are Record<string, number>
     *           or we need to rethink how updateExchangeRate works.
     *           For now, let's assume 'id' is the CurrencyCode (string) to update its rate against base.
     * @param rate Partial exchange rate data. We'll expect { rate: newRateValue }
     */
    updateExchangeRate: (currencyCodeToUpdate: string, newRateUpdate: Partial<{ rate: number }>) => {
      console.log('[fxSlice.ts] updateExchangeRate called for:', currencyCodeToUpdate, 'with rate:', newRateUpdate);
      if (typeof newRateUpdate.rate === 'number') {
        set((state) => {
          if (state.fx.rates && state.fx.rates.hasOwnProperty(currencyCodeToUpdate)) {
            return {
              ...state,
              fx: {
                ...state.fx,
                rates: {
                  ...state.fx.rates,
                  [currencyCodeToUpdate]: newRateUpdate.rate as number,
                },
                lastUpdated: new Date(),
              }
            };
          }
          console.warn(`[fxSlice.ts] updateExchangeRate: Currency code ${currencyCodeToUpdate} not found in rates. No update performed.`);
          return state; 
        });
      } else {
        console.warn("[fxSlice.ts] updateExchangeRate: newRateUpdate did not contain a valid rate property.");
      }
    },

    /**
     * Helper function to get a specific exchange rate
     * @param fromCurrency Source currency
     * @param toCurrency Target currency
     * @returns Exchange rate if found, undefined otherwise
     */
    getExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode): ExchangeRate | null => {
      const currentFXState = get().fx;
      const { rates, settings, lastUpdated } = currentFXState;
      
      const baseCurrency = settings?.baseCurrency || CurrencyCode.USD;
      if (fromCurrency === toCurrency) return { id: `${fromCurrency}-${toCurrency}-self`, fromCurrency, toCurrency, rate: 1, provider: 'system', createdAt: new Date(), updatedAt: new Date() };
      
      if (settings && settings.manualRates && settings.customRates && typeof settings.customRates === 'object') {
        const customRateKey = `${fromCurrency}-${toCurrency}`;
        if (settings.customRates.hasOwnProperty(customRateKey)) {
          return { id: `custom-${customRateKey}`, fromCurrency, toCurrency, rate: settings.customRates[customRateKey], provider: 'manual', createdAt: new Date(), updatedAt: new Date() };
        }
        const inverseCustomRateKey = `${toCurrency}-${fromCurrency}`;
        if (settings.customRates.hasOwnProperty(inverseCustomRateKey)) {
          const inverseRate = settings.customRates[inverseCustomRateKey];
          if (inverseRate !== 0) {
            return { id: `custom-inverse-${inverseCustomRateKey}`, fromCurrency, toCurrency, rate: 1 / inverseRate, provider: 'manual-inverse', createdAt: new Date(), updatedAt: new Date() };
          }
        }
      }

      if (!rates || typeof rates !== 'object') {
        return null;
      }

      let calculatedApiRate: number | null = null;
      if (fromCurrency === baseCurrency) {
        if (rates.hasOwnProperty(toCurrency)) calculatedApiRate = rates[toCurrency];
      } else if (toCurrency === baseCurrency) {
        if (rates.hasOwnProperty(fromCurrency) && rates[fromCurrency] !== 0) calculatedApiRate = 1 / rates[fromCurrency];
      } else {
        if (rates.hasOwnProperty(toCurrency) && rates.hasOwnProperty(fromCurrency) && rates[fromCurrency] !== 0) {
          calculatedApiRate = rates[toCurrency] / rates[fromCurrency];
        }
      }

      if (calculatedApiRate !== null && !isNaN(calculatedApiRate)) {
        return {
          id: `${fromCurrency}-${toCurrency}-api`,
          fromCurrency, toCurrency, rate: calculatedApiRate, provider: 'api',
          createdAt: lastUpdated || new Date(), updatedAt: lastUpdated || new Date(),
        };
      }
      return null;
    },

    /**
     * Converts an amount between currencies using stored rates
     * @param amount Amount to convert
     * @param fromCurrency Source currency
     * @param toCurrency Target currency
     * @returns Converted amount or null if conversion not possible
     */
    convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number | null => {
      const exchangeRateInfo = get().fx.getExchangeRate(fromCurrency, toCurrency);
      if (exchangeRateInfo && typeof exchangeRateInfo.rate === 'number') {
        return amount * exchangeRateInfo.rate;
      }
      return null;
    },
  };

  console.log('[fxSlice.ts] fxSliceObject defined. Keys:', Object.keys(fxSliceObject));
  if (typeof fxSliceObject.getExchangeRate !== 'function') {
    console.error("[fxSlice.ts] CRITICAL: fxSliceObject.getExchangeRate is NOT a function immediately after definition!");
  }
  if (typeof fxSliceObject.convertAmount !== 'function') {
    console.error("[fxSlice.ts] CRITICAL: fxSliceObject.convertAmount is NOT a function immediately after definition!");
  }
   if (typeof fxSliceObject.loadInitialFXData !== 'function') {
    console.error("[fxSlice.ts] CRITICAL: fxSliceObject.loadInitialFXData is NOT a function immediately after definition!");
  }

  return fxSliceObject;
}; 