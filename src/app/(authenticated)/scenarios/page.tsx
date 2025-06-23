'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScenarioList } from '@/components/scenarios/ScenarioList';
import { useScenarioStore, useProfile } from '@/store/hooks';
import { useStore } from '@/store';
import { toast } from '@/components/ui';
import { CountryCode, ResidencyType, TaxRegimeType, CurrencyCode, FrequencyType } from '@/types/base';
import { CURRENT_SCHEMA_VERSION, CreateScenarioInput, ScenarioContent } from '@/types/scenario';
import { HousingType, HousingExpense } from '@/types/housing';
import { HealthcareCoverageType } from '@/types/healthcare';
import { TransportType, TransportExpense } from '@/types/transport';
import { EmergencyFund } from '@/types/emergency';
import { FXSettings } from '@/store/types';
import { v4 as uuidv4 } from 'uuid';
import { Household, HouseholdMember } from '@/types/household';

export default function ScenariosPage() {
  const router = useRouter();
  const { household } = useProfile();
  const { 
    scenarioList,
    loadScenarios,
    createScenario,
    deleteScenario,
    duplicateScenario,
    updateScenario,
    error 
  } = useScenarioStore();

  console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Store state:', useStore.getState());
  console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): scenarioList:', scenarioList);

  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Loading scenarios...');
        loadScenarios();
        console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Scenarios loaded successfully');
      } catch (error) {
        console.error('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Error loading scenarios:', error);
        setLocalError(error instanceof Error ? error.message : 'Failed to load scenarios');
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
    destinationCountry: CountryCode;
  }) => {
    setIsLoading(true);
    try {
      console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Creating scenario with data from modal:', data);
      
      const profileOriginCountry = household?.originCountry || CountryCode.GB;
      console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Using origin country from profile (or default GB):', profileOriginCountry);

      const scenarioInput: CreateScenarioInput = {
        name: data.name,
        description: data.description,
        content: {
          schemaVersion: CURRENT_SCHEMA_VERSION,
          originCountry: profileOriginCountry,
          destinationCountry: data.destinationCountry,
          completionStatus: 'draft',
          household: {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: `Household for ${data.name}`,
            members: household?.members || [],
            originCountry: profileOriginCountry,
            destinationCountry: data.destinationCountry,
            residencyStatus: household?.residencyStatus || ResidencyType.TEMPORARY_RESIDENT,
            taxRegime: household?.taxRegime || TaxRegimeType.STANDARD,
            size: household?.members?.length || 0,
            dependents: household?.members?.filter((m: HouseholdMember) => m.isDependent).length || 0,
          } as Household,
          incomeSources: [],
          housingType: HousingType.RENT,
          housingExpense: {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            type: HousingType.RENT,
            address: { line1: '', city: '', postalCode: '', country: data.destinationCountry },
            mainCost: { amount: 0, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY },
            cost: { amount: 0, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY },
            size: 0,
            bedrooms: 0,
            bathrooms: 0,
            furnished: false,
            utilities: [],
            insurance: [],
          } as HousingExpense,
          educationExpenses: {},
          healthcareType: HealthcareCoverageType.PUBLIC,
          healthcareExpenses: {},
          transportType: TransportType.PUBLIC,
          transportExpense: {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            type: TransportType.PUBLIC,
            mainCost: { amount: 0, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY },
            costs: [],
            isCommute: false,
          } as TransportExpense,
          lifestyleExpenses: [],
          utilityExpenses: {},
          emergencyFund: {
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            targetMonths: 3,
            currentBalance: { amount: 0, currency: CurrencyCode.EUR },
            monthlyContribution: { amount: 0, currency: CurrencyCode.EUR },
            minimumBalance: { amount: 0, currency: CurrencyCode.EUR },
            location: '',
            isLiquid: true,
          } as EmergencyFund,
          fxSettings: {
            baseCurrency: CurrencyCode.EUR,
            displayCurrency: CurrencyCode.EUR,
            displayCurrencies: [CurrencyCode.EUR, CurrencyCode.GBP],
            manualRates: false,
            customRates: {},
            sensitivityRange: [-10, 10],
          } as FXSettings,
        } as ScenarioContent,
      };

      console.log('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Full ScenarioInput object prepared:', scenarioInput);

      const newScenarioId = await createScenario(scenarioInput);

      if (newScenarioId) {
        toast({
          title: 'Scenario Created',
          description: `Successfully created scenario: ${scenarioInput.name}`,
          type: 'success',
        });
        router.push(`/scenario/${newScenarioId}/edit`);
      } else {
        throw new Error('Scenario creation failed or did not return a valid ID.');
      }

    } catch (error) {
      console.error('ScenariosPage (src/app/(authenticated)/scenarios/page.tsx): Error creating scenario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create scenario';
      setLocalError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      await deleteScenario(id);
      toast({
        title: 'Success',
        description: 'Scenario deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting scenario:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to delete scenario');
      toast({
        title: 'Error',
        description: 'Failed to delete scenario',
        type: 'error',
      });
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
        router.push(`/scenario/${newId}/edit`);
      } else {
        throw new Error('Scenario duplication failed or did not return a valid ID.');
      }
    } catch (error) {
      console.error('Error duplicating scenario:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to duplicate scenario');
      toast({
        title: 'Error',
        description: 'Failed to duplicate scenario',
        type: 'error',
      });
    }
  };

  const handleRenameScenario = async (id: string, newName: string) => {
    try {
      await updateScenario(id, { name: newName });
      toast({
        title: 'Success',
        description: 'Scenario renamed successfully',
        type: 'success',
      });
      loadScenarios(); // Refresh the list
    } catch (error) {
      console.error('Error renaming scenario:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to rename scenario');
      toast({
        title: 'Error',
        description: 'Failed to rename scenario',
        type: 'error',
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading scenarios...</p></div>;
  }

  if (localError || error) {
    return <div className="flex justify-center items-center h-screen text-red-500">
      <p>Error: {localError || error}</p>
      <button onClick={() => loadScenarios()} className="ml-4 p-2 bg-blue-500 text-white rounded">
        Retry
      </button>
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ScenarioList 
        scenarios={scenarioList} 
        onCreateScenario={handleCreateScenario} 
        onDeleteScenario={handleDeleteScenario}
        onDuplicateScenario={handleDuplicateScenario}
        onRenameScenario={handleRenameScenario}
      />
    </div>
  );
} 