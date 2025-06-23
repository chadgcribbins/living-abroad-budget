'use client';

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
export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({}) => {
  console.log('[CurrencyConverter.tsx] SIMPLIFIED - Component rendering.');
  
  // Call useFX but don't use its return values for now
  try {
    const fxStuff = useFX(); 
    console.log('[CurrencyConverter.tsx] SIMPLIFIED - useFX() called. Typeof fxStuff:', typeof fxStuff, 'Value:', fxStuff);
    if (fxStuff && typeof fxStuff.convertAmount === 'function') {
      console.log('[CurrencyConverter.tsx] SIMPLIFIED - fxStuff.convertAmount is a function.');
    } else {
      console.warn('[CurrencyConverter.tsx] SIMPLIFIED - fxStuff.convertAmount is NOT a function.');
    }
  } catch (e) {
    console.error('[CurrencyConverter.tsx] SIMPLIFIED - Error calling useFX():', e);
  }
  
  return (
    <div className="p-4 bg-yellow-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Currency Converter (Simplified for Build Test)</h2>
      <p>This is a minimal version to test the build.</p>
    </div>
  );
}; 