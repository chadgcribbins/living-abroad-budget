import { useStore } from './index'
import { useMemo, useCallback } from 'react'
import { CountryCode } from '@/types/base'

// Profile hooks - simplified
export const useProfile = () => {
  const profile = useStore((state) => state.profile);
  
  return {
    household: profile.household,
    isComplete: profile.isComplete,
    activeCountry: profile.activeCountry,
    isHydrated: profile.isHydrated,
    // Actions
    setHousehold: profile.setHousehold,
    updateHousehold: profile.updateHousehold,
    updateHouseholdMembers: profile.updateHouseholdMembers,
    clearHousehold: profile.clearHousehold,
    setActiveCountry: profile.setActiveCountry,
    setHydrated: profile.setHydrated,
  };
};

// Scenario hooks - simplified
export const useScenarios = () => {
  return useStore((state) => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    activeScenario: state.activeScenario,
    scenarioList: state.scenarioList,
    isLoading: state.isLoading,
    error: state.error,
    storageStats: state.storageStats,
    // Actions
    loadScenarios: state.loadScenarios,
    setActiveScenarioId: state.setActiveScenarioId,
    createScenario: state.createScenario,
    updateScenario: state.updateScenario,
    deleteScenario: state.deleteScenario,
    duplicateScenario: state.duplicateScenario,
    exportScenarios: state.exportScenarios,
    importScenarios: state.importScenarios,
    createTemplateScenario: state.createTemplateScenario,
    refreshStorageStats: state.refreshStorageStats,
    scheduleAutoSave: state.scheduleAutoSave,
    fromActiveScenario: state.fromActiveScenario,
  }));
};

// FX hooks - simplified
export const useFX = () => {
  return useStore((state) => ({
    settings: state.fx.settings,
    rates: state.fx.rates,
    isLoading: state.fx.isLoading,
    error: state.fx.error,
    lastUpdated: state.fx.lastUpdated,
    // Actions
    loadInitialFXData: state.fx.loadInitialFXData,
    updateFXSettings: state.fx.updateFXSettings,
    addExchangeRate: state.fx.addExchangeRate,
    updateExchangeRate: state.fx.updateExchangeRate,
    getExchangeRate: state.fx.getExchangeRate,
    convertAmount: state.fx.convertAmount,
  }));
};

// UI hooks - simplified
export const useUI = () => {
  return useStore((state) => ({
    activeView: state.ui.activeView,
    sidebarOpen: state.ui.sidebarOpen,
    theme: state.ui.theme,
    // Actions
    setActiveView: state.ui.setActiveView,
    toggleSidebar: state.ui.toggleSidebar,
    setTheme: state.ui.setTheme,
  }));
};

// Derived state hooks
export const useHouseholdSize = () => {
  const household = useStore((state) => state.profile.household);
  
  return useMemo(() => {
    if (!household) return { members: 0, dependents: 0 };
    
    const members = household.members?.length || 0;
    const dependents = household.members?.filter(m => m.isDependent)?.length || 0;
    
    return { members, dependents };
  }, [household]);
};

export const useSwitchCountry = () => {
  const { setActiveCountry } = useProfile();
  const activeCountry = useStore((state) => state.profile.activeCountry);
  const household = useStore((state) => state.profile.household);
  
  return useCallback((targetCountry?: CountryCode) => {
    if (targetCountry) {
      setActiveCountry(targetCountry);
      return;
    }
    
    if (household?.originCountry && household?.destinationCountry) {
      if (activeCountry === household.originCountry) {
        setActiveCountry(household.destinationCountry);
      } else {
        setActiveCountry(household.originCountry);
      }
    }
  }, [setActiveCountry, household, activeCountry]);
};

// Navigation and theme hooks
export const useNavigation = () => {
  const ui = useUI();
  
  return {
    activeView: ui.activeView,
    sidebarOpen: ui.sidebarOpen,
    setActiveView: ui.setActiveView,
    toggleSidebar: ui.toggleSidebar,
  };
};

export const useTheme = () => {
  const ui = useUI();
  
  return {
    theme: ui.theme,
    setTheme: ui.setTheme,
  };
};

// Legacy compatibility exports
export const useScenarioStore = useScenarios;
export const useUIState = useUI;
export const useHousehold = () => useStore((state) => state.profile.household);
export const useIsHouseholdComplete = () => useStore((state) => state.profile.isComplete);
export const useActiveCountry = () => useStore((state) => state.profile.activeCountry);
export const useIsProfileHydrated = () => useStore((state) => state.profile.isHydrated); 