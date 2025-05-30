import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/store';

/**
 * Custom hook for managing storage limits and providing storage-related functionality
 * @returns Object with functions and state for storage management
 */
export const useStorageManager = () => {
  const refreshStorageStats = useStore(state => state.refreshStorageStats);
  const exportScenarios = useStore(state => state.exportScenarios);
  const importScenarios = useStore(state => state.importScenarios);
  const storageStats = useStore(state => state.storageStats);
  const scenarios = useStore(state => state.scenarios);
  const scenarioList = useStore(state => state.scenarioList);
  const isLoading = useStore(state => state.isLoading);
  const error = useStore(state => state.error);

  const [exportError, setExportError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Refresh storage stats on mount
  useEffect(() => {
    refreshStorageStats();
  }, [refreshStorageStats]);

  // Refresh storage stats when scenarios change
  useEffect(() => {
    refreshStorageStats();
  }, [scenarios, refreshStorageStats]);

  // Function to trigger export
  const handleExport = useCallback(async () => {
    setExportError(null);
    
    try {
      const jsonData = await exportScenarios();
      
      if (jsonData) {
        // Create a download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scenarios-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      } else {
        setExportError('Failed to export scenarios');
        return false;
      }
    } catch (error) {
      setExportError(`Error exporting scenarios: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Export error:', error);
      return false;
    }
  }, [exportScenarios]);

  // Function to trigger import
  const handleImport = useCallback(async (fileOrData: File | string, overwrite = false) => {
    setImportError(null);
    
    try {
      let jsonData: string;
      
      if (typeof fileOrData === 'string') {
        jsonData = fileOrData;
      } else {
        // Read file content
        jsonData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsText(fileOrData);
        });
      }
      
      const success = await importScenarios(jsonData, overwrite);
      
      if (!success) {
        setImportError('Failed to import scenarios');
      }
      
      return success;
    } catch (error) {
      setImportError(`Error importing scenarios: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Import error:', error);
      return false;
    }
  }, [importScenarios]);

  // Check if storage is almost full (over 80% used)
  const isStorageAlmostFull = storageStats ? storageStats.usagePercentage > 80 : false;

  // Check if storage is very full (over 90% used)
  const isStorageVeryFull = storageStats ? storageStats.usagePercentage > 90 : false;

  // Calculate estimated remaining scenario capacity
  const estimatedRemainingCapacity = storageStats ? 
    Math.max(0, storageStats.estimatedCapacity - storageStats.totalScenarios) : 
    0;

  return {
    storageStats,
    isLoading,
    error,
    exportError,
    importError,
    scenarioCount: scenarioList.length,
    isStorageAlmostFull,
    isStorageVeryFull,
    estimatedRemainingCapacity,
    refreshStorageStats,
    exportScenarios: handleExport,
    importScenarios: handleImport,
  };
};

export default useStorageManager; 