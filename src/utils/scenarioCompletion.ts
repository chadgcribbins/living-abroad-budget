import { ScenarioContent } from '@/types/scenario';

/**
 * Determines the completion status of a scenario based on its content.
 * 
 * @param scenarioContent The content of the scenario to check.
 * @returns 'complete' if the scenario is considered complete, 'draft' otherwise.
 */
export const getScenarioCompletionStatus = (
  scenarioContent: ScenarioContent
): 'draft' | 'complete' => {
  // Placeholder logic: For now, consider a scenario complete if it has a household defined.
  // This will need to be significantly expanded based on the wizard flow and required fields per section.
  // For example, check if household details, at least one income source, and housing details are present.
  // Also, consider the active path for sections like housing (rent vs. buy).
  
  // A more detailed check might look like:
  // const { household, incomeSources, housingType, housingExpense, ...otherModules } = scenarioContent;
  // if (!household || Object.keys(household).length === 0) return 'draft';
  // if (!incomeSources || incomeSources.length === 0) return 'draft';
  // if (housingType === 'rent' && (!housingExpense.rentAmount || housingExpense.rentAmount <= 0)) return 'draft';
  // if (housingType === 'buy' && (!housingExpense.propertyValue || housingExpense.propertyValue <= 0)) return 'draft';
  // ... add checks for other core modules based on PRD requirements ...

  // Simple placeholder:
  if (scenarioContent && scenarioContent.household && Object.keys(scenarioContent.household).length > 0) {
    // Further checks would go here. For now, just having a household makes it 'complete' for this placeholder.
    // A real implementation will iterate through all essential fields/sections.
    // For example:
    // - Household details (name, members)
    // - At least one income source
    // - Housing selection (rent/buy) and its core details filled
    // - etc.
    // If any of these are missing, it should be 'draft'.
    return 'complete'; // Placeholder: Mark as complete if household exists
  }
  
  return 'draft'; // Default to draft
}; 