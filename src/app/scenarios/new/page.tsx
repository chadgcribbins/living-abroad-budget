'use client';

import React, { useState } from 'react';
import { PageContainer, Button, Card, Input } from '@/components';
import Link from 'next/link';

export default function NewScenarioPage() {
  const [scenarioName, setScenarioName] = useState('');

  const handleCreateScenario = () => {
    // This will be implemented in a future task when we have the scenario storage mechanism
    console.log('Creating scenario:', scenarioName);
    // For now, just redirect to scenarios
    window.location.href = '/scenarios';
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <Link href="/scenarios" className="text-sm flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Scenarios
        </Link>
        <h1 className="text-3xl font-bold">Create New Scenario</h1>
      </div>
      
      <Card className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="scenarioName" className="block text-sm font-medium mb-2">
            Scenario Name
          </label>
          <Input
            id="scenarioName"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="My New Scenario"
            className="w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Link href="/scenarios">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button 
            onClick={handleCreateScenario}
            disabled={!scenarioName.trim()}
          >
            Create Scenario
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
} 