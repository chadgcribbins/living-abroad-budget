import { StateCreator } from 'zustand'
import { RootState } from '../types'
import { 
  IncomeSource, 
  IncomeType, 
  FrequencyType,
  calculateMonthlyAmount,
  calculateAnnualAmount 
} from '@/types/income'
import { Money, CurrencyCode, TaxRegimeType } from '@/types/base'
import { v4 as uuidv4 } from 'uuid'

// Define income-specific types for the slice
export interface IncomeData {
  incomes: IncomeSource[]
  taxRegime: TaxRegimeType
  totalGrossIncome: Money
  totalNetIncome: Money
}

export interface IncomeState {
  // State
  tempIncomes: IncomeSource[] // Temporary storage while editing
  taxRegime: TaxRegimeType
  
  // Computed values
  totalGrossIncome: Money
  totalNetIncome: Money
  
  // Actions
  addIncome: (income: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateIncome: (id: string, updates: Partial<IncomeSource>) => void
  deleteIncome: (id: string) => void
  setTaxRegime: (regime: TaxRegimeType) => void
  loadIncomesFromScenario: (incomes: IncomeSource[], taxRegime?: TaxRegimeType) => void
  clearIncomes: () => void
  calculateTotals: () => void
  
  // Utility methods
  calculateNetIncome: (grossIncome: Money, taxRegime: TaxRegimeType) => Money
  getIncomesByPartner: (partner: 'partner1' | 'partner2' | 'joint') => IncomeSource[]
}

const createIncomeSlice: StateCreator<
  RootState,
  [],
  [],
  IncomeState
> = (set, get) => {
  const calculateNetIncome = (grossIncome: Money, taxRegime: TaxRegimeType): Money => {
    let netAmount = grossIncome.amount
    
    switch (taxRegime) {
      case TaxRegimeType.PORTUGAL_NHR:
        // NHR flat tax rate of 20%
        netAmount = grossIncome.amount * 0.8
        break
      case TaxRegimeType.STANDARD:
        // Simplified progressive tax calculation
        // This would need to be more sophisticated in production
        if (grossIncome.amount <= 2000) {
          netAmount = grossIncome.amount * 0.9 // 10% tax
        } else if (grossIncome.amount <= 4000) {
          netAmount = grossIncome.amount * 0.8 // 20% tax
        } else {
          netAmount = grossIncome.amount * 0.7 // 30% tax
        }
        break
      default:
        // Default to 20% tax if regime unknown
        netAmount = grossIncome.amount * 0.8
    }
    
    return {
      amount: netAmount,
      currency: grossIncome.currency
    }
  }

  const calculateTotals = () => {
    const state = get()
    const incomes = state.income.tempIncomes
    const taxRegime = state.income.taxRegime
    
    // Group incomes by currency
    const incomesByCurrency: Partial<Record<CurrencyCode, number>> = {}
    
    incomes.forEach(income => {
      if (income.isActive) {
        const monthlyAmount = calculateMonthlyAmount(income.amount.amount, income.frequency)
        const currency = income.amount.currency
        
        if (!incomesByCurrency[currency]) {
          incomesByCurrency[currency] = 0
        }
        incomesByCurrency[currency]! += monthlyAmount
      }
    })
    
    // For now, we'll use EUR as the default currency and assume single currency
    // In a real implementation, we'd convert using FX rates
    const primaryCurrency = CurrencyCode.EUR
    const totalGrossMonthly = incomesByCurrency[primaryCurrency] || 0
    
    const totalGrossIncome: Money = {
      amount: totalGrossMonthly,
      currency: primaryCurrency
    }
    
    const totalNetIncome = calculateNetIncome(totalGrossIncome, taxRegime)
    
    set((state) => ({
      ...state,
      income: {
        ...state.income,
        totalGrossIncome,
        totalNetIncome
      }
    }))
  }

  return {
    // Initial state
    tempIncomes: [],
    taxRegime: TaxRegimeType.STANDARD,
    totalGrossIncome: { amount: 0, currency: CurrencyCode.EUR },
    totalNetIncome: { amount: 0, currency: CurrencyCode.EUR },
    
    // Actions
    addIncome: (incomeData) => {
      const newIncome: IncomeSource = {
        ...incomeData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      set((state) => {
        const updatedIncomes = [...state.income.tempIncomes, newIncome]
        return {
          ...state,
          income: {
            ...state.income,
            tempIncomes: updatedIncomes
          }
        }
      })
      
      // Recalculate totals after adding
      calculateTotals()
    },
    
    updateIncome: (id, updates) => {
      set((state) => {
        const updatedIncomes = state.income.tempIncomes.map(income =>
          income.id === id
            ? { ...income, ...updates, updatedAt: new Date() }
            : income
        )
        return {
          ...state,
          income: {
            ...state.income,
            tempIncomes: updatedIncomes
          }
        }
      })
      
      // Recalculate totals after updating
      calculateTotals()
    },
    
    deleteIncome: (id) => {
      set((state) => ({
        ...state,
        income: {
          ...state.income,
          tempIncomes: state.income.tempIncomes.filter(income => income.id !== id)
        }
      }))
      
      // Recalculate totals after deleting
      calculateTotals()
    },
    
    setTaxRegime: (regime) => {
      set((state) => ({
        ...state,
        income: {
          ...state.income,
          taxRegime: regime
        }
      }))
      
      // Recalculate totals with new tax regime
      calculateTotals()
    },
    
    loadIncomesFromScenario: (incomes, taxRegime) => {
      set((state) => ({
        ...state,
        income: {
          ...state.income,
          tempIncomes: incomes,
          taxRegime: taxRegime || state.income.taxRegime
        }
      }))
      
      // Calculate totals for loaded incomes
      calculateTotals()
    },
    
    clearIncomes: () => {
      set((state) => ({
        ...state,
        income: {
          ...state.income,
          tempIncomes: [],
          totalGrossIncome: { amount: 0, currency: CurrencyCode.EUR },
          totalNetIncome: { amount: 0, currency: CurrencyCode.EUR }
        }
      }))
    },
    
    calculateTotals,
    calculateNetIncome,
    
    getIncomesByPartner: (partner) => {
      const state = get()
      return state.income.tempIncomes.filter(income => income.partner === partner)
    }
  }
}

export default createIncomeSlice