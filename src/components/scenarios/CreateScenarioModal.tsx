"use client";

import { useState } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { CountryCode } from '@/types/base';
import { COUNTRIES } from '@/utils/constants';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    originCountry: CountryCode;
    destinationCountry: CountryCode;
  }) => void;
  title?: string;
  initialValues?: {
    name: string;
    description: string;
    originCountry: CountryCode;
    destinationCountry: CountryCode;
  };
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Create New Scenario',
  initialValues = {
    name: '',
    description: '',
    originCountry: 'US' as CountryCode,
    destinationCountry: 'PT' as CountryCode,
  },
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Scenario name is required';
    }
    
    if (!formData.originCountry) {
      newErrors.originCountry = 'Origin country is required';
    }
    
    if (!formData.destinationCountry) {
      newErrors.destinationCountry = 'Destination country is required';
    }
    
    console.log('CreateScenarioModal: validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('CreateScenarioModal: handleSubmit called with data:', formData);
    if (validateForm()) {
      console.log('CreateScenarioModal: validation passed, submitting form');
      onSubmit(formData);
      onClose();
    } else {
      console.log('CreateScenarioModal: validation failed, not submitting');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Scenario Name</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter scenario name"
              error={errors.name}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Description (Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              className="textarea textarea-bordered h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Origin Country</span>
              </label>
              <Select
                name="originCountry"
                value={formData.originCountry}
                onChange={handleChange}
                error={errors.originCountry}
                options={Object.entries(COUNTRIES).map(([code, name]) => ({
                  value: code,
                  label: name as string
                }))}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Destination Country</span>
              </label>
              <Select
                name="destinationCountry"
                value={formData.destinationCountry}
                onChange={handleChange}
                error={errors.destinationCountry}
                options={Object.entries(COUNTRIES).map(([code, name]) => ({
                  value: code,
                  label: name as string
                }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Scenario
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 