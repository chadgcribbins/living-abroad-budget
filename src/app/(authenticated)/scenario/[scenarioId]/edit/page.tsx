'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScenarios } from '@/store/hooks';
import { PageContainer } from '@/components/layout';
import { IncomeForm } from '@/components/income';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';

interface ScenarioEditPageProps {
  params: {
    scenarioId: string;
  };
}

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

const ScenarioEditPage: React.FC<ScenarioEditPageProps> = ({ params }) => {
  const router = useRouter();
  const { 
    activeScenario, 
    setActiveScenarioId, 
    loadScenarios 
  } = useScenarios();
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load scenarios if not already loaded
    if (!activeScenario) {
      loadScenarios();
    }
    // Set active scenario
    setActiveScenarioId(params.scenarioId);
  }, [params.scenarioId, setActiveScenarioId, loadScenarios, activeScenario]);

  if (!activeScenario) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading scenario...</p>
        </div>
      </PageContainer>
    );
  }

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: 'mdi:view-dashboard' },
    { id: 'income', label: 'Income', icon: 'mdi:cash-multiple' },
    { id: 'housing', label: 'Housing', icon: 'mdi:home', disabled: true },
    { id: 'transportation', label: 'Transportation', icon: 'mdi:car', disabled: true },
    { id: 'education', label: 'Education', icon: 'mdi:school', disabled: true },
    { id: 'healthcare', label: 'Healthcare', icon: 'mdi:hospital', disabled: true },
    { id: 'lifestyle', label: 'Lifestyle', icon: 'mdi:shopping', disabled: true },
    { id: 'analysis', label: 'Analysis', icon: 'mdi:chart-line', disabled: true },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleBack = () => {
    router.push('/scenarios');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Scenario Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium">{activeScenario.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="font-medium">
                    {new Date(activeScenario.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Origin Country</dt>
                  <dd className="font-medium">{activeScenario.content.originCountry}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Destination Country</dt>
                  <dd className="font-medium">{activeScenario.content.destinationCountry}</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-base-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Completion Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete each section to build your comprehensive relocation budget.
              </p>
              <div className="space-y-2">
                {tabs.slice(1, -1).map((tab) => (
                  <div key={tab.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Icon 
                        icon={tab.icon} 
                        className={`text-xl ${tab.disabled ? 'text-gray-400' : 'text-primary'}`} 
                      />
                      <span className={tab.disabled ? 'text-gray-500' : ''}>{tab.label}</span>
                    </div>
                    <span className={`text-sm ${tab.disabled ? 'text-gray-400' : 'text-green-600'}`}>
                      {tab.disabled ? 'Not Started' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'income':
        return (
          <IncomeForm 
            scenarioId={params.scenarioId} 
            onSave={() => {
              // Optionally refresh or show success message
              console.log('Income data saved');
            }}
          />
        );
      
      default:
        return (
          <div className="bg-base-100 p-8 rounded-lg text-center">
            <Icon icon="mdi:construction" className="text-6xl text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-500">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          <Icon icon="mdi:arrow-left" className="mr-2" />
          Back to Scenarios
        </Button>
        
        <h1 className="text-3xl font-bold">{activeScenario.name}</h1>
        <p className="text-gray-600 mt-2">
          Build your complete financial picture for moving from {activeScenario.content.originCountry} to {activeScenario.content.destinationCountry}
        </p>
      </div>

      {/* Custom tabs implementation */}
      <div className="tabs tabs-boxed mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''} ${
              tab.disabled ? 'tab-disabled opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={tab.disabled}
          >
            <Icon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </PageContainer>
  );
};

export default ScenarioEditPage; 