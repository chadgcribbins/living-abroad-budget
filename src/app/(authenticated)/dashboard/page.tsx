import React from 'react';
import { Dashboard } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Living Abroad Budget',
  description: 'View your budget comparison dashboard',
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Budget Dashboard</h1>
      <Dashboard />
    </div>
  );
} 