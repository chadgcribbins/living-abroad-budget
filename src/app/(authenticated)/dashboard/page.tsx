"use client";

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ScenarioList, ScenarioListProps } from '@/components/scenarios/ScenarioList';
import { Button } from '@/components/ui';
import { useStore } from '@/store';
import { CountryCode } from '@/types/base';
import { IconPlus } from '@tabler/icons-react';

// Metadata might be added later if needed specifically for this page
// export const metadata: Metadata = {
//   title: 'Scenario Dashboard - Living Abroad Budget',
//   description: 'Manage and compare your international living scenarios.',
// };

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { 
    scenarioList, 
    loadScenarios, 
    createTemplateScenario, 
    setActiveScenarioId,
    isLoading,
    error
  } = useStore(state => ({
    scenarioList: state.scenarioList,
    loadScenarios: state.loadScenarios,
    createTemplateScenario: state.createTemplateScenario,
    setActiveScenarioId: state.setActiveScenarioId,
    isLoading: state.isLoading,
    error: state.error
  }));

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // console.log('DashboardPage: useEffect loadScenarios'); // Optional: keep for debugging
    loadScenarios();
  }, [loadScenarios]);

  const handleCreateNewScenario = async () => {
    const newScenarioId = await createTemplateScenario(
      'New Scenario', 
      CountryCode.GB, // Default origin
      CountryCode.PT  // Default destination
    );
    if (newScenarioId) {
      setActiveScenarioId(newScenarioId);
      router.push(`/scenario/${newScenarioId}/edit`); 
    } else {
      console.error("Failed to create new scenario");
      // Consider adding user-facing error feedback here (e.g., toast notification)
    }
  };
  
  const handlePlaceholderAction = async (...args: unknown[]) => {
    console.warn("Placeholder action called from dashboard", ...args);
    alert("This functionality is not yet fully implemented on the dashboard.");
    // return Promise.resolve(); // If the prop expects a promise
  };

  // Optional: Add handleDeleteScenario and handleDuplicateScenario handlers later

  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 md:px-8 flex justify-center items-center">
          <p>Loading scenarios...</p> {/* Replace with a spinner component if available */}
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
          <p className="text-red-500">Error loading scenarios: {error}</p>
          <Button onClick={loadScenarios} variant="outline" className="btn-outline mt-4">Try Again</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const scenarioListProps: ScenarioListProps = {
    scenarios: scenarioList,
    // onSelectScenario: handleScenarioSelect, // Removed as ScenarioCard handles navigation
    onCreateScenario: handlePlaceholderAction, // Stub added
    onDeleteScenario: handlePlaceholderAction, // Stub added
    onDuplicateScenario: handlePlaceholderAction, // Stub added
    onRenameScenario: handlePlaceholderAction, // Stub added
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Scenario Dashboard</h1>
          <Button onClick={handleCreateNewScenario} variant="primary" className="btn-primary">
            <IconPlus size={20} className="mr-2" />
            New Scenario
          </Button>
        </div>

        {scenarioList.length > 0 ? (
          <ScenarioList {...scenarioListProps} />
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-lg shadow">
            <p className="text-xl text-gray-500 mb-4">No scenarios yet.</p>
            <p className="mb-6">Start planning your international move by creating your first scenario.</p>
            <Button onClick={handleCreateNewScenario} variant="primary" size="lg" className="btn-primary">
              Create Your First Scenario
            </Button>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-4">Utility Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => alert('Import Scenarios (JSON) - Functionality to be implemented')}
              variant="outline"
              className="btn-outline"
            >
              Import Scenarios
            </Button>
            <Button 
              onClick={() => alert('Export All Scenarios (JSON) - Functionality to be implemented')}
              variant="outline"
              className="btn-outline"
            >
              Export All Scenarios
            </Button>
             <Link href="/settings" passHref> {/* Assuming /settings route will exist */}
              <Button variant="outline" className="w-full btn-outline">
                Application Settings
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage; 