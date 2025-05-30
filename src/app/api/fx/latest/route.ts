import { NextRequest, NextResponse } from 'next/server';
import { CurrencyCode } from '@/types/base';

// OpenExchangeRates API endpoint
const OXR_BASE_URL = 'https://openexchangerates.org/api';

/**
 * GET handler for fetching latest exchange rates
 * @param request NextRequest object
 * @returns NextResponse with exchange rates
 */
export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENEXCHANGERATES_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenExchangeRates API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Get base currency from query params or default to USD
    const searchParams = request.nextUrl.searchParams;
    const base = searchParams.get('base') || CurrencyCode.USD;
    
    // Note: Free tier of OpenExchangeRates only allows USD as base
    const url = `${OXR_BASE_URL}/latest.json?app_id=${apiKey}&base=USD`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenExchangeRates API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    // If base is not USD and we have USD as base from the API,
    // we need to convert all rates to the requested base
    if (base !== CurrencyCode.USD) {
      const baseRate = data.rates[base];
      
      if (baseRate) {
        // Convert all rates to the requested base
        const newRates: Record<string, number> = {};
        
        Object.entries(data.rates).forEach(([currency, rate]) => {
          newRates[currency] = Number(((rate as number) / baseRate).toFixed(6));
        });
        
        // Set the base currency rate to 1
        newRates[base] = 1;
        
        // Return the converted rates
        return NextResponse.json({
          ...data,
          base,
          rates: newRates,
          note: 'Base currency converted from USD (OpenExchangeRates free tier limitation)'
        });
      }
    }
    
    // Return the original response if base is USD
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error fetching exchange rates' },
      { status: 500 }
    );
  }
} 