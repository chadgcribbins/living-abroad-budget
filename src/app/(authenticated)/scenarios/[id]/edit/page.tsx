'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/store';
import { Scenario, ScenarioContent, UpdateScenarioInput } from '@/types/scenario';
import { Household } from '@/types/household';
import { Card, toast } from '@/components/ui'; 
import { HouseholdForm } from '@/components/scenarios/forms/HouseholdForm';

const ScenarioEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const scenarioId = params?.id as string;

  const {
    scenarios,
    activeScenario,
    setActiveScenarioId,
    updateScenario, // Added updateScenario from store
    isLoading,
    error,
    loadScenarios,
  } = useStore(state => ({
    scenarios: state.scenarios,
    activeScenario: state.activeScenario,
    setActiveScenarioId: state.setActiveScenarioId,
    updateScenario: state.updateScenario,
    isLoading: state.isLoading,
    error: state.error,
    loadScenarios: state.loadScenarios,
  }));

  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    if (Object.keys(scenarios).length === 0 && scenarioId) {
      console.log('ScenarioEditPage: No scenarios in store or scenarioId available, loading...');
      loadScenarios(); 
    }
  }, [loadScenarios, scenarios, scenarioId]);

  useEffect(() => {
    if (scenarioId) {
      console.log(`ScenarioEditPage: Setting active scenario ID to: ${scenarioId}`);
      setActiveScenarioId(scenarioId);
    }
  }, [scenarioId, setActiveScenarioId]);

  useEffect(() => {
    if (activeScenario && activeScenario.id === scenarioId) {
      console.log('ScenarioEditPage: Active scenario matches ID:', activeScenario);
      setCurrentScenario(activeScenario);
    } else if (scenarioId && scenarios[scenarioId]) {
      console.log('ScenarioEditPage: Found scenario in map:', scenarios[scenarioId]);
      setCurrentScenario(scenarios[scenarioId]);
       if (!activeScenario || activeScenario.id !== scenarioId) {
         setActiveScenarioId(scenarioId);
       }
    }
    // Add scenarios to dependency array to refetch if direct map access is primary way to get scenario
  }, [activeScenario, scenarioId, scenarios, setActiveScenarioId]); 

  const handleSaveHousehold = async (updatedHouseholdData: Household) => {
    if (!currentScenario) {
      toast({ title: "Error", description: "No current scenario loaded to update.", type: "error" });
      return;
    }
    console.log('ScenarioEditPage: Saving household data:', updatedHouseholdData);
    
    const updates: UpdateScenarioInput = {
      content: {
        ...currentScenario.content,
        household: updatedHouseholdData,
      } as ScenarioContent, // Ensure type is correct for partial content update
    };

    try {
      await updateScenario(currentScenario.id, updates);
      toast({ title: "Success", description: "Household details saved!", type: "success" });
      // Optionally, refetch or update currentScenario state if updateScenario doesn't trigger a refresh
    } catch (e) {
      console.error("Failed to save household details", e);
      toast({ title: "Error", description: `Failed to save: ${e instanceof Error ? e.message : 'Unknown error'}`, type: "error" });
    }
  };

  if (isLoading && !currentScenario && Object.keys(scenarios).length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 text-center">
          <p>Loading scenario data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !currentScenario) { // only show general error if no scenario context
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <p className="text-red-500 text-center">Error loading scenarios: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 text-center">
          <p>Scenario not found or still loading. ID: {scenarioId}</p>
          <button onClick={() => router.push('/scenarios')} className="btn btn-primary mt-4">
            Back to Scenarios List
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Scenario: {currentScenario.name}</h1>
          {currentScenario.description && (
            <p className="text-lg text-gray-600 mt-2">{currentScenario.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">ID: {currentScenario.id}</p>
        </div>

        {/* Placeholder for Wizard Steps Navigation */}
        <div className="mb-8 p-4 bg-base-200 rounded-lg">
          <p className="text-center font-semibold">Wizard Navigation Placeholder</p>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Step 1: Household Details</h2>
          {currentScenario.content.household ? (
            <HouseholdForm 
              initialData={currentScenario.content.household} 
              onSave={handleSaveHousehold} 
            />
          ) : (
            <p>Loading household data or household data is missing...</p>
          )}
        </Card>

        <div className="mt-12 flex justify-between">
          <button className="btn btn-outline" disabled>Previous Step</button> {/* Disabled for first step */}
          <button className="btn btn-primary">Next Step</button>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default ScenarioEditPage; 