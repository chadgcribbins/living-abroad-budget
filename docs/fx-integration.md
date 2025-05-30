# FX Rate API Integration

This document explains how to set up and use the Foreign Exchange Rate API integration in the Living Abroad Budget application.

## Overview

The application integrates with OpenExchangeRates to provide real-time currency conversion functionality. This enables users to:

- View exchange rates between different currencies
- Convert monetary values between currencies
- Perform FX sensitivity analysis (by manually adjusting settings and rates)
- Track historical exchange rate trends (via API, though UI for this might be separate)

## Setup

### 1. API Key

Sign up for a free API key at [OpenExchangeRates](https://openexchangerates.org/signup/free).

### 2. Environment Variables

Create a `.env` file (or `.env.local`) in the root of your project with the following variable:

```env
OPENEXCHANGERATES_API_KEY=your_api_key_here
```
*(Note: Ensure your Next.js server is restarted after adding/changing this variable.)*

### 3. Development Server

Restart your development server to apply the changes if it was running when you modified the `.env` file.

## Architecture

The FX integration is built with the following components:

### 1. FX Service (`src/services/fx.ts`)

Provides utility functions for:
- Fetching exchange rates from OpenExchangeRates via our API routes.

### 2. API Routes

- `/api/fx/latest` - Get the latest exchange rates based on a base currency.
- `/api/fx/historical/[date]` - Get historical exchange rates for a specific date (functionality exists in the service, route might be for this).

These routes act as proxies to the OpenExchangeRates API, handling authentication and data transformation.

### 3. Zustand Store Slice (`src/store/slices/fxSlice.ts`)

Manages FX-related state, including:
- Current exchange rates (`rates`)
- FX settings like base and display currencies, manual rate mode, custom rates, and sensitivity range (`settings`)
- Loading and error states (`isLoading`, `error`)
- Timestamp of the last update (`lastUpdated`)
- Actions: `loadInitialFXData`, `updateFXSettings`, `addExchangeRate`, `updateExchangeRate`
- Getter/conversion functions: `getExchangeRate`, `convertAmount`

### 4. React Hook (`src/hooks/useFX.ts`)

A custom hook that provides easy access to FX functionality in React components. It typically exposes:

```typescript
const {
  settings, // { baseCurrency, displayCurrency, manualRates, customRates, sensitivityRange }
  rates,
  isLoading,
  error,
  lastUpdated,
  loadInitialFXData, // Call this to fetch/refresh rates
  updateFXSettings,  // Used to change base/display currency, enable manual rates, set custom rates etc.
  getExchangeRate,   // Gets detailed rate info between two currencies
  convertAmount,     // Directly converts an amount
} = useFX();
```

### 5. Demo Component (`src/components/CurrencyConverter.tsx`)

A reusable component that demonstrates the FX functionality, including displaying rates and converting amounts.

## Usage Examples

### Basic Currency Conversion

```tsx
import { useFX } from '@/hooks/useFX';
import { CurrencyCode } from '@/types/base';
import { formatCurrency } from '@/utils/currency'; // Assuming a utility for display

function PriceDisplay({ amount, fromCurrency, toCurrency }) {
  const { convertAmount, settings } = useFX();
  
  const convertedAmount = convertAmount(amount, fromCurrency, toCurrency);
  const displayCurrency = settings?.displayCurrency || toCurrency;
  
  return (
    <div>
      <p>Original: {formatCurrency(amount, fromCurrency)}</p>
      <p>Converted: {convertedAmount !== null ? formatCurrency(convertedAmount, displayCurrency) : 'N/A'}</p>
    </div>
  );
}
```

### Refreshing Exchange Rates

```tsx
import { useFX } from '@/hooks/useFX';

function RateRefresher() {
  const { loadInitialFXData, isLoading, lastUpdated } = useFX();
  
  return (
    <div>
      <button onClick={() => loadInitialFXData()} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh Rates'}
      </button>
      {lastUpdated && <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p>}
    </div>
  );
}
```

### FX Sensitivity Analysis (Manual Rate Adjustment)

To perform sensitivity analysis, you would use `updateFXSettings` to enable `manualRates` and provide `customRates`.

```tsx
import { useFX } from '@/hooks/useFX';
import { CurrencyCode } from '@/types/base';
import { formatCurrency } // Assuming a utility

function SensitivityAnalysis({ amount }) {
  const { 
    convertAmount, 
    updateFXSettings,
    settings
  } = useFX();
  
  const runAnalysis = async () => {
    const originalSettings = JSON.parse(JSON.stringify(settings)); // Deep copy to restore

    // Enable manual rates and set a custom rate for analysis
    updateFXSettings({
      manualRates: true,
      customRates: {
        ...settings?.customRates, // Preserve other custom rates
        [`${CurrencyCode.USD}-${CurrencyCode.EUR}`]: 0.95, // Example: 5% stronger USD for EUR
      },
    });
    // Allow state to update if updateFXSettings is async or triggers re-renders
    // For simplicity, direct conversion might use the new settings if fxSlice updates synchronously
    // or use a small delay/effect if needed.
    
    // Important: convertAmount will now use the custom rate if applicable
    const strongerUSDRate = convertAmount(amount, CurrencyCode.USD, CurrencyCode.EUR);
    console.log('With 5% stronger USD for EUR:', strongerUSDRate);

    updateFXSettings({
      manualRates: true, // Keep manual rates or adjust as needed
      customRates: {
        ...settings?.customRates,
        [`${CurrencyCode.USD}-${CurrencyCode.EUR}`]: 0.85, // Example: 5% weaker USD for EUR
      },
    });
    const weakerUSDRate = convertAmount(amount, CurrencyCode.USD, CurrencyCode.EUR);
    console.log('With 5% weaker USD for EUR:', weakerUSDRate);
    
    // Reset to original settings after analysis
    // updateFXSettings(originalSettings); // Be careful with full object restore if settings structure is complex
                                        // Prefer restoring specific fields changed for analysis
    updateFXSettings({ manualRates: originalSettings.manualRates, customRates: originalSettings.customRates });


    return { strongerUSDRate, weakerUSDRate };
  };
  
  return (
    <button onClick={runAnalysis}>Run EUR/USD Sensitivity Test</button>
    // Display results...
  );
}
```

## Testing Strategy

The FX functionality is tested to ensure its reliability:

- **Unit Tests for `fxSlice.ts`**:
    - Located in `src/store/slices/__tests__/fxSlice.test.ts`.
    - Utilizes Jest as the testing framework.
    - **Mocking**: The `fetchLatestRates` function from `src/services/fx.ts` is mocked to provide controlled API responses during tests, preventing actual network calls.
    - **Coverage**: Tests cover:
        - Initial state of the slice.
        - `loadInitialFXData` action: for successful API calls, failed API calls, and usage of custom base currency from settings.
        - `updateFXSettings` action: ensuring settings are updated correctly and merged with existing ones.
        - `getExchangeRate` function: for various scenarios including conversion from/to base currency, cross-currency conversion, same currency conversion, missing rates, and usage of manual/custom rates.
        - `convertAmount` function: verifying correct calculation based on `getExchangeRate` and handling of missing rates.
- **Jest Configuration**:
    - `jest.config.mjs` is configured with `moduleNameMapper` to correctly resolve path aliases (e.g., `@/services/fx`) used in imports.
- **Component Tests**:
    - While `TestComponent.test.tsx` exists and ensures the general test setup is working, specific component tests for `CurrencyConverter.tsx` would typically involve:
        - Rendering the component with a mocked `useFX` hook or within a test `StoreProvider`.
        - Verifying that amounts are displayed and converted correctly based on the mocked FX state.
        - Testing user interactions if the component has buttons for refreshing rates, etc.

## API Rate Limits

With the free tier of OpenExchangeRates, there are some limitations:

- 1,000 requests per month.
- Base currency locked to USD by their API (our backend API route `/api/fx/latest` can take a `base` query parameter, and `fxSlice.ts` can fetch rates for a non-USD base by passing it to our API route, which then performs necessary calculations if OpenExchangeRates only returns USD-based rates).
- No direct access to their time-series endpoint (we can simulate this by making calls to their historical data endpoint for different dates if needed, managed by our backend).

For production use with higher volumes, consider upgrading to a paid plan.

## Troubleshooting

### Common Issues

1.  **"Error fetching exchange rates"** or rates not loading:
    - Check that your `OPENEXCHANGERATES_API_KEY` is correctly set in the `.env` file and that the server was restarted.
    - Verify network connectivity.
    - Check the OpenExchangeRates dashboard for API usage and potential rate limit issues.
    - Ensure the `/api/fx/latest` route is functioning and can access the API key.

2.  **Getting stale exchange rates** (during a session):
    - The application fetches rates on initial load (e.g., via `loadInitialFXData` in a top-level component or effect).
    - To get the absolute latest rates during a session, `loadInitialFXData()` can be called again (e.g., via a refresh button).
    - Note: The `fx` slice is currently *not* persisted to localStorage to avoid issues with stale persisted functions. Settings might be considered for persistence if needed, but rates should generally be fresh.

3.  **Incorrect conversions between non-USD currencies**:
    - Verify that the `getExchangeRate` logic in `fxSlice.ts` correctly calculates cross-currency rates (e.g., EUR to GBP via USD).
    - Ensure the API route `/api/fx/latest` correctly handles requests for non-USD base currencies if OpenExchangeRates only provides USD-based data directly. 