import { StorageOperationResult } from '@/types/scenario';

// Define constants for storage
export const STORAGE_PREFIX = 'lab'; // living-abroad-budget
export const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB (LocalStorage limit in most browsers)
export const DEFAULT_STORAGE_NAMESPACE = 'scenarios';

// Helper type for prefixed storage keys
export type StorageNamespace = 'scenarios' | 'preferences' | 'temp';

/**
 * Generate a prefixed storage key
 */
export const getStorageKey = (key: string, namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE): string => {
  return `${STORAGE_PREFIX}:${namespace}:${key}`;
};

/**
 * Check if LocalStorage is available in the current environment
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = `${STORAGE_PREFIX}:test`;
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return result === 'test';
  } catch (e) {
    return false;
  }
};

/**
 * Get a value from localStorage
 */
export const getStorageItem = <T>(
  key: string, 
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult<T> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    const storedValue = localStorage.getItem(getStorageKey(key, namespace));
    
    if (!storedValue) {
      return {
        success: false,
        error: `No data found for key: ${key}`
      };
    }
    
    const parsedValue = JSON.parse(storedValue) as T;
    
    return {
      success: true,
      data: parsedValue
    };
  } catch (error) {
    return {
      success: false,
      error: `Error retrieving data for key ${key}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Calculate the size of data in bytes
 */
export const calculateStorageSize = (data: unknown): number => {
  const jsonString = JSON.stringify(data);
  
  // In JavaScript, each character is 2 bytes (UTF-16)
  return jsonString.length * 2;
};

/**
 * Get current localStorage usage statistics
 */
export const getStorageStats = (): StorageOperationResult<{
  used: number;
  available: number;
  total: number;
  usagePercentage: number;
}> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    // Calculate the current usage
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length * 2 + value.length * 2;
        }
      }
    }

    return {
      success: true,
      data: {
        used: totalSize,
        available: MAX_STORAGE_SIZE - totalSize,
        total: MAX_STORAGE_SIZE,
        usagePercentage: (totalSize / MAX_STORAGE_SIZE) * 100
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Error calculating storage stats: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Check if there's enough space for the given data
 */
export const hasEnoughSpace = (data: unknown): StorageOperationResult => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    const dataSize = calculateStorageSize(data);
    const statsResult = getStorageStats();
    
    if (!statsResult.success || !statsResult.data) {
      return {
        success: false,
        error: statsResult.error || 'Failed to get storage stats'
      };
    }
    
    const { available } = statsResult.data;
    
    if (dataSize > available) {
      return {
        success: false,
        error: `Not enough storage space. Needed: ${dataSize} bytes, Available: ${available} bytes`
      };
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Error checking storage space: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Set a value in localStorage with space validation
 */
export const setStorageItem = <T>(
  key: string, 
  value: T, 
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    // First check if we're updating an existing item
    const storageKey = getStorageKey(key, namespace);
    const existingItem = localStorage.getItem(storageKey);
    
    // If updating, check space requirements for the delta
    if (existingItem) {
      const existingSize = existingItem.length * 2;
      const newSize = calculateStorageSize(value);
      
      // Only check if new size is larger than existing
      if (newSize > existingSize) {
        const statsResult = getStorageStats();
        
        if (!statsResult.success || !statsResult.data) {
          return {
            success: false,
            error: statsResult.error || 'Failed to get storage stats'
          };
        }
        
        const { available } = statsResult.data;
        const additionalSpaceNeeded = newSize - existingSize;
        
        if (additionalSpaceNeeded > available) {
          return {
            success: false,
            error: `Not enough storage space. Additional needed: ${additionalSpaceNeeded} bytes, Available: ${available} bytes`
          };
        }
      }
    } else {
      // For new items, check total space
      const spaceCheckResult = hasEnoughSpace(value);
      if (!spaceCheckResult.success) {
        return spaceCheckResult;
      }
    }
    
    // Store the item
    localStorage.setItem(storageKey, JSON.stringify(value));
    
    return { success: true };
  } catch (error) {
    if (error instanceof DOMException && (
      // everything except Firefox
      error.name === 'QuotaExceededError' ||
      // Firefox
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      return {
        success: false,
        error: 'LocalStorage quota exceeded. Try removing some items before adding new ones.'
      };
    }
    
    return {
      success: false,
      error: `Error storing data for key ${key}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Remove an item from localStorage
 */
export const removeStorageItem = (
  key: string, 
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    localStorage.removeItem(getStorageKey(key, namespace));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Error removing data for key ${key}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Get all keys from localStorage with a specific namespace
 */
export const getStorageKeys = (
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult<string[]> => {
  console.log(`storageUtils: getStorageKeys for namespace '${namespace}'`);
  
  if (!isStorageAvailable()) {
    console.error('storageUtils: localStorage is not available');
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    const keys: string[] = [];
    const namespacePrefix = `${STORAGE_PREFIX}:${namespace}:`;
    console.log(`storageUtils: looking for keys with prefix '${namespacePrefix}'`);
    
    // Log every key in localStorage to help debugging
    console.log('storageUtils: all keys in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`  - ${key}`);
    }
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(namespacePrefix)) {
        // Extract the actual ID without the prefix
        const id = key.substring(namespacePrefix.length);
        keys.push(id);
      }
    }
    
    console.log(`storageUtils: found ${keys.length} keys for namespace '${namespace}':`, keys);
    return {
      success: true,
      data: keys
    };
  } catch (error) {
    console.error('storageUtils: error in getStorageKeys', error);
    return {
      success: false,
      error: `Error getting storage keys: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Clear all items in a namespace
 */
export const clearNamespace = (
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    const keysResult = getStorageKeys(namespace);
    
    if (!keysResult.success || !keysResult.data) {
      return {
        success: false,
        error: keysResult.error || 'Failed to get storage keys'
      };
    }
    
    keysResult.data.forEach(key => {
      removeStorageItem(key, namespace);
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Error clearing namespace ${namespace}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Export all data in a namespace
 */
export const exportNamespaceData = <T>(
  namespace: StorageNamespace = DEFAULT_STORAGE_NAMESPACE
): StorageOperationResult<Record<string, T>> => {
  if (!isStorageAvailable()) {
    return {
      success: false,
      error: 'LocalStorage is not available in this environment'
    };
  }

  try {
    const keysResult = getStorageKeys(namespace);
    
    if (!keysResult.success || !keysResult.data) {
      return {
        success: false,
        error: keysResult.error || 'Failed to get storage keys'
      };
    }
    
    const data: Record<string, T> = {};
    
    for (const key of keysResult.data) {
      const itemResult = getStorageItem<T>(key, namespace);
      if (itemResult.success && itemResult.data) {
        data[key] = itemResult.data;
      }
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: `Error exporting namespace ${namespace}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}; 