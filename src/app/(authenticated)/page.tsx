import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Living Abroad Budget',
  description: 'Plan your international move with our budgeting tools',
};

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Living Abroad Budget</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create a Profile</h2>
            <p>Set up your household information and preferences.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/profile" className="btn btn-primary">Go to Profile</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Budget Scenarios</h2>
            <p>Create and compare budgets for different countries.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/scenarios" className="btn btn-primary">View Scenarios</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Dashboard</h2>
            <p>See a comparison of your budget across countries.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title">Getting Started</h2>
          <p>To make the most of Living Abroad Budget:</p>
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li>Set up your household profile with current location</li>
            <li>Create a budget scenario for your destination country</li>
            <li>View the comparison dashboard to understand cost differences</li>
          </ol>
          <div className="card-actions justify-end mt-4">
            <Link href="/profile" className="btn">Start Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 