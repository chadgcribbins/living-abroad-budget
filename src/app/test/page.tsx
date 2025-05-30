'use client';

import Link from 'next/link';
import React from 'react';
import { TestComponent } from '@/components';

export default function TestPage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen text-gray-800">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-6">Use this page for testing components or features in isolation.</p>
      <TestComponent />
    </div>
  );
} 