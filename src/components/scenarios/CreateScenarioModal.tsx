"use client";

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { CountryCode } from '@/types/base';
import { COUNTRIES } from '@/utils/constants';
import { useProfile } from '@/store/hooks';

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    destinationCountry: CountryCode;
  }) => void;
  title?: string;
}

export const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Create New Scenario',
}) => {
  const { household } = useProfile();

  const defaultInitialValues = {
    name: '',
    description: '',
    destinationCountry: household?.destinationCountry || ('PT' as CountryCode),
  };

  const [formData, setFormData] = useState(defaultInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!formData.destinationCountry) {
      newErrors.destinationCountry = 'Destination country is required';
    }
    
    console.log('CreateScenarioModal: validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('CreateScenarioModal: handleSubmit called with data:', formData);
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        console.log('CreateScenarioModal: validation passed, submitting form');
        await onSubmit(formData);
        onClose();
      } catch (error) {
        console.error("CreateScenarioModal: onSubmit failed", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('CreateScenarioModal: validation failed, not submitting');
    }
  };

  useEffect(() => {
    const newInitialValues = {
      name: '',
      description: '',
      destinationCountry: household?.destinationCountry || ('PT' as CountryCode),
    };
    setFormData(newInitialValues);
  }, [household, isOpen]);

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

          <div className="form-control w-full md:col-span-2">
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

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className={isSubmitting ? 'loading' : ''}>
            {isSubmitting ? 'Creating...' : 'Create Scenario'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 