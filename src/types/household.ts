import { Address, CountryCode, Identifiable, ResidencyType, TaxRegimeType, Timestamped } from './base';

/**
 * Represents a member of the household
 */
export interface HouseholdMember extends Identifiable {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: HouseholdRelationship;
  occupation?: string;
  isDependent: boolean;
}

/**
 * Relationship types within a household
 */
export enum HouseholdRelationship {
  PRIMARY = 'PRIMARY',
  SPOUSE = 'SPOUSE',
  CHILD = 'CHILD',
  OTHER = 'OTHER',
}

/**
 * Represents the complete household configuration
 */
export interface Household extends Identifiable, Timestamped {
  name: string;
  members: HouseholdMember[];
  originCountry: CountryCode;
  destinationCountry: CountryCode;
  originAddress?: Address;
  destinationAddress?: Address;
  residencyStatus: ResidencyType;
  taxRegime: TaxRegimeType;
  size: number; // Total number of members
  dependents: number; // Number of dependent members
}

/**
 * Type guard to check if a member is a dependent
 */
export function isDependent(member: HouseholdMember): boolean {
  return member.isDependent || member.relationship === HouseholdRelationship.CHILD;
}

/**
 * Utility function to calculate household statistics
 */
export function calculateHouseholdStats(household: Household): { size: number; dependents: number } {
  const dependents = household.members.filter(isDependent).length;
  return {
    size: household.members.length,
    dependents,
  };
} 