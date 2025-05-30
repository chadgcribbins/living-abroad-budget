import React from 'react';

export default function AuthenticatedLoading() {
  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <h2 className="text-2xl font-semibold mt-4">Loading...</h2>
        <p className="text-base-content/70 mt-2">
          Please wait while we prepare your content.
        </p>
      </div>
    </div>
  );
} 