'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Define params type for better type safety
type ScenarioParams = {
  id: string;
};

export default function ScenarioPage() {
  // Get the scenario ID from the route parameters
  const params = useParams() as ScenarioParams;
  const { id } = params;

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Link href="/scenarios" className="btn btn-ghost btn-sm">
          ← Back to Scenarios
        </Link>
      </div>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Scenario: {id}</h1>
          <p className="my-4">
            This is a placeholder for the scenario details page. Dynamic ID: {id}
          </p>
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary">Edit Scenario</button>
            <button className="btn btn-outline btn-error">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
} 