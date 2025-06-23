'use client'; // If you plan to add client-side interactions, otherwise optional

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui'; // Assuming you have a Card component

// Optional: Add metadata if needed
// export const metadata = {
//   title: 'Settings - Living Abroad Budget',
//   description: 'Manage your application settings and preferences.',
// };

const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Application Settings</h1>
          
          <Card className="p-6 md:p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                This settings page is currently under construction. 
                Here you will be able to manage your preferences, 
                API keys, and other application configurations.
              </p>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage; 