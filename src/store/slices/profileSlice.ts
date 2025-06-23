import { StateCreator } from 'zustand'
import { RootState, ProfileState } from '../types'
import { Household, HouseholdMember, HouseholdRelationship } from '@/types/household'
import { CountryCode, ResidencyType, TaxRegimeType } from '@/types/base'
import { v4 as uuidv4 } from 'uuid'

const initialProfileState = {
  household: null,
  isComplete: false,
  activeCountry: null,
  isHydrated: false,
} as unknown as ProfileState;

const createProfileSlice: StateCreator<
  RootState,
  [],
  [],
  ProfileState
> = (set, get) => {
  // Log the state of isComplete as the slice is being initialized/rehydrated
  if (typeof window !== 'undefined') { // Only log this on client
    try {
      const profileStateFromGet = get().profile;
      console.error('[profileSlice.ts CREATE_SLICE] isComplete from get().profile.isComplete:', profileStateFromGet?.isComplete, 'isHydrated:', profileStateFromGet?.isHydrated);
    } catch (e) {
      console.error('[profileSlice.ts CREATE_SLICE] Error accessing get().profile during initial create:', e);
    }
  }

  return {
    ...initialProfileState,
    setHousehold: (household: Household | null) => {
      console.error('[profileSlice.ts] ***** setHousehold CALLED with:', household);
      set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          household: household,
          isComplete: !!household && household.members.length > 0,
          activeCountry: state.profile.activeCountry,
        }
      }));
      const finalState = get().profile;
      console.log('[profileSlice.ts] setHousehold - new isComplete:', finalState.isComplete);
    },
    updateHousehold: (updates: Partial<Household>) => {
      console.error('[profileSlice.ts] ***** updateHousehold CALLED with updates:', updates);
      set((state) => {
        const newHousehold = state.profile.household ? { ...state.profile.household, ...updates } : (updates as Household);
        return {
          ...state,
          profile: {
            ...state.profile,
            household: newHousehold,
            isComplete: !!newHousehold && !!newHousehold.members && newHousehold.members.length > 0,
            activeCountry: state.profile.activeCountry,
          }
        };
      });
      const finalState = get().profile;
      console.log('[profileSlice.ts] updateHousehold - new isComplete:', finalState.isComplete);
    },
    updateHouseholdMembers: (members: Partial<HouseholdMember>[]) => {
      console.error('[profileSlice.ts] ***** updateHouseholdMembers CALLED with members:', members);
      set((state) => {
        const newHouseholdMembers: HouseholdMember[] = members.map((m) => {
          let nameParts: string[] = ['', ''];
          if (typeof m.firstName === 'string') {
            nameParts = [m.firstName, m.lastName || ''];
          } else if (m.hasOwnProperty('name') && typeof (m as { name?: string }).name === 'string') {
            nameParts = ((m as { name: string }).name || '').split(' ');
          }

          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          return {
            id: m.id || uuidv4(),
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: m.dateOfBirth || new Date(),
            relationship: m.relationship || HouseholdRelationship.OTHER,
            isDependent: m.relationship === HouseholdRelationship.CHILD,
          };
        });

        const currentHousehold = state.profile.household;
        let updatedHousehold: Household;

        if (currentHousehold) {
          updatedHousehold = { 
            ...currentHousehold, 
            members: newHouseholdMembers,
            size: newHouseholdMembers.length,
            dependents: newHouseholdMembers.filter(mem => mem.isDependent).length,
            updatedAt: new Date(),
          };
        } else {
          updatedHousehold = {
            id: uuidv4(),
            members: newHouseholdMembers,
            originCountry: '' as CountryCode,
            destinationCountry: '' as CountryCode,
            residencyStatus: '' as ResidencyType,
            taxRegime: '' as TaxRegimeType,
            size: newHouseholdMembers.length,
            dependents: newHouseholdMembers.filter(mem => mem.isDependent).length,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        return {
          ...state,
          profile: {
            ...state.profile,
            household: updatedHousehold,
            isComplete: updatedHousehold.members.length > 0,
            activeCountry: state.profile.activeCountry,
          }
        };
      });
      const finalState = get().profile;
      console.log('[profileSlice.ts] updateHouseholdMembers - new isComplete:', finalState.isComplete);
    },
    clearHousehold: () => {
      console.error('[profileSlice.ts] ***** clearHousehold CALLED');
      set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          household: null,
          isComplete: false,
          activeCountry: null,
        }
      }));
    },
    setActiveCountry: (country: CountryCode | null) =>
      set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          activeCountry: country,
        }
      })),
    setHydrated: () => {
      console.log('[profileSlice.ts] setHydrated called. Setting isHydrated to true.');
      set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          isHydrated: true,
        }
      }));
      console.log('[profileSlice.ts] isHydrated is now:', get().profile.isHydrated);
    },
  }
};

export default createProfileSlice; 