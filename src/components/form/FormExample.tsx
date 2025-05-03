'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormGroup } from '../form';
import { 
  Input, 
  Select, 
  Checkbox, 
  Radio, 
  Button, 
  CurrencyInput 
} from '../ui';

// Define form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
  budget: z.number().positive('Budget must be greater than 0').or(z.string()),
  agreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
  employmentStatus: z.string().min(1, 'Please select an employment status'),
});

type FormValues = z.infer<typeof formSchema>;

const countries = [
  { value: '', label: 'Select a country' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
];

const employmentOptions = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
];

const FormExample = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      budget: 0,
      agreement: false,
      employmentStatus: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Simulate API call
    console.log('Form data submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Form submitted successfully!');
    reset();
  };

  return (
    <Form 
      onSubmit={handleSubmit(onSubmit)} 
      title="Personal Information" 
      subtitle="Please fill out all required fields"
      loading={isSubmitting}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      }
    >
      <FormGroup label="Full Name" required error={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input 
              placeholder="Enter your full name" 
              error={errors.name?.message} 
              {...field} 
            />
          )}
        />
      </FormGroup>
      
      <FormGroup label="Email Address" required error={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input 
              type="email" 
              placeholder="your.email@example.com" 
              error={errors.email?.message} 
              {...field} 
            />
          )}
        />
      </FormGroup>

      <FormGroup label="Country" required error={errors.country?.message}>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Select 
              options={countries} 
              error={errors.country?.message} 
              {...field} 
            />
          )}
        />
      </FormGroup>

      <FormGroup label="Monthly Budget" required error={errors.budget?.message}>
        <Controller
          name="budget"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <CurrencyInput 
              onChange={onChange} 
              value={value} 
              error={errors.budget?.message} 
              placeholder="Enter your monthly budget" 
              {...rest}
            />
          )}
        />
      </FormGroup>

      <FormGroup label="Employment Status" required error={errors.employmentStatus?.message}>
        <Controller
          name="employmentStatus"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Radio 
              options={employmentOptions} 
              error={errors.employmentStatus?.message} 
              onChange={e => onChange(e.target.value)} 
              value={value}
              {...rest}
            />
          )}
        />
      </FormGroup>

      <FormGroup error={errors.agreement?.message}>
        <Controller
          name="agreement"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Checkbox 
              label="I agree to the terms and conditions" 
              error={errors.agreement?.message} 
              checked={value}
              onChange={e => onChange(e.target.checked)}
              {...rest}
            />
          )}
        />
      </FormGroup>
    </Form>
  );
};

export default FormExample; 