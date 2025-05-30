import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import { UpdateScenarioInput } from '@/types/scenario';

/**
 * Custom hook for auto-saving scenario data as it changes
 * @param scenarioId - The ID of the scenario to auto-save
 * @returns Object with functions and state for auto-save
 */
export const useAutoSave = (scenarioId: string | null) => {
  const scheduleAutoSave = useStore(state => state.scheduleAutoSave);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear the status after a delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      timeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000); // Clear the "saved" status after 3 seconds
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveStatus]);

  // Function to trigger auto-save
  const save = useCallback((updates: UpdateScenarioInput) => {
    if (!scenarioId) {
      setErrorMessage('No active scenario to save');
      setSaveStatus('error');
      return;
    }

    // Set saving status
    setSaveStatus('saving');
    
    try {
      // Call the store's auto-save function
      scheduleAutoSave(scenarioId, updates);
      
      // Update last saved time
      setLastSaved(new Date());
      setSaveStatus('saved');
      setErrorMessage(null);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(`Error scheduling auto-save: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Auto-save error:', error);
    }
  }, [scenarioId, scheduleAutoSave]);

  return {
    save,
    lastSaved,
    saveStatus,
    errorMessage
  };
};

export default useAutoSave; 