'use client';

import React, { useState, useEffect } from 'react';
import { Household } from '@/types/household';
import { Button, Select } from '@/components/ui';
import { ResidencyType, TaxRegimeType } from '@/types/base';
// Assuming COUNTRIES and other constants might be needed
// import { COUNTRIES } from '@/utils/constants'; 

interface HouseholdFormProps {
  initialData: Household;
  onSave: (updatedData: Household) => void;
  onCancel?: () => void; // Optional cancel handler
}

export const HouseholdForm: React.FC<HouseholdFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Household>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData); // Sync with external changes if initialData is updated
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Household) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // TODO: Implement handleAddMember, handleRemoveMember, handleMemberChange for family composition

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    // if (!formData.name.trim()) { // Removed household name validation
    //   newErrors.name = 'Household name is required.';
    // }
    // Add more validation as needed (e.g., for members, residencyStatus, taxRegime)
    if (!formData.residencyStatus) {
      newErrors.residencyStatus = 'Residency status is required.';
    }
    if (!formData.taxRegime) {
      newErrors.taxRegime = 'Tax regime is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Removed Household Name input field */}
      {/*
      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Household Name</span>
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Smith Family Abroad"
          error={errors.name}
        />
      </div>
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label htmlFor="residencyStatus" className="label">
            <span className="label-text">Residency Status (Destination)</span>
          </label>
          <Select
            id="residencyStatus"
            name="residencyStatus"
            value={formData.residencyStatus}
            onChange={handleChange}
            options={Object.values(ResidencyType).map(rt => ({ value: rt, label: rt }))}
            error={errors.residencyStatus}
          />
        </div>
        <div className="form-control">
          <label htmlFor="taxRegime" className="label">
            <span className="label-text">Tax Regime (Destination)</span>
          </label>
          <Select
            id="taxRegime"
            name="taxRegime"
            value={formData.taxRegime}
            onChange={handleChange}
            options={Object.values(TaxRegimeType).map(tr => ({ value: tr, label: tr }))}
            error={errors.taxRegime}
          />
        </div>
      </div>
      
      {/* Placeholder for Family Composition / Members section */}
      <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">Family Members</h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          (Editing family members - Add, Remove, Edit Birth Dates - Coming soon)
        </p>
        {/* TODO: Implement UI for managing household members */}
        {/* Example: formData.members.map(...) */}
        {/* <Button type="button" onClick={handleAddMember} variant="outline" size="sm">Add Member</Button> */}
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          Save Household Details
        </Button>
      </div>
    </form>
  );
}; 