import { create, StoreApi } from 'zustand';
import { RootState, FXSettings, Scenario, IncomeState, HousingState, EducationState, HealthcareState, TransportationState, LifestyleState, UtilitiesState, EmergencyState, ProfileState, UIState } from '@/store/types';
import { createFXSlice } from '../fxSlice';
import { CurrencyCode } from '@/types/base';
import { fetchLatestRates } from '@/services/fx';
import { DEFAULT_FX_SETTINGS } from '../fxSlice';

// Mock the fetchLatestRates service
jest.mock('@/services/fx', () => ({
  fetchLatestRates: jest.fn(),
}));

// Helper to create a full store instance for testing
const createTestStore = () => 
  create<RootState>((set, get, api) => {
    const fxSlice = createFXSlice(set, get, api);

    const mockProfileState: ProfileState = {
      household: null,
      isComplete: false,
      activeCountry: null,
      setHousehold: jest.fn(),
      updateHousehold: jest.fn(),
      clearHousehold: jest.fn(),
      setActiveCountry: jest.fn(),
    };

    const mockUISliceState: UIState = {
      sidebarOpen: false, 
      activeModal: null, 
      theme: 'light',
      setActiveView: jest.fn(), 
      toggleSidebar: jest.fn(),
      setTheme: jest.fn(),
    };

    const mockScenario: Scenario = {
      id: 'test-scenario',
      name: 'Test Scenario',
      description: '',
      content: { schemaVersion: '1.0', items: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
      household: { id:'mock-hh', name:'Mock Household', originCountry: CurrencyCode.USD, destinationCountry: CurrencyCode.EUR, members:[], residencyStatus: 'CITIZEN', taxRegime: 'STANDARD', size:1, dependents: 0, createdAt: new Date(), updatedAt: new Date() },
    };
    
    // More detailed minimal mocks for other state slices
    const mockIncomeState: IncomeState = {
      incomeSources: [],
      primaryCurrency: CurrencyCode.USD,
      totalIncome: null,
      addIncomeSource: jest.fn(),
      updateIncomeSource: jest.fn(),
      removeIncomeSource: jest.fn(),
      setPrimaryCurrency: jest.fn(),
    };

    const mockHousingState: HousingState = {
      selectedType: null,
      expenses: null,
      setHousingType: jest.fn(),
      updateHousingExpenses: jest.fn(),
      addInsurancePolicy: jest.fn(),
      removeInsurancePolicy: jest.fn(),
      addUtilityExpense: jest.fn(),
      removeUtilityExpense: jest.fn(),
    };

    const mockEducationState: EducationState = {
      expenses: {},
      setInstitutionType: jest.fn(),
      setProgramType: jest.fn(),
      updateEducationExpense: jest.fn(),
      removeEducationExpense: jest.fn(),
    };

    const mockHealthcareState: HealthcareState = {
      selectedType: null,
      expenses: {},
      setHealthcareType: jest.fn(),
      updateHealthcareExpense: jest.fn(),
      removeHealthcareExpense: jest.fn(),
    };

    const mockTransportationState: TransportationState = {
      selectedType: null,
      expenses: null,
      setTransportType: jest.fn(),
      updateTransportExpense: jest.fn(),
    };

    const mockLifestyleState: LifestyleState = {
      expenses: [],
      addLifestyleExpense: jest.fn(),
      updateLifestyleExpense: jest.fn(),
      removeLifestyleExpense: jest.fn(),
    };

    const mockUtilitiesState: UtilitiesState = {
      expenses: null, // Or an empty object matching Record<UtilityServiceType, UtilitiesExpense>
      updateUtilityExpense: jest.fn(),
    };

    const mockEmergencyState: EmergencyState = {
      fund: null,
      updateEmergencyFund: jest.fn(),
    };

    return {
      profile: mockProfileState,
      scenarios: { [mockScenario.id]: mockScenario },
      activeScenarioId: null,
      isLoading: false, 
      error: null,    
      storageStats: { scenarioCount: 0, totalSize: 0 },
      activeScenario: () => mockScenario, // Ensure this matches RootState.activeScenario type (Scenario | null)
      scenarioList: () => [mockScenario],   // Ensure this matches RootState.scenarioList type (ScenarioListItem[])
      loadScenarios: jest.fn(),
      setActiveScenarioId: jest.fn(),
      createScenario: jest.fn().mockResolvedValue(mockScenario),
      updateScenario: jest.fn().mockResolvedValue(true),
      deleteScenario: jest.fn().mockResolvedValue(true),
      duplicateScenario: jest.fn().mockResolvedValue(mockScenario),
      exportScenarios: jest.fn(),
      importScenarios: jest.fn(),
      createTemplateScenario: jest.fn().mockResolvedValue(mockScenario),
      refreshStorageStats: jest.fn(),
      scheduleAutoSave: jest.fn(),
      fromActiveScenario: jest.fn(() => null),
      ui: mockUISliceState,
      income: mockIncomeState, 
      housing: mockHousingState,
      education: mockEducationState,
      healthcare: mockHealthcareState,
      transportation: mockTransportationState,
      lifestyle: mockLifestyleState,
      utilities: mockUtilitiesState,
      emergency: mockEmergencyState,
      fx: fxSlice,
    };
  });

describe('fxSlice', () => {
  let store: StoreApi<RootState>;
  const mockFetchLatestRates = fetchLatestRates as jest.Mock;

  beforeEach(() => {
    store = createTestStore();
    mockFetchLatestRates.mockClear();
  });

  it('should have correct initial state', () => {
    const fxState = store.getState().fx;
    expect(fxState.settings).toEqual(DEFAULT_FX_SETTINGS);
    expect(fxState.rates).toEqual({});
    expect(fxState.isLoading).toBe(false);
    expect(fxState.error).toBeNull();
    expect(fxState.lastUpdated).toBeNull();
  });

  describe('loadInitialFXData', () => {
    it('should update state correctly on successful API call', async () => {
      const mockApiResponse = {
        base: CurrencyCode.USD,
        rates: { [CurrencyCode.EUR]: 0.9, [CurrencyCode.GBP]: 0.8 },
        timestamp: Math.floor(Date.now() / 1000),
      };
      mockFetchLatestRates.mockResolvedValue(mockApiResponse);

      const { loadInitialFXData } = store.getState().fx;
      await loadInitialFXData();

      const fxState = store.getState().fx;
      expect(fxState.isLoading).toBe(false);
      expect(fxState.rates).toEqual(mockApiResponse.rates);
      expect(fxState.lastUpdated).toEqual(new Date(mockApiResponse.timestamp * 1000));
      expect(fxState.error).toBeNull();
      expect(mockFetchLatestRates).toHaveBeenCalledWith(DEFAULT_FX_SETTINGS.baseCurrency);
    });

    it('should update state correctly on failed API call', async () => {
      const errorMessage = 'Network Error';
      mockFetchLatestRates.mockRejectedValue(new Error(errorMessage));

      const { loadInitialFXData } = store.getState().fx;
      await loadInitialFXData();

      const fxState = store.getState().fx;
      expect(fxState.isLoading).toBe(false);
      expect(fxState.rates).toEqual({}); 
      expect(fxState.error).toBeInstanceOf(Error);
      expect(fxState.error?.message).toBe(errorMessage);
      expect(mockFetchLatestRates).toHaveBeenCalledWith(DEFAULT_FX_SETTINGS.baseCurrency);
    });

    it('should use custom baseCurrency if set in settings', async () => {
      const customBase = CurrencyCode.EUR;
      store.getState().fx.updateFXSettings({ baseCurrency: customBase });
      
      const mockApiResponse = {
        base: customBase,
        rates: { [CurrencyCode.USD]: 1.1, [CurrencyCode.GBP]: 0.9 },
        timestamp: Math.floor(Date.now() / 1000),
      };
      mockFetchLatestRates.mockResolvedValue(mockApiResponse);

      const { loadInitialFXData } = store.getState().fx;
      await loadInitialFXData();

      expect(mockFetchLatestRates).toHaveBeenCalledWith(customBase);
      const fxState = store.getState().fx;
      expect(fxState.rates).toEqual(mockApiResponse.rates);
    });
  });

  describe('updateFXSettings', () => {
    it('should correctly update specified settings', () => {
      const newSettings: Partial<FXSettings> = {
        baseCurrency: CurrencyCode.EUR,
        displayCurrency: CurrencyCode.GBP,
        manualRates: true,
      };

      const { updateFXSettings } = store.getState().fx;
      updateFXSettings(newSettings);

      const fxState = store.getState().fx;
      expect(fxState.settings!.baseCurrency).toBe(CurrencyCode.EUR);
      expect(fxState.settings!.displayCurrency).toBe(CurrencyCode.GBP);
      expect(fxState.settings!.manualRates).toBe(true);
      expect(fxState.settings!.customRates).toEqual(DEFAULT_FX_SETTINGS.customRates);
      expect(fxState.settings!.sensitivityRange).toEqual(DEFAULT_FX_SETTINGS.sensitivityRange);
    });

    it('should merge with existing settings and not overwrite unspecified fields', () => {
      const initialCustomRates = { [`${CurrencyCode.USD}-${CurrencyCode.JPY}`]: 150 };
      store.getState().fx.updateFXSettings({ customRates: initialCustomRates, baseCurrency: CurrencyCode.CAD });

      const { updateFXSettings } = store.getState().fx;
      updateFXSettings({ displayCurrency: CurrencyCode.AUD });

      const fxState = store.getState().fx;
      expect(fxState.settings!.baseCurrency).toBe(CurrencyCode.CAD); 
      expect(fxState.settings!.displayCurrency).toBe(CurrencyCode.AUD); 
      expect(fxState.settings!.customRates).toEqual(initialCustomRates); 
      expect(fxState.settings!.manualRates).toBe(DEFAULT_FX_SETTINGS.manualRates); 
    });
  });

  describe('getExchangeRate and convertAmount', () => {
    beforeEach(() => {
      const initialRates = {
        [CurrencyCode.EUR]: 0.9,
        [CurrencyCode.GBP]: 0.8,
        [CurrencyCode.JPY]: 110,
      };
      store.setState(prevState => ({
        ...prevState,
        fx: {
          ...prevState.fx,
          settings: { ...DEFAULT_FX_SETTINGS, baseCurrency: CurrencyCode.USD }, 
          rates: initialRates,
          lastUpdated: new Date(),
        }
      }));
    });

    describe('getExchangeRate', () => {
      it('should return correct rate when converting from base currency', () => {
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.USD, CurrencyCode.EUR);
        expect(rateInfo?.rate).toBe(0.9);
        expect(rateInfo?.fromCurrency).toBe(CurrencyCode.USD);
        expect(rateInfo?.toCurrency).toBe(CurrencyCode.EUR);
      });

      it('should return correct rate (inverted) when converting to base currency', () => {
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.EUR, CurrencyCode.USD);
        expect(rateInfo?.rate).toBeCloseTo(1 / 0.9);
      });

      it('should return correct rate (cross-currency) when converting between two non-base currencies', () => {
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.EUR, CurrencyCode.GBP);
        expect(rateInfo?.rate).toBeCloseTo(0.8 / 0.9);
      });

      it('should return rate of 1 if from and to currencies are the same', () => {
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.USD, CurrencyCode.USD);
        expect(rateInfo?.rate).toBe(1);
      });

      it('should return null if a currency rate is missing for cross-conversion', () => {
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.CAD, CurrencyCode.EUR); 
        expect(rateInfo).toBeNull();
      });

      it('should use custom manual rates if manualRates is true and rate exists', () => {
        const customRate = 160;
        store.getState().fx.updateFXSettings({
          manualRates: true,
          customRates: { [`${CurrencyCode.USD}-${CurrencyCode.JPY}`]: customRate },
        });
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.USD, CurrencyCode.JPY);
        expect(rateInfo?.rate).toBe(customRate);
        expect(rateInfo?.provider).toBe('manual');
      });

      it('should use inverse custom manual rates if manualRates is true and inverse rate exists', () => {
        const customRate = 165;
        store.getState().fx.updateFXSettings({
          manualRates: true,
          customRates: { [`${CurrencyCode.JPY}-${CurrencyCode.USD}`]: customRate },
        });
        const { getExchangeRate } = store.getState().fx;
        const rateInfo = getExchangeRate(CurrencyCode.USD, CurrencyCode.JPY);
        expect(rateInfo?.rate).toBeCloseTo(1 / customRate);
        expect(rateInfo?.provider).toBe('manual-inverse');
      });
    });

    describe('convertAmount', () => {
      it('should convert amount correctly using getExchangeRate logic', () => {
        const { convertAmount } = store.getState().fx;
        const amount = 100;
        expect(convertAmount(amount, CurrencyCode.USD, CurrencyCode.EUR)).toBeCloseTo(amount * 0.9);
        expect(convertAmount(amount, CurrencyCode.EUR, CurrencyCode.USD)).toBeCloseTo(amount * (1 / 0.9));
        expect(convertAmount(amount, CurrencyCode.EUR, CurrencyCode.GBP)).toBeCloseTo(amount * (0.8 / 0.9));
      });

      it('should return null if rate is not found for conversion', () => {
        const { convertAmount } = store.getState().fx;
        expect(convertAmount(100, CurrencyCode.CAD, CurrencyCode.EUR)).toBeNull(); 
      });

      it('should return the same amount if from and to currencies are the same', () => {
        const { convertAmount } = store.getState().fx;
        expect(convertAmount(100, CurrencyCode.USD, CurrencyCode.USD)).toBe(100);
      });
    });
  });

  // More tests will be added here
}); 