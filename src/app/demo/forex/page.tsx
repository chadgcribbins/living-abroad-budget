'use client';

import { CurrencyConverter } from '@/components/CurrencyConverter';
import { CurrencyCode } from '@/types/base';
import Link from 'next/link';

export default function ForexDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Foreign Exchange Rate Demo</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          This demo demonstrates the integration with OpenExchangeRates API for currency conversion.
          It showcases the following features:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Fetching real-time exchange rates from OpenExchangeRates</li>
          <li>Converting between different currencies</li>
          <li>Displaying formatted currency values</li>
          <li>Managing exchange rate state in the application</li>
          <li>Handling loading and error states</li>
        </ul>
        <p className="text-sm text-gray-600">
          Note: To use this feature in your own environment, you&apos;ll need to set the
          OPENEXCHANGERATES_API_KEY environment variable with your API key from{' '}
          <a 
            href="https://openexchangerates.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            OpenExchangeRates
          </a>
          .
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">USD to EUR Converter</h2>
          <CurrencyConverter 
            initialAmount={100} 
            initialFromCurrency={CurrencyCode.USD} 
            initialToCurrency={CurrencyCode.EUR} 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">GBP to EUR Converter</h2>
          <CurrencyConverter 
            initialAmount={100} 
            initialFromCurrency={CurrencyCode.GBP} 
            initialToCurrency={CurrencyCode.EUR} 
          />
        </div>
      </div>
      
      <div className="mt-12 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Technical Implementation</h2>
        <p className="mb-3">
          The FX integration includes the following components:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>A dedicated FX service for API communication</li>
          <li>Next.js API routes that proxy OpenExchangeRates requests</li>
          <li>A Zustand store slice for managing exchange rate state</li>
          <li>A custom React hook (useFX) for easy access to FX functionality</li>
          <li>Utility functions for currency conversion and formatting</li>
        </ul>
      </div>
    </div>
  );
} 