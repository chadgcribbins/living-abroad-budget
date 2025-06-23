'use client';
console.log('PROFILE_FORM_V_LATEST_DEBUG_005 loading');

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/store/hooks';
import { countries } from '@/types/country';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Household, HouseholdMember, HouseholdRelationship } from '@/types/household';
import { CountryCode } from '@/types/base';
import { v4 as uuidv4 } from 'uuid';

// Define a specific type for the member form data
interface MemberFormDataType {
  fullName: string; // Changed from firstName, lastName
  dateOfBirth: string; // Store as string for <input type="date">
  relationship: HouseholdRelationship;
  // isDependent is now automatically determined
}

interface SelectOption {
  value: string;
  label: string;
}

const ProfileForm: React.FC = () => {
  const { household, updateHousehold, updateHouseholdMembers } = useProfile();

  // State for the primary individual's details
  const [primaryFullName, setPrimaryFullName] = useState('');
  const [primaryDateOfBirth, setPrimaryDateOfBirth] = useState('');
  const [originCountry, setOriginCountry] = useState<CountryCode | ''>(household?.originCountry || '');

  // State for managing family members
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberFormData, setMemberFormData] = useState<MemberFormDataType>({
    fullName: '',
    dateOfBirth: '',
    relationship: HouseholdRelationship.CHILD, // Default to CHILD
  });

  const relationshipOptions: SelectOption[] = Object.values(HouseholdRelationship)
    .filter(rel => rel !== HouseholdRelationship.PRIMARY) // Primary is set above
    .map(value => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    }));

  const countryOptions: SelectOption[] = countries.map(c => ({ value: c.code, label: c.name }));

  useEffect(() => {
    console.log('PROFILE_FORM_V_LATEST_DEBUG_005 useEffect household:', household);
    if (household) {
      const primary = household.members.find(m => m.relationship === HouseholdRelationship.PRIMARY);
      if (primary) {
        setPrimaryFullName(`${primary.firstName} ${primary.lastName}`.trim());
        setPrimaryDateOfBirth(primary.dateOfBirth ? new Date(primary.dateOfBirth).toISOString().split('T')[0] : '');
      }
      setOriginCountry(household.originCountry || '');
      setMembers(household.members.filter(m => m.relationship !== HouseholdRelationship.PRIMARY));
    } else {
      // Initialize with a default primary member if household is null/new
      // This helps ensure profile.isComplete can be true after first save
      setPrimaryFullName('');
      setPrimaryDateOfBirth('');
      setOriginCountry('');
      setMembers([]);
    }
  }, [household]);

  const handlePrimaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'primaryFullName') {
      setPrimaryFullName(value);
    } else if (name === 'primaryDateOfBirth') {
      setPrimaryDateOfBirth(value);
    }
  };

  const handleMemberFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMemberFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMemberClick = () => {
    setEditingMemberId(null);
    setMemberFormData({
      fullName: '',
      dateOfBirth: '',
      relationship: HouseholdRelationship.CHILD,
    });
    setShowAddMemberForm(true);
  };

  const handleSaveMember = () => {
    if (!memberFormData.fullName || !memberFormData.dateOfBirth) {
      alert('Please fill in all fields for the family member.');
      return;
    }

    const nameParts = memberFormData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newMember: HouseholdMember = {
      id: editingMemberId || uuidv4(),
      firstName,
      lastName,
      dateOfBirth: new Date(memberFormData.dateOfBirth),
      relationship: memberFormData.relationship,
      isDependent: memberFormData.relationship === HouseholdRelationship.CHILD, // Auto-set isDependent
    };

    let updatedMembersList = [...members];
    if (editingMemberId) {
      updatedMembersList = updatedMembersList.map(m => m.id === editingMemberId ? newMember : m);
    } else {
      updatedMembersList.push(newMember);
    }
    setMembers(updatedMembersList);
    setShowAddMemberForm(false);
    setEditingMemberId(null);
  };

  const handleEditMember = (member: HouseholdMember) => {
    setEditingMemberId(member.id);
    setMemberFormData({
      fullName: `${member.firstName} ${member.lastName}`.trim(),
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
      relationship: member.relationship,
    });
    setShowAddMemberForm(true);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleSaveProfile = () => {
    if (!primaryFullName || !primaryDateOfBirth || !originCountry) {
      alert('Please fill in your Full Name, Date of Birth, and Origin Country.');
      return;
    }

    const primaryNameParts = primaryFullName.trim().split(' ');
    const primaryFirstName = primaryNameParts[0] || '';
    const primaryLastName = primaryNameParts.slice(1).join(' ') || '';

    const primaryMember: HouseholdMember = {
      id: household?.members.find(m => m.relationship === HouseholdRelationship.PRIMARY)?.id || uuidv4(),
      firstName: primaryFirstName,
      lastName: primaryLastName,
      dateOfBirth: new Date(primaryDateOfBirth),
      relationship: HouseholdRelationship.PRIMARY,
      isDependent: false, // Primary is never a dependent
    };

    const allMembers = [primaryMember, ...members];

    const householdUpdates: Partial<Household> = {
      // name: household?.name || '', // name is removed from Household type
      originCountry: originCountry as CountryCode,
      // destinationCountry will be part of scenario, not base profile
      // We ensure a default for type safety in the slice, but it's not set here.
    };

    console.log('PROFILE_FORM_V_LATEST_DEBUG_005 handleSaveProfile:', { householdUpdates, allMembers });
    updateHousehold(householdUpdates as Partial<Household>); // Type assertion if fields are truly partial
    updateHouseholdMembers(allMembers);
    alert('Profile saved!');
  };

  return (
    <div className="space-y-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700">Your Profile</h2>

      {/* Stage 1: Primary Individual and Origin Country */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-md">
        <h3 className="text-xl font-medium text-gray-600">Primary Individual</h3>
        <div>
          <Label htmlFor="primaryFullName">Full Name</Label>
          <Input 
            id="primaryFullName" 
            name="primaryFullName" 
            value={primaryFullName} 
            onChange={handlePrimaryInputChange} 
            placeholder="E.g., Jane Doe"
          />
        </div>
        <div>
          <Label htmlFor="primaryDateOfBirth">Date of Birth</Label>
          <Input 
            id="primaryDateOfBirth" 
            name="primaryDateOfBirth" 
            type="date" 
            value={primaryDateOfBirth} 
            onChange={handlePrimaryInputChange} 
          />
        </div>
      </div>

      {/* Family Members Section */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-md">
        <h3 className="text-xl font-medium text-gray-600">Family Members</h3>
        {members.length > 0 && (
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{member.firstName} {member.lastName} ({member.relationship})</span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!showAddMemberForm && (
          <Button onClick={handleAddMemberClick} variant="secondary" className="w-full sm:w-auto">
            Add Family Member
          </Button>
        )}

        {showAddMemberForm && (
          <div className="p-4 border border-blue-200 rounded-md space-y-4 bg-blue-50">
            <h4 className="text-lg font-medium text-blue-700">{editingMemberId ? 'Edit' : 'Add New'} Family Member</h4>
            <div>
              <Label htmlFor="memberFullName">Full Name</Label>
              <Input 
                id="memberFullName" 
                name="fullName"
                value={memberFormData.fullName} 
                onChange={handleMemberFormChange} 
                placeholder="E.g., John Doe"
              />
            </div>
            <div>
              <Label htmlFor="memberDateOfBirth">Date of Birth</Label>
              <Input 
                id="memberDateOfBirth" 
                name="dateOfBirth"
                type="date" 
                value={memberFormData.dateOfBirth} 
                onChange={handleMemberFormChange} 
              />
            </div>
            <div>
              <Label htmlFor="memberRelationship">Relationship to Primary</Label>
              <Select 
                id="memberRelationship"
                name="relationship"
                value={memberFormData.relationship}
                onChange={(e) => setMemberFormData(prev => ({ ...prev, relationship: e.target.value as HouseholdRelationship }))}
                options={relationshipOptions} 
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveMember} className="bg-blue-500 hover:bg-blue-600 text-white">
                {editingMemberId ? 'Update Member' : 'Save Member'}
              </Button>
              <Button onClick={() => { setShowAddMemberForm(false); setEditingMemberId(null); }} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Origin Country Section */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-md">
        <h3 className="text-xl font-medium text-gray-600">Origin Country</h3>
        <div>
          <Label htmlFor="originCountry">Origin Country</Label>
          <Select 
            id="originCountry"
            name="originCountry"
            value={originCountry || ''}
            onChange={(e) => setOriginCountry(e.target.value as CountryCode)}
            options={countryOptions} 
            placeholder="Select your origin country"
          />
        </div>
      </div>

      <Button onClick={handleSaveProfile} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">
        Save Profile
      </Button>
    </div>
  );
};

export default ProfileForm; 