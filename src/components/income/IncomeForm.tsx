'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import Card from '@/components/ui/Card';
import { 
  IncomeSource, 
  IncomeType, 
  IncomePartner,
  FrequencyType 
} from '@/types/income';
import { CurrencyCode, TaxRegimeType } from '@/types/base';
import { Icon } from '@iconify/react';

// Form validation schema
const incomeSchema = z.object({
  name: z.string().min(1, 'Income source name is required'),
  type: z.nativeEnum(IncomeType),
  partner: z.enum(['partner1', 'partner2', 'joint'] as const),
  amount: z.number().positive('Amount must be positive'),
  currency: z.nativeEnum(CurrencyCode),
  frequency: z.nativeEnum(FrequencyType),
  taxable: z.boolean(),
  taxTreatment: z.enum(['standard', 'nhr', 'exempt'] as const).optional(),
  description: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  scenarioId?: string;
  onSave?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ scenarioId, onSave }) => {
  const { 
    income: {
      tempIncomes,
      taxRegime,
      totalGrossIncome,
      totalNetIncome,
      addIncome,
      updateIncome,
      deleteIncome,
      setTaxRegime,
      loadIncomesFromScenario,
      calculateTotals,
    },
    fx: { settings: fxSettings },
    activeScenario,
    updateScenario,
  } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      type: IncomeType.EMPLOYMENT,
      partner: 'partner1',
      currency: fxSettings.baseCurrency,
      frequency: FrequencyType.MONTHLY,
      taxable: true,
      taxTreatment: 'standard',
    }
  });

  // Load incomes from scenario when component mounts or scenario changes
  useEffect(() => {
    if (scenarioId && activeScenario) {
      loadIncomesFromScenario(
        activeScenario.content.incomeSources || [],
        activeScenario.content.household?.taxRegime
      );
    }
  }, [scenarioId, activeScenario, loadIncomesFromScenario]);

  // Watch for taxable changes to show/hide tax treatment
  const isTaxable = watch('taxable');

  const onSubmit = (data: IncomeFormData) => {
    const incomeData: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      description: data.description,
      type: data.type,
      partner: data.partner,
      amount: {
        amount: data.amount,
        currency: data.currency,
      },
      frequency: data.frequency,
      isActive: true,
      taxable: data.taxable,
      taxTreatment: data.taxTreatment,
    };

    if (editingId) {
      updateIncome(editingId, incomeData);
      setEditingId(null);
    } else {
      addIncome(incomeData);
    }

    reset();
    setShowAddForm(false);
    
    // Save to scenario if we have one
    if (scenarioId) {
      saveToScenario();
    }
  };

  const saveToScenario = async () => {
    if (!scenarioId || !activeScenario) return;

    await updateScenario(scenarioId, {
      content: {
        ...activeScenario.content,
        incomeSources: tempIncomes,
        household: {
          ...activeScenario.content.household,
          taxRegime: taxRegime,
        }
      }
    });

    onSave?.();
  };

  const handleEdit = (income: IncomeSource) => {
    setEditingId(income.id);
    setValue('name', income.name);
    setValue('type', income.type);
    setValue('partner', income.partner);
    setValue('amount', income.amount.amount);
    setValue('currency', income.amount.currency);
    setValue('frequency', income.frequency);
    setValue('taxable', income.taxable);
    setValue('taxTreatment', income.taxTreatment || 'standard');
    setValue('description', income.description || '');
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income source?')) {
      deleteIncome(id);
      if (scenarioId) {
        saveToScenario();
      }
    }
  };

  const incomeTypeOptions = Object.values(IncomeType).map(type => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' '),
  }));

  const frequencyOptions = Object.values(FrequencyType).map(freq => ({
    value: freq,
    label: freq.charAt(0) + freq.slice(1).toLowerCase(),
  }));

  const currencyOptions = Object.values(CurrencyCode).map(curr => ({
    value: curr,
    label: curr,
  }));

  const taxRegimeOptions = [
    { value: TaxRegimeType.STANDARD, label: 'Standard Tax Regime' },
    { value: TaxRegimeType.PORTUGAL_NHR, label: 'Portugal NHR (20% flat rate)' },
  ];

  const partnerOptions = [
    { value: 'partner1', label: 'Partner 1' },
    { value: 'partner2', label: 'Partner 2' },
    { value: 'joint', label: 'Joint Income' },
  ];

  return (
    <div className="space-y-6">
      {/* Tax Regime Selection */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Regime</h3>
          <Select
            value={taxRegime}
            onChange={(e) => {
              setTaxRegime(e.target.value as TaxRegimeType);
              calculateTotals();
            }}
            options={taxRegimeOptions}
          />
        </div>
      </Card>

      {/* Income Summary */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Income Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Gross Income</p>
              <p className="text-2xl font-bold">
                {totalGrossIncome.currency} {totalGrossIncome.amount.toFixed(2)}/month
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Net Income</p>
              <p className="text-2xl font-bold text-green-600">
                {totalNetIncome.currency} {totalNetIncome.amount.toFixed(2)}/month
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Income Sources List */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Income Sources</h3>
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                variant="primary"
                size="sm"
              >
                <Icon icon="mdi:plus" className="mr-2" />
                Add Income Source
              </Button>
            )}
          </div>

          {/* Income List */}
          {tempIncomes.length > 0 && (
            <div className="space-y-3 mb-6">
              {tempIncomes.map((income) => (
                <div
                  key={income.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{income.name}</h4>
                      <p className="text-sm text-gray-600">
                        {income.partner === 'joint' ? 'Joint' : `Partner ${income.partner.slice(-1)}`} • 
                        {income.type.toLowerCase()} • 
                        {income.frequency.toLowerCase()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {income.amount.currency} {income.amount.amount.toFixed(2)}
                        {income.taxable && income.taxTreatment && 
                          <span className="text-gray-500"> ({income.taxTreatment})</span>
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(income)}
                        variant="outline"
                        size="sm"
                      >
                        <Icon icon="mdi:pencil" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(income.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Icon icon="mdi:delete" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4">
              <h4 className="font-medium">
                {editingId ? 'Edit Income Source' : 'Add Income Source'}
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Income Source Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Main Salary, Rental Income"
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Income Type</Label>
                  <Select
                    id="type"
                    {...register('type')}
                    options={incomeTypeOptions}
                    error={errors.type?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="partner">Partner</Label>
                  <Select
                    id="partner"
                    {...register('partner')}
                    options={partnerOptions}
                    error={errors.partner?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    error={errors.amount?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    id="currency"
                    {...register('currency')}
                    options={currencyOptions}
                    error={errors.currency?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    id="frequency"
                    {...register('frequency')}
                    options={frequencyOptions}
                    error={errors.frequency?.message}
                  />
                </div>

                <div>
                  <Label htmlFor="taxable">
                    <input
                      id="taxable"
                      type="checkbox"
                      {...register('taxable')}
                      className="mr-2"
                    />
                    Taxable Income
                  </Label>
                </div>

                {isTaxable && (
                  <div>
                    <Label htmlFor="taxTreatment">Tax Treatment</Label>
                    <Select
                      id="taxTreatment"
                      {...register('taxTreatment')}
                      options={[
                        { value: 'standard', label: 'Standard' },
                        { value: 'nhr', label: 'NHR Rate' },
                        { value: 'exempt', label: 'Tax Exempt' },
                      ]}
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    {...register('description')}
                    placeholder="Additional notes about this income"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  {editingId ? 'Update' : 'Add'} Income
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Save to Scenario Button */}
      {scenarioId && (
        <div className="flex justify-end">
          <Button
            onClick={saveToScenario}
            variant="primary"
            size="lg"
          >
            Save Income Data to Scenario
          </Button>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;