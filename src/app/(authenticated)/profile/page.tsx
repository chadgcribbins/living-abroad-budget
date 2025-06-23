import React from 'react';
import { Metadata } from 'next';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
  title: 'Profile - Living Abroad Budget',
  description: 'Manage your profile and preferences',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Profile</h1>
      <div className="card bg-base-200 shadow-xl max-w-4xl mx-auto">
        <div className="card-body p-6 md:p-8">
          <h2 className="card-title text-2xl mb-2">Household Information</h2>
          <p className="mb-6 text-base-content/80">
            Complete your profile to enable all features of the application.
            Your origin and destination countries will help set defaults throughout the app.
          </p>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
} 