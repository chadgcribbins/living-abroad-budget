'use client';

import React from 'react';
import { Button } from '@/components';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-6 text-gray-600">
          We encountered an error while processing your request. Please try again or contact support if the issue persists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="ghost">
            Go Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 border rounded bg-red-50 text-left">
            <p className="font-semibold mb-2">Error details:</p>
            <pre className="text-xs overflow-auto text-red-600">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 