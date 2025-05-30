import { NextRequest, NextResponse } from 'next/server';
import { CurrencyCode } from '@/types/base';

// OpenExchangeRates API endpoint
const OXR_BASE_URL = 'https://openexchangerates.org/api';

interface RouteParams {
  params: {
    date: string;
  };
}

/**
 * Validates a date string in YYYY-MM-DD format
 * @param dateStr Date string to validate
 * @returns True if valid, false otherwise
 */
function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateStr);
}

/**
 * GET handler for fetching historical exchange rates
 * @param request NextRequest object
 * @param params Route params containing the date
 * @returns NextResponse with historical exchange rates
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { date } = params;
  
  // Validate date format (YYYY-MM-DD)
  if (!isValidDateFormat(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Please use YYYY-MM-DD.' },
      { status: 400 }
    );
  }

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
    const url = `${OXR_BASE_URL}/historical/${date}.json?app_id=${apiKey}&base=USD`;
    
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
    console.error(`Error fetching historical rates for ${date}:`, error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error fetching historical exchange rates' },
      { status: 500 }
    );
  }
} 