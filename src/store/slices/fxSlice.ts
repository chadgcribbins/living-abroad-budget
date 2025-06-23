import { StateCreator } from 'zustand';
import { RootState, FXState, FXSettings, ExchangeRates } from '../types';
import { fetchLatestRates } from '@/services/fx'; // Uncommented API call
import { CurrencyCode } from '@/types/base';
import { ExchangeRate } from '@/types/fx'; // Corrected import

export const DEFAULT_FX_SETTINGS: FXSettings = {
  baseCurrency: CurrencyCode.USD,
  displayCurrency: CurrencyCode.USD,
  manualRates: false,
  customRates: {},
  sensitivityRange: [-0.1, 0.1], // Restored to original value from commit 1f2baaf
};

const createFXSlice: StateCreator<
  RootState,
  [], 
  [], 
  FXState // Changed from { fx: FXState } to just FXState based on the old structure
> = (set, get) => { // Renamed _get to get as it's used
  // Creating FX slice for currency conversion
  const fxSliceObject: FXState = { // Ensuring this object matches FXState
    settings: DEFAULT_FX_SETTINGS,
    rates: {} as ExchangeRates, // Explicitly using ExchangeRates
    isLoading: false,
    error: null,
    lastUpdated: null,

    loadInitialFXData: async () => {
      // Load initial exchange rate data from API
      // isLoading is set on the fx slice, which is part of RootState
      set(state => ({ ...state, fx: { ...state.fx, isLoading: true, error: null } })); 
      try {
        // Access settings via get().fx.settings as get() returns RootState
        const baseCurrency = get().fx.settings?.baseCurrency || CurrencyCode.USD;
        const apiResponse = await fetchLatestRates(baseCurrency);
        
        if (apiResponse && apiResponse.rates) {
          set(state => ({ 
            ...state,
            // Update fx portion of the RootState
            fx: {
              ...state.fx,
              rates: apiResponse.rates as ExchangeRates,
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
          // Update fx portion of the RootState
          fx: {
            ...state.fx,
            isLoading: false, 
            error: new Error(errorMessage), 
            rates: {} as ExchangeRates
          }
        }));
      }
    },
    updateFXSettings: (newSettings: Partial<FXSettings>) => {
      // Update FX settings
      set(state => ({ 
        ...state,
        fx: {
          ...state.fx,
          settings: { ...(get().fx.settings || DEFAULT_FX_SETTINGS), ...newSettings }, 
        }
      }));
    },
    addExchangeRate: (rate: ExchangeRate) => {
      console.log('[fxSlice.ts] addExchangeRate called (Original Implementation) with:', rate);
      // Access settings and rates via get().fx as get() returns RootState
      const baseCurrency = get().fx.settings?.baseCurrency || CurrencyCode.USD;
      
      let targetCurrencyCode: CurrencyCode | null = null;
      let rateToBase: number | null = null;

      if (rate.fromCurrency === baseCurrency) {
        targetCurrencyCode = rate.toCurrency;
        rateToBase = rate.rate;
      } else if (rate.toCurrency === baseCurrency) {
        targetCurrencyCode = rate.fromCurrency;
        if (rate.rate === 0) {
          console.error("[fxSlice.ts] addExchangeRate: Cannot add exchange rate with a zero inverse rate.");
          return; // Exit if rate is zero to avoid division by zero
        }
        rateToBase = 1 / rate.rate;
      } else {
        console.warn(`[fxSlice.ts] addExchangeRate: Rate ${rate.fromCurrency}-${rate.toCurrency} is not against the base currency ${baseCurrency}. Ignoring.`);
        return; // Exit if not related to base currency
      }

      if (targetCurrencyCode && rateToBase !== null) {
        set((state) => ({
          ...state,
          // Update fx portion of the RootState
          fx: {
            ...state.fx,
            rates: {
              ...(state.fx.rates || {}), // Ensure existing rates are preserved
              [targetCurrencyCode as string]: rateToBase, // Add/update the specific rate
            },
            lastUpdated: new Date(), // Update timestamp
          }
        }));
      } else {
        console.warn('[fxSlice.ts] addExchangeRate: targetCurrencyCode or rateToBase was null. No update performed.');
      }
    },
    updateExchangeRate: (currencyCodeToUpdate: string, newRateUpdate: Partial<{ rate: number }>) => {
      console.log('[fxSlice.ts] updateExchangeRate called (Original Implementation) for:', currencyCodeToUpdate, 'with rate:', newRateUpdate);
      if (typeof newRateUpdate.rate === 'number') {
        set((state) => {
          // Access rates via state.fx.rates as state is RootState here
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
          return state; // Return current state if currency code not found
        });
      } else {
        console.warn("[fxSlice.ts] updateExchangeRate: newRateUpdate did not contain a valid rate property.");
      }
    },
    getExchangeRate: (fromCurrency: CurrencyCode, toCurrency: CurrencyCode): ExchangeRate | null => {
      console.log('[fxSlice.ts] getExchangeRate called (Original Implementation).');
      const currentFXState = get().fx; // Correct: get() returns RootState, so access .fx
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
        console.warn('[fxSlice.ts] getExchangeRate: Rates not available or not an object.');
        return null;
      }

      let calculatedApiRate: number | null = null;
      // Ensure rates are treated as ExchangeRates (Record<CurrencyCode, number>)
      const typedRates = rates as ExchangeRates;

      if (fromCurrency === baseCurrency) {
        if (typedRates.hasOwnProperty(toCurrency)) calculatedApiRate = typedRates[toCurrency];
      } else if (toCurrency === baseCurrency) {
        if (typedRates.hasOwnProperty(fromCurrency) && typedRates[fromCurrency] !== 0) calculatedApiRate = 1 / typedRates[fromCurrency];
      } else {
        if (typedRates.hasOwnProperty(toCurrency) && typedRates.hasOwnProperty(fromCurrency) && typedRates[fromCurrency] !== 0) {
          calculatedApiRate = typedRates[toCurrency] / typedRates[fromCurrency];
        }
      }

      if (calculatedApiRate !== null && !isNaN(calculatedApiRate)) {
        return {
          id: `${fromCurrency}-${toCurrency}-api`,
          fromCurrency, toCurrency, rate: calculatedApiRate, provider: 'api',
          createdAt: lastUpdated || new Date(), updatedAt: lastUpdated || new Date(),
        };
      }
      console.warn(`[fxSlice.ts] getExchangeRate: Could not determine rate for ${fromCurrency} to ${toCurrency}`);
      return null;
    },
    convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number | null => {
      console.log('[fxSlice.ts] convertAmount called (Original Implementation).');
      // get().fx.getExchangeRate would be incorrect as getExchangeRate is part of the same slice object.
      // It needs to call itself, or be called via get().fx.getExchangeRate if it were on a *different* slice.
      // Correct way: use `this.getExchangeRate` if this were a class, or call it directly if it's in scope,
      // or ensure `get().fx` provides the methods.
      // Since `createFXSlice` returns the object with methods, `get().fx.getExchangeRate` is the way.
      const exchangeRateInfo = get().fx.getExchangeRate(fromCurrency, toCurrency);
      if (exchangeRateInfo && typeof exchangeRateInfo.rate === 'number') {
        return amount * exchangeRateInfo.rate;
      }
      return null;
    },
  };

  console.log('[fxSlice.ts] Restored fxSliceObject defined. Keys:', Object.keys(fxSliceObject));

  return fxSliceObject; // Returning the object directly
};

export { createFXSlice }; 