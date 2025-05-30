'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useScenarioStore } from '@/store/hooks';
import Link from 'next/link';

const DebugPage = () => {
  const [storageData, setStorageData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const scenarioStore = useScenarioStore();
  
  useEffect(() => {
    console.log('Scenario store in debug page:', scenarioStore);
  }, [scenarioStore]);

  // Function to check localStorage
  const checkLocalStorage = () => {
    try {
      // Get all keys
      const keys = Object.keys(localStorage);
      const data: Record<string, any> = {};
      
      // Get values for each key
      keys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          } else {
            data[key] = null;
          }
        } catch (e) {
          data[key] = `[Error parsing: ${e instanceof Error ? e.message : String(e)}]`;
        }
      });
      
      setStorageData(JSON.stringify(data, null, 2));
      setError(null);
    } catch (e) {
      setError(`Error accessing localStorage: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.clear();
      setStorageData('');
      setError('localStorage cleared successfully');
    } catch (e) {
      setError(`Error clearing localStorage: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen text-gray-800">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p className="mb-4">Current application state and debugging utilities.</p>
      
      <div className="flex gap-2 mb-4">
        <Button onClick={checkLocalStorage}>Check localStorage</Button>
        <Button onClick={clearLocalStorage} variant="secondary">Clear localStorage</Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">scenarioStore State</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[200px]">
          {JSON.stringify(scenarioStore, (key, value) => 
            typeof value === 'function' ? '[Function]' : value, 2)}
        </pre>
      </div>
      
      {storageData && (
        <div>
          <h2 className="text-xl font-bold mb-2">localStorage Contents</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">
            {storageData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPage; 