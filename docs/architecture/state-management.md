# State Management

This document outlines the state management architecture of the Living Abroad Budget application using Zustand.

## Overview

The application uses Zustand for state management with a modular, slice-based architecture. Each domain of the application has its own slice of state, with specific actions for managing that part of the state.

## Key Features

- **Modular Slices**: State is divided into domain-specific slices (profile, income, housing, etc.)
- **TypeScript Integration**: Complete type definitions for state and actions
- **Persistence**: LocalStorage persistence with versioning for schema migrations
- **Developer Tools**: Integration with Redux DevTools for debugging
- **Optimized Selectors**: Memoized selectors for derived state calculations
- **Custom Hooks**: Component-specific hooks for accessing state

## State Structure

The global state is organized into the following slices:

| Slice | Purpose | Key State |
|-------|---------|-----------|
| Profile | Household information | Household members, countries |
| Income | Income sources | Employment, passive income |
| Housing | Housing expenses | Rent/buy options, costs |
| Education | Education expenses | Schools, tuition |
| Healthcare | Healthcare costs | Insurance, medical expenses |
| Transportation | Transport costs | Vehicles, public transit |
| Lifestyle | Discretionary spending | Entertainment, dining |
| Utilities | Utility expenses | Electricity, internet, etc. |
| Emergency | Emergency planning | Emergency fund calculations |
| FX | Currency settings | Exchange rates, sensitivity |
| Scenarios | Scenario management | Saved scenarios, comparisons |
| UI | Interface state | Theme, navigation state |

## Implementation

### Store Creation

The store is created using Zustand's `create` function with middleware for dev tools and persistence:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { persistMiddleware } from './persistMiddleware'

export const useStore = create<RootState>()(
  devtools(
    persistMiddleware(
      (set, get, api) => ({
        // Slices combined here
        ...createProfileSlice(set, get, api),
        // ...other slices
      })
    ),
    { name: 'living-abroad-budget-store' }
  )
)
```

### Slice Implementation

Each slice follows a consistent pattern:

```typescript
export const createSomeSlice: StateCreator<
  RootState,
  [],
  [],
  SomeSliceState
> = (set, get) => ({
  // Initial state
  someData: initialValue,
  
  // Actions
  setSomeData: (data) => set({ someData: data }),
  updateSomeData: (updates) => {
    const { someData } = get()
    set({ someData: { ...someData, ...updates } })
  }
})
```

### Persistence

State is persisted to LocalStorage with version control for schema migrations:

```typescript
const persistConfig = {
  name: 'storage-key',
  storage: createJSONStorage(() => versionedStorage),
  partialize: (state) => ({
    // Selectively persist parts of the state
    profile: {
      household: state.profile.household,
      // ... other persisted fields
    },
    // ... other slices
  })
}
```

## Component Usage

Components access state using custom hooks:

```tsx
// Example component using state
import { useProfile } from '@/store/hooks'

export const ProfileComponent = () => {
  const { household, updateHousehold } = useProfile()
  
  return (
    <div>
      <h1>{household?.name}</h1>
      <button onClick={() => updateHousehold({ name: 'New Name' })}>
        Update
      </button>
    </div>
  )
}
```

## Memoized Selectors

For derived data, we use memoized selectors:

```typescript
export const useHouseholdSize = () => {
  const household = useHousehold()
  
  return useMemo(() => {
    if (!household) return { members: 0, dependents: 0 }
    
    const members = household.members?.length || 0
    const dependents = household.members?.filter(m => m.isDependent)?.length || 0
    
    return { members, dependents }
  }, [household])
}
```

## Best Practices

1. **State Updates**: Always use the `set` function to update state
2. **Immutability**: Never mutate state directly
3. **Slicing**: Keep slices focused on one domain area
4. **Selectors**: Use memoized selectors for derived values
5. **Types**: Ensure complete TypeScript coverage
6. **Actions**: Keep actions in the same slice as the state they modify
7. **Persistence**: Only persist necessary data, not derived values

## Further Reading

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Integration](https://github.com/pmndrs/zustand/blob/main/docs/typescript.md) 