'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WizardExample from './wizard-example';

export default function CreateScenarioPage() {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally save the scenario to the database
    // For now, just navigate back to scenarios list
    router.push('/scenarios');
  };

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <Link href="/scenarios" className="btn btn-ghost btn-sm">
          ← Back to Scenarios
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create New Scenario</h1>
      
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Scenario Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter a name for this scenario"
                className="input input-bordered"
                required
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Describe this budget scenario"
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Destination Country</span>
              </label>
              <select className="select select-bordered" defaultValue="">
                <option value="" disabled>Select Destination Country</option>
                <option value="uk">United Kingdom</option>
                <option value="fr">France</option>
                <option value="de">Germany</option>
                <option value="jp">Japan</option>
              </select>
            </div>
            
            <div className="card-actions justify-end mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => router.push('/scenarios')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Scenario
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Wizard navigation example */}
      <WizardExample />
    </div>
  );
} 