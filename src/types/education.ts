import { FrequencyType, Identifiable, Money, Timestamped } from './base';

/**
 * Types of educational institutions
 */
export enum InstitutionType {
  PUBLIC_SCHOOL = 'PUBLIC_SCHOOL',
  PRIVATE_SCHOOL = 'PRIVATE_SCHOOL',
  INTERNATIONAL_SCHOOL = 'INTERNATIONAL_SCHOOL',
  UNIVERSITY = 'UNIVERSITY',
  VOCATIONAL = 'VOCATIONAL',
  LANGUAGE_SCHOOL = 'LANGUAGE_SCHOOL',
  ONLINE_LEARNING = 'ONLINE_LEARNING',
}

/**
 * Types of educational programs
 */
export enum ProgramType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  CERTIFICATE = 'CERTIFICATE',
  DIPLOMA = 'DIPLOMA',
  LANGUAGE = 'LANGUAGE',
  PROFESSIONAL = 'PROFESSIONAL',
}

/**
 * Base interface for education expenses
 */
export interface EducationExpense extends Identifiable, Timestamped {
  institutionType: InstitutionType;
  programType: ProgramType;
  institution: string;
  program: string;
  tuition: Money & { frequency: FrequencyType };
  fees: EducationFee[];
  startDate: Date;
  endDate?: Date;
  student: string; // Reference to household member
  financialAid?: FinancialAid[];
  notes?: string;
}

/**
 * Educational fees breakdown
 */
export interface EducationFee extends Identifiable {
  description: string;
  amount: Money;
  frequency: FrequencyType;
  required: boolean;
  refundable: boolean;
}

/**
 * Financial aid details
 */
export interface FinancialAid extends Identifiable {
  type: string; // e.g., "scholarship", "grant", "loan"
  provider: string;
  amount: Money;
  frequency: FrequencyType;
  conditions?: string[];
  repaymentRequired: boolean;
  repaymentTerms?: {
    startDate?: Date;
    interestRate?: number;
    monthlyPayment?: Money;
  };
}

/**
 * Educational supplies and materials
 */
export interface EducationSupplies extends Identifiable {
  category: string; // e.g., "books", "technology", "uniforms"
  items: {
    description: string;
    cost: Money;
    required: boolean;
  }[];
  frequency: FrequencyType;
  notes?: string;
}

/**
 * Additional educational services
 */
export interface EducationService extends Identifiable {
  type: string; // e.g., "tutoring", "test prep", "enrichment"
  provider: string;
  cost: Money & { frequency: FrequencyType };
  duration?: number; // in hours or sessions
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

/**
 * Transportation to/from educational institution
 */
export interface EducationTransport extends Identifiable {
  type: string; // e.g., "school bus", "public transport", "private service"
  provider?: string;
  cost: Money & { frequency: FrequencyType };
  distance: number; // in kilometers
  included: boolean; // Whether included in tuition/fees
  notes?: string;
} 