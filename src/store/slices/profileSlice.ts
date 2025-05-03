import { StateCreator } from 'zustand'
import { RootState, ProfileState } from '../types'
import { CountryCode } from '@/types/base'
import { Household } from '@/types/household'
import { v4 as uuidv4 } from 'uuid'

/**
 * Profile slice creator for managing household information
 */
export const createProfileSlice: StateCreator<
  RootState,
  [],
  [],
  ProfileState
> = (set, get) => ({
  // Initial state for profile slice
  household: null,
  isComplete: false,
  activeCountry: null,

  // Actions
  setHousehold: (household: Household) => {
    // Ensure the household has an ID and timestamps
    const now = new Date()
    const householdWithMeta = {
      ...household,
      id: household.id || uuidv4(),
      createdAt: household.createdAt || now,
      updatedAt: now
    }

    set((state) => ({
      ...state,
      household: householdWithMeta,
      isComplete: true
    }))
  },
  
  updateHousehold: (updates: Partial<Household>) => {
    const currentState = get()
    
    if (!currentState.profile.household) {
      console.error('Cannot update a non-existent household')
      return
    }
    
    const updatedHousehold = {
      ...currentState.profile.household,
      ...updates,
      updatedAt: new Date()
    }
    
    set((state) => ({
      ...state,
      household: updatedHousehold,
      isComplete: Boolean(
        updatedHousehold.members?.length > 0 &&
        updatedHousehold.originCountry &&
        updatedHousehold.destinationCountry
      )
    }))
  },
  
  clearHousehold: () => {
    set((state) => ({
      ...state,
      household: null,
      isComplete: false,
      activeCountry: null
    }))
  },
  
  setActiveCountry: (country: CountryCode) => {
    set((state) => ({
      ...state,
      activeCountry: country
    }))
  }
}) 