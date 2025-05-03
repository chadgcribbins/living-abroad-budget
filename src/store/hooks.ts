import { useStore } from './index'
import { RootState } from './types'
import { useCallback, useMemo } from 'react'
import { CountryCode } from '@/types/base'

// Profile selectors
const getHousehold = (state: RootState) => state.profile.household
const getIsComplete = (state: RootState) => state.profile.isComplete
const getActiveCountry = (state: RootState) => state.profile.activeCountry

// Profile hooks
export const useHousehold = () => useStore(getHousehold)
export const useIsHouseholdComplete = () => useStore(getIsComplete)
export const useActiveCountry = () => useStore(getActiveCountry)

// Profile actions hooks
export const useProfileActions = () => {
  const setHousehold = useStore((state) => state.profile.setHousehold)
  const updateHousehold = useStore((state) => state.profile.updateHousehold)
  const clearHousehold = useStore((state) => state.profile.clearHousehold)
  const setActiveCountry = useStore((state) => state.profile.setActiveCountry)
  
  return {
    setHousehold,
    updateHousehold,
    clearHousehold,
    setActiveCountry
  }
}

// Combined profile hook for all profile state and actions
export const useProfile = () => {
  const household = useHousehold()
  const isComplete = useIsHouseholdComplete()
  const activeCountry = useActiveCountry()
  const actions = useProfileActions()
  
  return {
    household,
    isComplete,
    activeCountry,
    ...actions
  }
}

// Example of a memoized selector for derived state
export const useHouseholdSize = () => {
  const household = useHousehold()
  
  return useMemo(() => {
    if (!household) return { members: 0, dependents: 0 }
    
    const members = household.members?.length || 0
    const dependents = household.members?.filter(m => m.isDependent)?.length || 0
    
    return { members, dependents }
  }, [household])
}

// Example of custom action with state computation
export const useSwitchCountry = () => {
  const { setActiveCountry } = useProfileActions()
  const activeCountry = useActiveCountry()
  const household = useHousehold()
  
  return useCallback((targetCountry?: CountryCode) => {
    // If explicit country provided, use it
    if (targetCountry) {
      setActiveCountry(targetCountry)
      return
    }
    
    // Otherwise toggle between origin/destination
    if (household?.originCountry && household?.destinationCountry) {
      const currentActiveCountry = useStore.getState().profile.activeCountry
      
      if (currentActiveCountry === household.originCountry) {
        setActiveCountry(household.destinationCountry)
      } else {
        setActiveCountry(household.originCountry)
      }
    }
  }, [setActiveCountry, household, activeCountry])
}

// Additional hooks can be added for other slices of state 