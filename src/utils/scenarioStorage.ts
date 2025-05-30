import { v4 as uuidv4 } from 'uuid';
import { 
  Scenario, 
  ScenarioMap, 
  CreateScenarioInput, 
  UpdateScenarioInput, 
  StorageOperationResult, 
  ScenarioStorageItem,
  ScenarioListItem,
  ScenarioStorageStats,
  ScenarioContent,
  CURRENT_SCHEMA_VERSION
} from '@/types/scenario';
import { 
  getStorageItem, 
  setStorageItem, 
  removeStorageItem, 
  getStorageKeys,
  calculateStorageSize,
  getStorageStats,
  MAX_STORAGE_SIZE
} from '@/utils/storageUtils';
import { CountryCode, ResidencyType, TaxRegimeType, CurrencyCode, FrequencyType } from '@/types/base';
import { HousingType } from '@/types/housing';
import { TransportType } from '@/types/transport';
import { UtilityServiceType, UtilityPlanType } from '@/types/utilities';
import { HealthcareType } from '@/store/types';

// Constants
const SCENARIOS_NAMESPACE = 'scenarios';

/**
 * Convert a Scenario to a ScenarioStorageItem for storage
 */
const prepareForStorage = (scenario: Scenario): ScenarioStorageItem => {
  const { id, name, description, content, createdAt, updatedAt } = scenario;
  
  return {
    id,
    name,
    description,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    content,
    schemaVersion: CURRENT_SCHEMA_VERSION
  };
};

/**
 * Convert a ScenarioStorageItem back to a Scenario
 */
const hydrateFromStorage = (storageItem: ScenarioStorageItem): Scenario => {
  const { id, name, description, content, createdAt, updatedAt } = storageItem;
  
  return {
    id,
    name,
    description,
    content,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt)
  };
};

/**
 * Generate a default scenario name based on countries
 */
export const generateScenarioName = (
  originCountry: CountryCode,
  destinationCountry: CountryCode
): string => {
  return `${originCountry} to ${destinationCountry} - ${new Date().toLocaleDateString()}`;
};

/**
 * Create a new scenario
 */
export const createScenario = (input: CreateScenarioInput): StorageOperationResult<Scenario> => {
  try {
    const now = new Date();
    const scenario: Scenario = {
      id: uuidv4(),
      name: input.name,
      description: input.description,
      content: {
        ...input.content,
        schemaVersion: CURRENT_SCHEMA_VERSION
      },
      createdAt: now,
      updatedAt: now
    };

    const storageItem = prepareForStorage(scenario);
    const saveResult = setStorageItem(scenario.id, storageItem, SCENARIOS_NAMESPACE);
    
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error
      };
    }

    return {
      success: true,
      data: scenario
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Retrieve a scenario by ID
 */
export const getScenario = (id: string): StorageOperationResult<Scenario> => {
  try {
    const result = getStorageItem<ScenarioStorageItem>(id, SCENARIOS_NAMESPACE);
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || `Scenario with ID ${id} not found`
      };
    }
    
    const storageItem = result.data;
    
    // Handle schema migration if needed
    if (storageItem.schemaVersion < CURRENT_SCHEMA_VERSION) {
      // Implement schema migration logic here
      // For example: storageItem = migrateSchema(storageItem);
    }
    
    return {
      success: true,
      data: hydrateFromStorage(storageItem)
    };
  } catch (error) {
    return {
      success: false,
      error: `Error retrieving scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Update an existing scenario
 */
export const updateScenario = (id: string, updates: UpdateScenarioInput): StorageOperationResult<Scenario> => {
  try {
    // First get the existing scenario
    const getResult = getScenario(id);
    
    if (!getResult.success || !getResult.data) {
      return {
        success: false,
        error: getResult.error || `Scenario with ID ${id} not found`
      };
    }
    
    const existingScenario = getResult.data;
    
    // Apply updates
    const updatedScenario: Scenario = {
      ...existingScenario,
      name: updates.name !== undefined ? updates.name : existingScenario.name,
      description: updates.description !== undefined ? updates.description : existingScenario.description,
      content: updates.content !== undefined 
        ? { ...updates.content, schemaVersion: CURRENT_SCHEMA_VERSION } 
        : existingScenario.content,
      updatedAt: new Date()
    };
    
    // Save the updated scenario
    const storageItem = prepareForStorage(updatedScenario);
    const saveResult = setStorageItem(id, storageItem, SCENARIOS_NAMESPACE);
    
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error
      };
    }

    return {
      success: true,
      data: updatedScenario
    };
  } catch (error) {
    return {
      success: false,
      error: `Error updating scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Delete a scenario
 */
export const deleteScenario = (id: string): StorageOperationResult => {
  try {
    const result = removeStorageItem(id, SCENARIOS_NAMESPACE);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Error deleting scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Get a list of all scenarios
 */
export const listScenarios = (): StorageOperationResult<ScenarioMap> => {
  console.log('scenarioStorage: listScenarios called');
  try {
    const keysResult = getStorageKeys(SCENARIOS_NAMESPACE);
    console.log('scenarioStorage: getStorageKeys result:', keysResult);
    
    if (!keysResult.success || !keysResult.data) {
      console.error('scenarioStorage: failed to get keys', keysResult.error);
      return {
        success: false,
        error: keysResult.error || 'Failed to get scenario keys'
      };
    }
    
    const scenarioMap: ScenarioMap = {};
    console.log('scenarioStorage: found keys:', keysResult.data);
    
    for (const id of keysResult.data) {
      console.log(`scenarioStorage: getting scenario ${id}`);
      const scenarioResult = getScenario(id);
      if (scenarioResult.success && scenarioResult.data) {
        scenarioMap[id] = scenarioResult.data;
      } else {
        console.warn(`scenarioStorage: failed to get scenario ${id}`, scenarioResult.error);
      }
    }
    
    console.log('scenarioStorage: returning map with', Object.keys(scenarioMap).length, 'scenarios');
    return {
      success: true,
      data: scenarioMap
    };
  } catch (error) {
    console.error('scenarioStorage: error in listScenarios', error);
    return {
      success: false,
      error: `Error listing scenarios: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Get a lightweight list of scenarios for display in UI
 */
export const getScenarioList = (): StorageOperationResult<ScenarioListItem[]> => {
  try {
    const scenariosResult = listScenarios();
    
    if (!scenariosResult.success || !scenariosResult.data) {
      return {
        success: false,
        error: scenariosResult.error || 'Failed to get scenarios'
      };
    }
    
    const scenarios = scenariosResult.data;
    const scenarioList: ScenarioListItem[] = Object.values(scenarios).map(scenario => ({
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      createdAt: scenario.createdAt.toISOString(),
      updatedAt: scenario.updatedAt.toISOString(),
      originCountry: scenario.content.originCountry,
      destinationCountry: scenario.content.destinationCountry
    }));
    
    // Sort by updatedAt, most recent first
    scenarioList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return {
      success: true,
      data: scenarioList
    };
  } catch (error) {
    return {
      success: false,
      error: `Error getting scenario list: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Duplicate a scenario
 */
export const duplicateScenario = (id: string, newName?: string): StorageOperationResult<Scenario> => {
  try {
    const getResult = getScenario(id);
    
    if (!getResult.success || !getResult.data) {
      return {
        success: false,
        error: getResult.error || `Scenario with ID ${id} not found`
      };
    }
    
    const sourceScenario = getResult.data;
    const now = new Date();
    
    // Create a copy with a new ID and updated timestamps
    const newScenario: Scenario = {
      ...sourceScenario,
      id: uuidv4(),
      name: newName || `${sourceScenario.name} (Copy)`,
      createdAt: now,
      updatedAt: now
    };
    
    // Save the new scenario
    const storageItem = prepareForStorage(newScenario);
    const saveResult = setStorageItem(newScenario.id, storageItem, SCENARIOS_NAMESPACE);
    
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error
      };
    }

    return {
      success: true,
      data: newScenario
    };
  } catch (error) {
    return {
      success: false,
      error: `Error duplicating scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Get storage statistics for scenarios
 */
export const getScenarioStorageStats = (): StorageOperationResult<ScenarioStorageStats> => {
  try {
    const scenariosResult = listScenarios();
    const storageStatsResult = getStorageStats();
    
    if (!scenariosResult.success || !scenariosResult.data) {
      return {
        success: false,
        error: scenariosResult.error || 'Failed to get scenarios'
      };
    }
    
    if (!storageStatsResult.success || !storageStatsResult.data) {
      return {
        success: false,
        error: storageStatsResult.error || 'Failed to get storage stats'
      };
    }
    
    const scenarios = scenariosResult.data;
    const storageStats = storageStatsResult.data;
    
    // Calculate total size of scenarios
    let totalSize = 0;
    for (const id in scenarios) {
      const scenario = scenarios[id];
      const storageItem = prepareForStorage(scenario);
      totalSize += calculateStorageSize(storageItem);
    }
    
    return {
      success: true,
      data: {
        totalScenarios: Object.keys(scenarios).length,
        totalSize,
        remainingSpace: storageStats.available,
        usagePercentage: (totalSize / MAX_STORAGE_SIZE) * 100,
        estimatedCapacity: Math.floor(MAX_STORAGE_SIZE / (totalSize / Object.keys(scenarios).length || 1))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Error getting scenario storage stats: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Export scenarios to JSON
 */
export const exportScenarios = (): StorageOperationResult<string> => {
  try {
    const scenariosResult = listScenarios();
    
    if (!scenariosResult.success || !scenariosResult.data) {
      return {
        success: false,
        error: scenariosResult.error || 'Failed to get scenarios'
      };
    }
    
    const scenarios = scenariosResult.data;
    const exportData = Object.values(scenarios).map(scenario => prepareForStorage(scenario));
    
    return {
      success: true,
      data: JSON.stringify(exportData, null, 2)
    };
  } catch (error) {
    return {
      success: false,
      error: `Error exporting scenarios: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Import scenarios from JSON
 */
export const importScenarios = (jsonData: string, overwrite = false): StorageOperationResult<ScenarioMap> => {
  try {
    const importedItems = JSON.parse(jsonData) as ScenarioStorageItem[];
    
    if (!Array.isArray(importedItems)) {
      return {
        success: false,
        error: 'Invalid import data format. Expected an array of scenarios.'
      };
    }
    
    const importedScenarios: ScenarioMap = {};
    
    // If not overwriting, check for ID conflicts
    if (!overwrite) {
      const existingScenariosResult = listScenarios();
      
      if (existingScenariosResult.success && existingScenariosResult.data) {
        const existingIds = Object.keys(existingScenariosResult.data);
        
        for (const item of importedItems) {
          if (existingIds.includes(item.id)) {
            return {
              success: false,
              error: `Scenario ID conflict: ${item.id} already exists. Use overwrite=true to replace existing scenarios.`
            };
          }
        }
      }
    }
    
    // Validate and migrate schemas if needed
    for (const item of importedItems) {
      // Handle schema migration if needed
      if (item.schemaVersion < CURRENT_SCHEMA_VERSION) {
        // Implement schema migration logic here
        // For example: item = migrateSchema(item);
      }
      
      // Save the imported scenario
      const scenario = hydrateFromStorage(item);
      const storageItem = prepareForStorage(scenario);
      const saveResult = setStorageItem(scenario.id, storageItem, SCENARIOS_NAMESPACE);
      
      if (!saveResult.success) {
        return {
          success: false,
          error: `Error importing scenario ${scenario.id}: ${saveResult.error}`
        };
      }
      
      importedScenarios[scenario.id] = scenario;
    }
    
    return {
      success: true,
      data: importedScenarios
    };
  } catch (error) {
    return {
      success: false,
      error: `Error importing scenarios: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Create a blank template scenario with default values
 */
export const createTemplateScenario = (
  name: string,
  originCountry: CountryCode,
  destinationCountry: CountryCode
): StorageOperationResult<Scenario> => {
  console.log('scenarioStorage: createTemplateScenario called', { name, originCountry, destinationCountry });
  try {
    const now = new Date();
    const id = uuidv4();
    
    // Create a new scenario with template data
    const scenario: Scenario = {
      id,
      name: name || generateScenarioName(originCountry, destinationCountry),
      description: `Comparing cost of living between ${originCountry} and ${destinationCountry}`,
      content: {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        originCountry,
        destinationCountry,
        
        // Required properties with default values
        household: {
          id: `household-${id}`,
          name: "My Household",
          members: [],
          originCountry,
          destinationCountry,
          residencyStatus: ResidencyType.PERMANENT_RESIDENT,
          taxRegime: TaxRegimeType.STANDARD,
          size: 1,
          dependents: 0,
          createdAt: now,
          updatedAt: now
        },
        incomeSources: [],
        housingType: HousingType.RENT,
        housingExpense: {
          id: `housing-${id}`,
          type: HousingType.RENT,
          address: {
            line1: "",
            city: "",
            region: "",
            postalCode: "",
            country: destinationCountry
          },
          mainCost: {
            amount: 0,
            currency: CurrencyCode.USD,
            frequency: FrequencyType.MONTHLY
          },
          furnished: false,
          bedrooms: 1,
          bathrooms: 1,
          createdAt: now,
          updatedAt: now
        },
        educationExpenses: {},
        healthcareType: HealthcareType.PUBLIC,
        healthcareExpenses: {},
        transportType: TransportType.PUBLIC,
        transportExpense: {
          id: `transport-${id}`,
          type: TransportType.PUBLIC,
          mainCost: {
            amount: 0,
            currency: CurrencyCode.USD,
            frequency: FrequencyType.MONTHLY
          },
          isCommute: true,
          createdAt: now,
          updatedAt: now
        },
        lifestyleExpenses: [],
        utilityExpenses: {
          [UtilityServiceType.ELECTRICITY]: {
            id: `util-elec-${id}`,
            createdAt: now,
            updatedAt: now,
            type: UtilityServiceType.ELECTRICITY,
            provider: 'Default Provider',
            planType: UtilityPlanType.FIXED,
            baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            included: false,
          },
          [UtilityServiceType.WATER]: {
            id: `util-water-${id}`,
            createdAt: now,
            updatedAt: now,
            type: UtilityServiceType.WATER,
            provider: 'Default Provider',
            planType: UtilityPlanType.FIXED,
            baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            included: false,
          },
          [UtilityServiceType.GAS]: {
            id: `util-gas-${id}`,
            createdAt: now,
            updatedAt: now,
            type: UtilityServiceType.GAS,
            provider: 'Default Provider',
            planType: UtilityPlanType.FIXED,
            baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            included: false,
          },
          [UtilityServiceType.INTERNET]: {
            id: `util-internet-${id}`,
            createdAt: now,
            updatedAt: now,
            type: UtilityServiceType.INTERNET,
            provider: 'Default Provider',
            planType: UtilityPlanType.FIXED,
            baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            included: false,
          },
          [UtilityServiceType.MOBILE]: {
            id: `util-mobile-${id}`,
            createdAt: now,
            updatedAt: now,
            type: UtilityServiceType.MOBILE,
            provider: 'Default Provider',
            planType: UtilityPlanType.FIXED,
            baseCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
            included: false,
          }
        },
        emergencyFund: {
          id: `emergency-${id}`,
          createdAt: now,
          updatedAt: now,
          targetMonths: 3,
          currentBalance: { amount: 0, currency: CurrencyCode.USD },
          monthlyContribution: { amount: 0, currency: CurrencyCode.USD },
          minimumBalance: { amount: 0, currency: CurrencyCode.USD },
          location: 'Default Savings Account',
          isLiquid: true
        },
        fxSettings: {
          baseCurrency: CurrencyCode.USD,
          displayCurrency: CurrencyCode.USD,
          manualRates: false,
          customRates: {},
          sensitivityRange: [-0.1, 0.1]
        }
      },
      createdAt: now,
      updatedAt: now
    };
    
    console.log('scenarioStorage: created template scenario object', scenario.id);

    // Store the scenario
    const storageItem = prepareForStorage(scenario);
    const saveResult = setStorageItem(scenario.id, storageItem, SCENARIOS_NAMESPACE);
    
    if (!saveResult.success) {
      console.error('scenarioStorage: failed to save template scenario', saveResult.error);
      return {
        success: false,
        error: saveResult.error
      };
    }
    
    console.log('scenarioStorage: template scenario saved successfully', scenario.id);
    return {
      success: true,
      data: scenario
    };
  } catch (error) {
    console.error('scenarioStorage: error creating template scenario', error);
    return {
      success: false,
      error: `Error creating template scenario: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};