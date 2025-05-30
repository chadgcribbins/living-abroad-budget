'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12">
      <div className="card bg-error text-error-content shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl">Something went wrong!</h2>
          <p className="mt-2">
            We encountered an error while trying to display this page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-base-300 text-base-content p-4 rounded-box mt-4 overflow-auto">
              <p className="font-mono text-sm">{error.message}</p>
            </div>
          )}
          <div className="card-actions justify-end mt-6">
            <button
              onClick={() => router.push('/')}
              className="btn btn-outline"
            >
              Go Home
            </button>
            <button
              onClick={() => reset()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 