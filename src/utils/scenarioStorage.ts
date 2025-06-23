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
import { CountryCode } from '@/types/base';
import { HousingType } from '@/types/housing';
import { TransportType } from '@/types/transport';
import { HealthcareCoverageType as HealthcareType } from '@/types/healthcare';
import { getScenarioCompletionStatus } from './scenarioCompletion';
import { 
  DEFAULT_HOUSEHOLD_COMPOSITION, 
  DEFAULT_FX_SETTINGS,
  DEFAULT_INCOME_SOURCES,
  DEFAULT_HOUSING_EXPENSE,
  DEFAULT_TRANSPORT_EXPENSE,
  DEFAULT_UTILITY_EXPENSES,
  DEFAULT_LIFESTYLE_EXPENSES,
  DEFAULT_EMERGENCY_FUND
} from '@/utils/defaults';

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
    const initialContent: ScenarioContent = {
      ...input.content,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      completionStatus: 'draft'
    };
    initialContent.completionStatus = getScenarioCompletionStatus(initialContent);

    const scenario: Scenario = {
      id: uuidv4(),
      name: input.name,
      description: input.description,
      content: initialContent,
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
    
    // Apply updates to content carefully
    let updatedContent = existingScenario.content;
    if (updates.content) {
      updatedContent = {
        ...existingScenario.content,
        ...updates.content,
        schemaVersion: CURRENT_SCHEMA_VERSION
      };
    }
    // Recalculate completion status after content update
    updatedContent.completionStatus = getScenarioCompletionStatus(updatedContent);

    const updatedScenario: Scenario = {
      ...existingScenario,
      name: updates.name !== undefined ? updates.name : existingScenario.name,
      description: updates.description !== undefined ? updates.description : existingScenario.description,
      content: updatedContent,
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
      destinationCountry: scenario.content.destinationCountry,
      completionStatus: scenario.content.completionStatus || 'draft'
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
      return { success: false, error: getResult.error };
    }
    const originalScenario = getResult.data;
    const now = new Date();

    const duplicatedContent = { ...originalScenario.content };
    // Recalculate completion status for the duplicated content
    duplicatedContent.completionStatus = getScenarioCompletionStatus(duplicatedContent);

    const duplicatedScenario: Scenario = {
      ...originalScenario,
      id: uuidv4(),
      name: newName || `${originalScenario.name} (Copy)`,
      content: duplicatedContent,
      createdAt: now,
      updatedAt: now
    };

    const storageItem = prepareForStorage(duplicatedScenario);
    const saveResult = setStorageItem(duplicatedScenario.id, storageItem, SCENARIOS_NAMESPACE);
    
    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error
      };
    }

    return {
      success: true,
      data: duplicatedScenario
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
    const importedData = JSON.parse(jsonData) as { scenarios?: ScenarioStorageItem[], scenarioMap?: Record<string, ScenarioStorageItem> };
    let itemsToImport: ScenarioStorageItem[] = [];

    if (importedData.scenarios) { // Handles array format
      itemsToImport = importedData.scenarios;
    } else if (importedData.scenarioMap) { // Handles map format (potentially older exports)
      itemsToImport = Object.values(importedData.scenarioMap);
    }

    if (itemsToImport.length === 0) {
      return { success: false, error: 'No scenarios found in the imported JSON data.' };
    }

    const successfullyImported: ScenarioMap = {};
    const errors: string[] = [];

    // Get existing scenario IDs if not overwriting
    const existingKeysResult = getStorageKeys(SCENARIOS_NAMESPACE);
    let actualExistingKeys: string[] = [];
    if (existingKeysResult.success && existingKeysResult.data) {
      actualExistingKeys = existingKeysResult.data;
    }

    for (const item of itemsToImport) {
      if (!item.id || !item.content) {
        errors.push(`Skipping item due to missing id or content: ${JSON.stringify(item)}`);
        continue;
      }

      if (!overwrite && actualExistingKeys.includes(item.id)) {
        errors.push(`Skipping existing scenario ID (overwrite is false): ${item.id}`);
        continue;
      }

      // Ensure content has completionStatus and calculate it
      const scenarioContentToImport: ScenarioContent = item.content;
      if (typeof scenarioContentToImport.completionStatus === 'undefined') {
        scenarioContentToImport.completionStatus = 'draft'; // Set a default if missing
      }
      scenarioContentToImport.completionStatus = getScenarioCompletionStatus(scenarioContentToImport);
      
      // Ensure schema version is current or migrate if necessary (simplified for now)
      const finalItemToStore: ScenarioStorageItem = {
        ...item,
        content: scenarioContentToImport,
        schemaVersion: CURRENT_SCHEMA_VERSION, // Force current schema version on import
        // Ensure dates are in ISO string format for storage
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      };
      
      const saveResult = setStorageItem(finalItemToStore.id, finalItemToStore, SCENARIOS_NAMESPACE);
      if (saveResult.success) {
        successfullyImported[finalItemToStore.id] = hydrateFromStorage(finalItemToStore);
      } else {
        errors.push(`Failed to save scenario ${finalItemToStore.id}: ${saveResult.error}`);
      }
    }

    if (Object.keys(successfullyImported).length === 0 && errors.length > 0) {
      return { success: false, error: `Import failed. Errors: ${errors.join('; ')}` };
    }

    return {
      success: true,
      data: successfullyImported,
      error: errors.length > 0 ? `Partial import with errors: ${errors.join('; ')}` : undefined
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
    const scenarioName = name || generateScenarioName(originCountry, destinationCountry);
    
    // Define the full template content structure here
    const templateContent: ScenarioContent = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      originCountry,
      destinationCountry,
      household: { ...DEFAULT_HOUSEHOLD_COMPOSITION },
      incomeSources: [ ...DEFAULT_INCOME_SOURCES ],
      housingType: HousingType.RENT,
      housingExpense: { ...DEFAULT_HOUSING_EXPENSE[HousingType.RENT] },
      educationExpenses: {},
      healthcareType: HealthcareType.PUBLIC,
      healthcareExpenses: {},
      transportType: TransportType.PUBLIC,
      transportExpense: { ...DEFAULT_TRANSPORT_EXPENSE[TransportType.PUBLIC] },
      lifestyleExpenses: [ ...DEFAULT_LIFESTYLE_EXPENSES ],
      utilityExpenses: { ...DEFAULT_UTILITY_EXPENSES },
      emergencyFund: { ...DEFAULT_EMERGENCY_FUND },
      fxSettings: DEFAULT_FX_SETTINGS[destinationCountry] || DEFAULT_FX_SETTINGS.EUR,
      completionStatus: 'draft'
    };

    // Calculate completion status for the template content
    templateContent.completionStatus = getScenarioCompletionStatus(templateContent);

    const scenario: Scenario = {
      id: uuidv4(),
      name: scenarioName,
      description: `Template for ${destinationCountry} from ${originCountry}`,
      content: templateContent,
      createdAt: now,
      updatedAt: now
    };

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