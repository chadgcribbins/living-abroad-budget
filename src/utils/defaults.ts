import { Household } from '@/types/household';
import { CountryCode, CurrencyCode, FrequencyType, Address } from '@/types/base';
import { FXSettings } from '@/store/types';
import { ResidencyType, TaxRegimeType } from '@/types/base';
import { IncomeSource, IncomeType } from '@/types/income';
import { HousingExpense, HousingType } from '@/types/housing';
import { TransportExpense, TransportType, PublicTransportExpense, PassType, VehicleExpense } from '@/types/transport';
import { UtilityExpense, UtilityServiceType, UtilityPlanType } from '@/types/utilities';
import { LifestyleExpense, LifestyleCategory } from '@/types/lifestyle';
import { EmergencyFund } from '@/types/emergency';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_HOUSEHOLD_COMPOSITION: Household = {
  id: 'default-household',
  members: [],
  // originCountry and destinationCountry will be set dynamically by the scenario
  // Forcing a default here might not be ideal, but let's put placeholders
  originCountry: CountryCode.GB, // Example placeholder
  destinationCountry: CountryCode.PT, // Example placeholder
  residencyStatus: ResidencyType.PERMANENT_RESIDENT,
  taxRegime: TaxRegimeType.STANDARD,
  size: 1,
  dependents: 0,
  createdAt: new Date(), // Will be new Date() on actual creation
  updatedAt: new Date(), // Will be new Date() on actual creation
};

export const DEFAULT_FX_SETTINGS: Record<CurrencyCode | string, FXSettings> = {
  [CurrencyCode.EUR]: {
    baseCurrency: CurrencyCode.EUR,
    displayCurrency: CurrencyCode.EUR,
    manualRates: false,
    customRates: {},
    sensitivityRange: [-0.05, 0.05],
  },
  [CurrencyCode.USD]: {
    baseCurrency: CurrencyCode.USD,
    displayCurrency: CurrencyCode.USD,
    manualRates: false,
    customRates: {},
    sensitivityRange: [-0.05, 0.05],
  },
  [CurrencyCode.GBP]: {
    baseCurrency: CurrencyCode.GBP,
    displayCurrency: CurrencyCode.GBP,
    manualRates: false,
    customRates: {},
    sensitivityRange: [-0.05, 0.05],
  },
  // Add other common destination currencies as needed
};

const defaultAddress: Address = { line1: '', city: '', country: CountryCode.US, postalCode: '' };

export const DEFAULT_INCOME_SOURCES: IncomeSource[] = [
  {
    id: uuidv4(),
    name: 'Primary Job',
    type: IncomeType.EMPLOYMENT,
    partner: 'partner1',
    amount: { amount: 50000, currency: CurrencyCode.USD },
    frequency: FrequencyType.ANNUALLY,
    isActive: true,
    startDate: new Date(),
    taxable: true,
    // taxRate: 0.20, // taxRate is not part of IncomeSource base, might be in EmploymentIncome if needed
    description: 'Main employment income',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const defaultRentHousingExpense: HousingExpense = {
  id: uuidv4(),
  type: HousingType.RENT,
  address: { ...defaultAddress, country: CountryCode.PT },
  mainCost: { amount: 1500, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY },
  // includesUtilities: [], // utilities is a separate field
  furnished: false,
  bedrooms: 2,
  bathrooms: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultOwnHousingExpense: HousingExpense = {
  id: uuidv4(),
  type: HousingType.OWN,
  address: { ...defaultAddress, country: CountryCode.PT },
  mainCost: { amount: 1077, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY }, // Mortgage
  propertyTax: { amount: 3000, currency: CurrencyCode.EUR, frequency: FrequencyType.ANNUALLY },
  // homeInsurance: { amount: 100, currency: CurrencyCode.EUR, frequency: FrequencyType.MONTHLY }, // insurance is an array of InsurancePolicy
  furnished: true,
  bedrooms: 3,
  bathrooms: 2,
  // propertyValue: 300000, // Not directly in HousingExpense, inferred from other details
  // mortgageDetails: { principal: 240000, interestRate: 0.035, termYears: 30 }, // Not directly in HousingExpense
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DEFAULT_HOUSING_EXPENSE: Record<HousingType, HousingExpense> = {
  [HousingType.RENT]: defaultRentHousingExpense,
  [HousingType.OWN]: defaultOwnHousingExpense,
  // HousingType.TEMPORARY would need its own default if used
  [HousingType.TEMPORARY]: { // Basic placeholder for TEMPORARY
    id: uuidv4(),
    type: HousingType.TEMPORARY,
    address: { ...defaultAddress, country: CountryCode.PT },
    mainCost: { amount: 100, currency: CurrencyCode.EUR, frequency: FrequencyType.ONCE },
    furnished: true,
    bedrooms: 1,
    bathrooms: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
};

const defaultCarExpense: VehicleExpense = {
  id: uuidv4(),
  type: TransportType.PRIVATE_CAR,
  vehicle: { make: 'Toyota', model: 'Camry', year: 2022, isElectric: false },
  mainCost: { amount: 0, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY }, // Main cost for vehicle might be loan/lease payment if not owned outright. For owned, it's 0.
  fuel: { amount: 150, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
  insurance: { 
    id: uuidv4(),
    provider: 'Default Insurance',
    cost: {amount: 100, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY},
    coverage: {amount: 50000, currency: CurrencyCode.USD},
    startDate: new Date(),
    isComprehensive: true,
  },
  maintenance: { amount: 50, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
  isCommute: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultPublicTransportExpense: PublicTransportExpense = {
  id: uuidv4(),
  type: TransportType.PUBLIC,
  mainCost: { amount: 80, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
  passType: PassType.MONTHLY,
  zones: ['All'],
  isCommute: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Note: TransportType has PRIVATE_CAR, LEASED_CAR, etc. The old defaults used CAR.
// The types also define VehicleExpense and PublicTransportExpense which are more specific.
export const DEFAULT_TRANSPORT_EXPENSE: Record<TransportType, TransportExpense> = {
  [TransportType.PRIVATE_CAR]: defaultCarExpense,
  [TransportType.PUBLIC]: defaultPublicTransportExpense,
  // Required to provide all enum keys or make the record Partial
  [TransportType.LEASED_CAR]: { ...defaultCarExpense, type: TransportType.LEASED_CAR, mainCost: {amount: 300, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY} }, // Example for leased
  [TransportType.TAXI]: { id:uuidv4(), type: TransportType.TAXI, mainCost: {amount: 50, currency:CurrencyCode.USD, frequency: FrequencyType.MONTHLY}, isCommute:false, createdAt: new Date(), updatedAt: new Date()},
  [TransportType.RIDESHARE]: { id:uuidv4(), type: TransportType.RIDESHARE, mainCost: {amount: 60, currency:CurrencyCode.USD, frequency: FrequencyType.MONTHLY}, isCommute:false, createdAt: new Date(), updatedAt: new Date()},
  [TransportType.BICYCLE]: { id:uuidv4(), type: TransportType.BICYCLE, mainCost: {amount: 0, currency:CurrencyCode.USD, frequency: FrequencyType.MONTHLY}, isCommute:true, createdAt: new Date(), updatedAt: new Date()},
  [TransportType.WALKING]: { id:uuidv4(), type: TransportType.WALKING, mainCost: {amount: 0, currency:CurrencyCode.USD, frequency: FrequencyType.MONTHLY}, isCommute:true, createdAt: new Date(), updatedAt: new Date()},
  [TransportType.OTHER]: { id:uuidv4(), type: TransportType.OTHER, mainCost: {amount: 0, currency:CurrencyCode.USD, frequency: FrequencyType.MONTHLY}, isCommute:false, createdAt: new Date(), updatedAt: new Date()},
};

export const DEFAULT_UTILITY_EXPENSES: Partial<Record<UtilityServiceType, UtilityExpense>> = {
  [UtilityServiceType.ELECTRICITY]: {
    id: uuidv4(),
    type: UtilityServiceType.ELECTRICITY,
    provider: 'Default Electric Co.',
    planType: UtilityPlanType.FIXED,
    baseCost: { amount: 100, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
    included: false,
    notes: 'Based on average usage',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  [UtilityServiceType.INTERNET]: {
    id: uuidv4(),
    type: UtilityServiceType.INTERNET,
    provider: 'Default ISP',
    planType: UtilityPlanType.FIXED,
    baseCost: { amount: 60, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
    included: false,
    // connectionSpeed: '100 Mbps', // Part of ConnectivityPlan, not base UtilityExpense
    createdAt: new Date(),
    updatedAt: new Date(),
  }
};

export const DEFAULT_LIFESTYLE_EXPENSES: LifestyleExpense[] = [
  {
    id: uuidv4(),
    category: LifestyleCategory.DINING,
    description: 'Dining Out',
    amount: { amount: 200, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
    priority: 'optional',
    shared: true,
    notes: 'Restaurants and takeaways',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    category: LifestyleCategory.SHOPPING, // Changed from GROCERIES to match enum; Groceries might be a specific description under SHOPPING or OTHER
    description: 'Groceries',
    amount: { amount: 400, currency: CurrencyCode.USD, frequency: FrequencyType.MONTHLY },
    priority: 'essential',
    shared: true,
    notes: 'Weekly grocery shopping',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const DEFAULT_EMERGENCY_FUND: EmergencyFund = {
  id: uuidv4(),
  targetMonths: 3,
  currentBalance: { amount: 5000, currency: CurrencyCode.USD },
  monthlyContribution: { amount: 200, currency: CurrencyCode.USD },
  minimumBalance: { amount: 1000, currency: CurrencyCode.USD }, // Added based on type
  location: 'Savings Account', // Added based on type
  isLiquid: true, // Added based on type
  notes: 'Emergency savings fund',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// We will add other DEFAULT constants here (DEFAULT_INCOME_SOURCES, etc.) 