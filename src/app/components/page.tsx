'use client';

import React from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  CurrencyInput, 
  Checkbox, 
  Radio, 
  Tabs 
} from '@/components/ui';
import { FormExample } from '@/components/form';
import { PageContainer } from '@/components/layout';
import Link from 'next/link';

// Restore full ButtonsSection
const ButtonsSection = () => (
  <div className="space-y-8 text-gray-800">
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Button Variants</h2>
      <div className="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Button Sizes</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg">Large</Button>
        <Button size="md">Medium (Default)</Button>
        <Button size="sm">Small</Button>
        <Button size="xs">Extra Small</Button>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Button States</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" className="loading">Loading</Button>
        <Button variant="accent" className="btn-active">Active</Button>
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Button with Icons</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">
          <span className="i-lucide-home w-4 h-4 mr-2" />
          Left Icon
        </Button>
        <Button variant="secondary">
          Right Icon
          <span className="i-lucide-arrow-right w-4 h-4 ml-2" />
        </Button>
        <Button variant="ghost" size="sm" className="btn-square">
          <span className="i-lucide-search w-4 h-4" />
        </Button>
      </div>
    </section>
  </div>
);

const InputsSection = () => {
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('option1');
  
  const radioOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const selectOptions = [
    { value: '', label: 'Select an option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="space-y-8 text-gray-800">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Text Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Regular Input" placeholder="Enter some text" />
          <Input 
            label="With Helper Text" 
            placeholder="Enter some text" 
            helperText="This is some helpful text"
          />
          <Input 
            label="With Error" 
            placeholder="Enter some text" 
            error="This field is required"
          />
          <Input 
            label="With Icon" 
            placeholder="Search..." 
            leftIcon={<span className="i-lucide-search w-4 h-4" />}
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Currency Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput 
            label="Budget" 
            placeholder="Enter amount" 
            value={1000} 
            onChange={(val) => console.log(val)}
          />
          <CurrencyInput 
            label="With Different Currency" 
            placeholder="Enter amount" 
            value={1000} 
            currencySymbol="$" 
            onChange={(val) => console.log(val)}
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Select Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Basic Select" 
            options={selectOptions} 
          />
          <Select 
            label="With Error" 
            options={selectOptions} 
            error="Please select an option"
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Checkbox Input</h2>
        <div className="space-y-2">
          <Checkbox 
            label="Basic Checkbox" 
            checked={checkboxValue} 
            onChange={(e) => setCheckboxValue(e.target.checked)}
          />
          <Checkbox 
            label="Disabled Checkbox" 
            disabled 
          />
          <Checkbox 
            label="With Error" 
            error="This field is required"
          />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Radio Input</h2>
        <div className="space-y-2">
          <Radio 
            label="Radio Options" 
            options={radioOptions} 
            value={radioValue}
            onChange={(e) => setRadioValue(e.target.value)}
          />
          <Radio 
            label="Radio Options (Horizontal)" 
            options={radioOptions} 
            direction="horizontal"
          />
          <Radio 
            label="With Error" 
            options={radioOptions} 
            error="Please select an option"
          />
        </div>
      </section>
    </div>
  );
};

const FormSection = () => (
  <div className="text-gray-800">
    <h2 className="text-xl font-semibold mb-4">Form Example</h2>
    <FormExample />
  </div>
);

const CardsSection = () => (
  <div className="space-y-4 text-gray-800">
    <h2 className="text-xl font-semibold">Basic Card</h2>
    <Card title="Card Title" footer={<Button variant="primary">Action</Button>}>
      <p>This is the content of the card.</p>
    </Card>

    <h2 className="text-xl font-semibold">Card with No Title</h2>
    <Card>
      <p>This card has no title but has actions.</p>
    </Card>
  </div>
);

// Page component uses the restored sections, but simplified wrapper
const ComponentsPage = () => {
  const tabItems = [
    { id: 'buttons', label: 'Buttons', content: <ButtonsSection /> },
    { id: 'inputs', label: 'Inputs', content: <InputsSection /> },
    { id: 'form', label: 'Form Example', content: <FormSection /> },
    { id: 'cards', label: 'Cards', content: <CardsSection /> },
  ];

  return (
    <PageContainer title="UI Components Showcase">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      
      <div className="mb-6">
        <Link href="/components/charts" className="btn btn-primary">
          View Financial Chart Components
        </Link>
        <Link href="/components/interactive" className="btn btn-secondary ml-2">
          View Interactive Components
        </Link>
      </div>

      <Tabs 
        tabs={tabItems} 
        variant="bordered" 
        size="md" 
        contentClassName="block min-h-[200px] visible"
      />
    </PageContainer>
  );
};

export default ComponentsPage; 