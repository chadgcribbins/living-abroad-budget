import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 mb-4 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <h2 className="text-xl font-semibold">Loading...</h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare your content.</p>
      </div>
    </div>
  );
} 