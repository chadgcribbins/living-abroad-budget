# Income Module

The Income Module is the first Phase 2 module implemented for the Living Abroad Budget platform. It provides comprehensive income tracking and tax calculation functionality for international relocation planning.

## Overview

The Income Module allows users to:
- Track multiple income sources for Partner 1, Partner 2, or joint income
- Support different income types (employment, passive, one-off)
- Apply tax regimes (Standard or Portugal NHR)
- Calculate gross and net income totals
- Handle multi-currency income sources
- Integrate seamlessly with scenario management

## Architecture

### State Management

The module uses a dedicated Zustand slice (`incomeSlice.ts`) that integrates with the main store:

```typescript
interface IncomeState {
  tempIncomes: IncomeSource[]
  taxRegime: TaxRegimeType
  totalGrossIncome: Money
  totalNetIncome: Money
  // ... actions
}
```

### Type System

Enhanced the existing income types with partner tracking:

```typescript
type IncomePartner = 'partner1' | 'partner2' | 'joint'

interface IncomeSource {
  // ... existing fields
  partner: IncomePartner
  taxTreatment?: 'standard' | 'nhr' | 'exempt'
}
```

### Components

**IncomeForm.tsx**
- Main form component for income management
- Handles CRUD operations for income sources
- Integrates with scenario saving
- Provides tax regime selection
- Shows real-time income summary

## Features

### Income Source Management
- Add, edit, and delete income sources
- Support for employment, passive, and one-off income
- Partner assignment (Partner 1, Partner 2, or Joint)
- Currency selection per income source
- Frequency options (monthly, annual, etc.)
- Tax treatment options

### Tax Calculations
- **Portugal NHR**: 20% flat tax rate
- **Standard**: Progressive tax rates (simplified)
  - Up to €2,000/month: 10%
  - €2,000-4,000/month: 20%
  - Above €4,000/month: 30%

### Integration Points
- Saves income data to scenario content
- Loads existing income data when editing scenarios
- Updates scenario tax regime settings
- Works with FX slice for currency display

## Usage

### In Scenario Edit Flow

The Income Module is accessible through the scenario edit page:

1. Navigate to a scenario
2. Click "Edit" to open the scenario editor
3. Select the "Income" tab
4. Add/edit income sources
5. Save to persist changes to the scenario

### Form Fields

- **Income Source Name**: Descriptive name (e.g., "Main Salary")
- **Income Type**: Employment, Passive, or One-off
- **Partner**: Which partner this income belongs to
- **Amount**: Numeric income amount
- **Currency**: Currency of the income
- **Frequency**: How often the income is received
- **Taxable**: Whether the income is subject to tax
- **Tax Treatment**: How the income is taxed (if taxable)

## Implementation Details

### Key Decisions

1. **Temporary Storage**: Income data is stored temporarily in the slice while editing, then saved to the scenario
2. **Partner Field**: Added to the base IncomeSource type for clear ownership tracking
3. **Tax Simplification**: Implemented simplified tax calculations suitable for planning (not tax filing)
4. **Currency Handling**: Each income can have its own currency, with totals in EUR by default

### Integration with Scenarios

```typescript
// Income data is stored in scenario content
interface ScenarioContent {
  // ... other fields
  incomeSources: IncomeSource[]
  household: {
    // ... other fields
    taxRegime: TaxRegimeType
  }
}
```

### State Flow

1. User opens scenario edit page
2. Income data loads from scenario into temporary state
3. User makes changes (add/edit/delete)
4. Changes are reflected in real-time calculations
5. User saves, persisting to scenario storage

## Testing Considerations

### Unit Tests Needed
- Tax calculation accuracy
- Income CRUD operations
- Currency conversion logic
- Form validation

### Integration Tests
- Scenario saving/loading
- Multi-currency scenarios
- Tax regime switching

## Future Enhancements

1. **Advanced Tax Calculations**
   - More detailed tax brackets
   - Country-specific tax rules
   - Deductions and allowances

2. **Income Projections**
   - Salary growth modeling
   - Bonus probability calculations
   - Seasonal income patterns

3. **FX Integration**
   - Real-time currency conversion
   - Multi-currency totals
   - FX sensitivity in income

4. **Reporting**
   - Income breakdown charts
   - Tax efficiency analysis
   - Partner income comparison

## Migration Notes

The Income Module replaced the previous placeholder income slice that was removed during the cleanup phase. The new implementation:
- Uses proper TypeScript types
- Follows established patterns from other slices
- Integrates with the scenario system
- Provides a complete UI workflow