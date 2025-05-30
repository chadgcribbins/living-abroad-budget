'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScenarioList } from '@/components/scenarios/ScenarioList';
import { useScenarioStore } from '@/store/hooks';
import { useStore } from '@/store';
import { toast } from '@/components/ui';
import { CountryCode, ResidencyType, TaxRegimeType, CurrencyCode, FrequencyType } from '@/types/base';
import { CURRENT_SCHEMA_VERSION } from '@/types/scenario';
import { HousingType } from '@/types/housing';
import { HealthcareType } from '@/store/types';
import { TransportType } from '@/types/transport';
import { UtilityPlanType, UtilityExpense, UtilityServiceType } from '@/types/utilities';

export default function ScenariosPage() {
  const router = useRouter();
  const { 
    scenarioList,
    loadScenarios,
    createScenario,
    deleteScenario,
    duplicateScenario,
    updateScenario,
    error 
  } = useScenarioStore();

  // Log the store state for debugging
  console.log('ScenariosPage: Store state:', useStore.getState());
  console.log('ScenariosPage: scenarioList:', scenarioList);

  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('ScenariosPage: Loading scenarios...');
        loadScenarios();
        console.log('ScenariosPage: Scenarios loaded successfully');
      } catch (error) {
        console.error('ScenariosPage: Error loading scenarios:', error);
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
    originCountry: CountryCode;
    destinationCountry: CountryCode;
  }) => {
    try {
      console.log('Creating scenario with data:', data);
      
      // Transform the data to match the expected CreateScenarioInput type
      const scenarioInput = {
        name: data.name,
        description: data.description,
        content: {
          schemaVersion: CURRENT_SCHEMA_VERSION,
          originCountry: data.originCountry,
          destinationCountry: data.destinationCountry,
          // Initialize with empty/default values for required fields
          household: {
            id: '',
            members: [],
            originCountry: data.originCountry,
            destinationCountry: data.destinationCountry,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'My Household',
            residencyStatus: ResidencyType.CITIZEN,
            taxRegime: TaxRegimeType.STANDARD,
            size: 1,
            dependents: 0
          },
          incomeSources: [],
          housingType: HousingType.RENT,
          housingExpense: {
            id: '',
            type: HousingType.RENT,
            address: {
              line1: '',
              city: '',
              postalCode: '',
              country: data.destinationCountry
            },
            mainCost: {
              amount: 0,
              currency: CurrencyCode.USD,
              frequency: FrequencyType.MONTHLY
            },
            cost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            size: 0,
            bedrooms: 1,
            bathrooms: 1,
            furnished: false,
            utilities: [],
            insurance: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          educationExpenses: {},
          healthcareType: HealthcareType.PUBLIC,
          healthcareExpenses: {},
          transportType: TransportType.PUBLIC,
          transportExpense: {
            id: '',
            type: TransportType.PUBLIC,
            mainCost: {
              amount: 0,
              currency: CurrencyCode.USD,
              frequency: FrequencyType.MONTHLY
            },
            costs: [],
            isCommute: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          lifestyleExpenses: [],
          utilityExpenses: {
            // Initialize using UtilityServiceType enum as keys
            [UtilityServiceType.ELECTRICITY]: {
              id: '', type: UtilityServiceType.ELECTRICITY, provider: '', planType: UtilityPlanType.VARIABLE, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.GAS]: {
              id: '', type: UtilityServiceType.GAS, provider: '', planType: UtilityPlanType.VARIABLE, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.WATER]: {
              id: '', type: UtilityServiceType.WATER, provider: '', planType: UtilityPlanType.VARIABLE, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.SEWAGE]: {
              id: '', type: UtilityServiceType.SEWAGE, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.INTERNET]: {
              id: '', type: UtilityServiceType.INTERNET, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.MOBILE]: {
              id: '', type: UtilityServiceType.MOBILE, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.LANDLINE]: {
              id: '', type: UtilityServiceType.LANDLINE, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.TV]: {
              id: '', type: UtilityServiceType.TV, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.STREAMING]: {
              id: '', type: UtilityServiceType.STREAMING, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.TRASH]: {
              id: '', type: UtilityServiceType.TRASH, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.RECYCLING]: {
              id: '', type: UtilityServiceType.RECYCLING, provider: '', planType: UtilityPlanType.FIXED, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
            [UtilityServiceType.OTHER]: {
              id: '', type: UtilityServiceType.OTHER, provider: '', planType: UtilityPlanType.VARIABLE, 
              baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, included: false,
              createdAt: new Date(), updatedAt: new Date()
            } as UtilityExpense,
          } as Record<UtilityServiceType, UtilityExpense>,
          emergencyFund: {
            id: '',
            targetMonths: 3,
            currentBalance: { amount: 0, currency: CurrencyCode.USD },
            monthlyContribution: { amount: 0, currency: CurrencyCode.USD },
            minimumBalance: { amount: 0, currency: CurrencyCode.USD },
            location: '',
            isLiquid: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          fxSettings: {
            baseCurrency: CurrencyCode.USD,
            displayCurrency: CurrencyCode.USD,
            manualRates: false,
            customRates: {},
            sensitivityRange: [-10, 10] as [number, number],
          },
        }
      };
      
      console.log('ScenariosPage: Creating scenario with input:', scenarioInput);
      const newScenarioId = await createScenario(scenarioInput);
      console.log('ScenariosPage: Scenario created with ID:', newScenarioId);
      
      if (newScenarioId) {
        toast({
          title: 'Success',
          description: 'New scenario created successfully',
          type: 'success',
        });
        // Navigate to the new scenario
        router.push(`/scenarios/${newScenarioId}`);
      } else {
        throw new Error('Failed to create scenario');
      }
    } catch (error) {
      console.error('Error creating scenario:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to create scenario');
      toast({
        title: 'Error',
        description: 'Failed to create scenario',
        type: 'error',
      });
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
      } else {
        throw new Error('Failed to duplicate scenario');
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
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Loading scenarios...</p>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="container mx-auto py-8">
        <div className="alert alert-error">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error: {error || localError}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budget Scenarios</h1>
      </div>
      
      <ScenarioList
        scenarios={scenarioList || []}
        onCreateScenario={handleCreateScenario}
        onDeleteScenario={handleDeleteScenario}
        onDuplicateScenario={handleDuplicateScenario}
        onRenameScenario={handleRenameScenario}
      />
    </div>
  );
} 