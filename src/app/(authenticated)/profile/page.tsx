import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Living Abroad Budget',
  description: 'Manage your profile and preferences',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Household Information</h2>
          <p>Manage your household details, preferences, and settings.</p>
          {/* Profile form will be added in a future task */}
        </div>
      </div>
    </div>
  );
} 