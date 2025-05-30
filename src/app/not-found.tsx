import React from 'react';
import Link from 'next/link';
import { Button } from '@/components';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-6 text-gray-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
} 