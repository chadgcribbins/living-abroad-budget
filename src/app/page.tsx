"use client";

import { NextPage } from 'next';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScenarioList } from '@/components/scenarios';
import { useScenarioStore } from '@/store/hooks';
import { useStore } from '@/store';
import { CountryCode } from '@/types/base';
import { toast } from '@/components/ui';

// Metadata can't be exported from client components, so we need to move this to layout.tsx
// export const metadata: Metadata = {
//   title: 'Living Abroad Budget',
//   description: 'A modern budgeting platform for planning international moves',
// };

const Page: NextPage = () => {
  const router = useRouter();
  const { 
    scenarioList,
    loadScenarios,
    createTemplateScenario,
    deleteScenario,
    duplicateScenario,
    updateScenario,
    importScenarios,
  } = useScenarioStore();
  
  const [isLoading, setIsLoading] = useState(true);

  // Add a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load scenarios only once on component mount
  useEffect(() => {
    console.log('Page: Loading scenarios on component mount');
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Before loadScenarios - store state:', useStore.getState());
        await loadScenarios();
        console.log('After loadScenarios - store state:', useStore.getState());
        console.log('Page: Scenarios loaded successfully');
      } catch (error) {
        console.error('Page: Error loading scenarios:', error);
        toast({
          title: 'Error',
          description: 'Failed to load scenarios',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [loadScenarios]);

  const handleCreateScenario = async (data: {
    name: string;
    description: string;
    originCountry: CountryCode;
    destinationCountry: CountryCode;
  }) => {
    try {
      console.log("Creating scenario with data:", data);
      
      // Use the createTemplateScenario method which handles all complex type structures
      const newId = await createTemplateScenario(
        data.name,
        data.originCountry,
        data.destinationCountry
      );
      
      console.log("createTemplateScenario result ID:", newId);
      
      if (newId) {
        toast({
          title: 'Success',
          description: 'Scenario created successfully',
          type: 'success',
        });
        
        // Navigate to the new scenario
        router.push(`/scenarios/${newId}`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create scenario',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error in handleCreateScenario:', error);
      toast({
        title: 'Error',
        description: 'Failed to create scenario',
        type: 'error',
      });
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      const success = await deleteScenario(id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Scenario deleted successfully',
          type: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete scenario',
        type: 'error',
      });
      console.error('Error deleting scenario:', error);
    }
  };

  const handleDuplicateScenario = async (id: string) => {
    try {
      const newId = await duplicateScenario(id);
      
      if (newId) {
        toast({
          title: 'Success',
          description: 'Scenario duplicated successfully',
          type: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate scenario',
        type: 'error',
      });
      console.error('Error duplicating scenario:', error);
    }
  };

  const handleRenameScenario = async (id: string, newName: string) => {
    try {
      const success = await updateScenario(id, { name: newName });
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Scenario renamed successfully',
          type: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename scenario',
        type: 'error',
      });
      console.error('Error renaming scenario:', error);
    }
  };

  const handleImportScenarios = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const parsedScenarios = JSON.parse(content);
            // Assuming importScenarios from the store takes the parsed data
            // and handles merging or replacing.
            // You might need to adjust this based on the actual signature and behavior
            // of your importScenarios function (e.g., if it expects a specific format or returns a status).
            await importScenarios(parsedScenarios); 
            toast({
              title: 'Success',
              description: 'Scenarios imported successfully.',
              type: 'success',
            });
            // Optionally, refresh the list or navigate
            await loadScenarios(); // Refresh scenario list
          } catch (parseError) {
            console.error('Error parsing or importing scenarios:', parseError);
            toast({
              title: 'Import Error',
              description: 'Failed to parse or import the scenario file. Please ensure it is a valid JSON export.',
              type: 'error',
            });
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: 'File Read Error',
          description: 'Could not read the selected file.',
          type: 'error',
        });
      }
    }
    // Reset file input to allow importing the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerImportFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Living Abroad Budget</h1>
        <p className="text-xl text-gray-600 mb-8">
          Plan your international move with confidence by modeling multiple financial scenarios
        </p>
        {/* Button Container */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {/* Create New Scenario Button - Assuming ScenarioList's onCreate is sufficient for now, or this could open a modal */}
          {/* For simplicity, this button will directly call handleCreateScenario which expects specific data.
              A more robust solution would be to open a modal to gather this data first.
              Using placeholder data for demonstration.
          */}
          <button
            onClick={() => router.push('/scenarios/create')} // Navigate to a dedicated creation page
            className="btn btn-primary" // Using DaisyUI button style
          >
            Create New Scenario
          </button>

          {/* Import Scenario Button */}
          <button
            onClick={triggerImportFile}
            className="btn btn-secondary" // Using DaisyUI button style
          >
            Import Scenarios
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportScenarios}
            accept=".json"
            style={{ display: 'none' }}
          />

          {/* View Demo Pages Button */}
          <Link href="/dev/demos" legacyBehavior>
            <a className="btn btn-accent"> {/* Using DaisyUI button style */}
              View Demo Pages
            </a>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <ScenarioList
          scenarios={scenarioList}
          onCreateScenario={handleCreateScenario}
          onDeleteScenario={handleDeleteScenario}
          onDuplicateScenario={handleDuplicateScenario}
          onRenameScenario={handleRenameScenario}
        />
      )}
    </main>
  );
};

export default Page;
