# Living Abroad Budget UI Component Library

This directory contains a comprehensive UI component library for the Living Abroad Budget application. The components are designed to be reusable, flexible, and consistent across the application.

## Component Structure

The component library is organized into the following sections:

- **UI Components**: Basic UI elements (buttons, inputs, cards)
- **Layout Components**: Page structure components (grids, containers)
- **Form Components**: Form-specific components
- **Chart Components**: Financial visualization components

## Available Components

### UI Components

- **Button**: Customizable button with various variants and states
- **Card**: Container for content with title, subtitle, and footer options
- **Input**: Form input with support for labels, icons, and validation
- **Select**: Dropdown selection component
- **CurrencyInput**: Specialized input for financial amounts with formatting
- **Tabs**: Tabbed content interface
- **ThemeToggle**: Light/dark theme toggle button
- **Modal**: Interactive dialog component
- **Alert**: Status notifications with different types
- **Toast**: Temporary notifications
- **Tooltip**: Contextual help or information

### Layout Components

- **PageContainer**: Main page layout wrapper
- **Grid/GridItem**: Responsive grid system
- **NavBar**: Navigation header with theme toggle

### Form Components

- **Form**: Form wrapper with title, error handling, and layout options
- **FormGroup**: Field wrapper for consistent form layouts

### Chart Components

- **LineChart**: Time-series visualization for financial data
- **BarChart**: Comparison visualization for financial categories
- **PieChart**: Proportion visualization for budget allocation
- **GaugeChart**: Progress visualization for financial goals and metrics

## Usage Examples

### Button

```tsx
<Button variant="primary" size="md" isLoading={false} isDisabled={false}>
  Click Me
</Button>
```

### Card

```tsx
<Card
  variant="shadow"
  title="Card Title"
  subtitle="Card Subtitle"
  footer={<Button>Action</Button>}
>
  Card content goes here
</Card>
```

### Input

```tsx
<Input
  label="Username"
  placeholder="Enter username"
  helperText="Enter your username here"
  error={errors.username}
  leftIcon={<UserIcon />}
/>
```

### CurrencyInput

```tsx
<CurrencyInput
  label="Amount"
  value={amount}
  onChange={setAmount}
  currencySymbol="€"
  decimalPlaces={2}
/>
```

### Select

```tsx
<Select
  label="Country"
  options={[
    { value: 'uk', label: 'United Kingdom' },
    { value: 'pt', label: 'Portugal' },
  ]}
  placeholder="Select a country"
/>
```

### Form with FormGroup

```tsx
<Form
  title="Profile Information"
  layout="vertical"
  footer={<Button>Save</Button>}
>
  <FormGroup label="Name" required>
    <Input placeholder="Enter your name" />
  </FormGroup>
  
  <FormGroup label="Country">
    <Select options={countryOptions} placeholder="Select your country" />
  </FormGroup>
</Form>
```

### Grid Layout

```tsx
<Grid cols={12} gap={4}>
  <GridItem span={6}>
    Half width on all screens
  </GridItem>
  <GridItem span={{ sm: 12, md: 6 }}>
    Full width on small screens, half width on medium and up
  </GridItem>
</Grid>
```

### LineChart

```tsx
<LineChart 
  data={[
    { date: 'Jan', income: 1000, expenses: 800 },
    { date: 'Feb', income: 1200, expenses: 900 },
    // ...more data
  ]} 
  lines={[
    { dataKey: 'income', color: '#4CAF50', name: 'Income' },
    { dataKey: 'expenses', color: '#F44336', name: 'Expenses' },
  ]}
  formatter={(value) => `$${value}`}
/>
```

### BarChart

```tsx
<BarChart 
  data={[
    { name: 'Housing', value: 1200 },
    { name: 'Food', value: 500 },
    // ...more data
  ]} 
  bars={[{ dataKey: 'value', color: '#6366F1', name: 'Amount' }]}
  formatter={(value) => `$${value}`}
  useColorfulBars={true}
/>
```

### PieChart

```tsx
<PieChart 
  data={[
    { name: 'Housing', value: 40 },
    { name: 'Food', value: 20 },
    // ...more data
  ]} 
  formatter={(value) => `${value}%`}
  innerRadius="60%"  // Use for donut chart
  outerRadius="80%"
/>
```

### GaugeChart

```tsx
<GaugeChart 
  value={65} 
  min={0}
  max={100}
  thresholds={[30, 70]}
  formatter={(value) => `${value}%`}
  label="Savings Rate"
  showLegend={true}
  legendLabels={['Low', 'Medium', 'High']}
/>
```

## Theme Support

The component library uses DaisyUI's theming system. The default themes are:

- `light`: Light theme
- `dark`: Dark theme

Use the `ThemeToggle` component to allow users to switch between themes.

## Responsive Design

All components are designed to be responsive. The grid system and many components have built-in responsive behavior.

## Accessibility

Components are built with accessibility in mind, including proper labeling, ARIA attributes, and keyboard navigation. 

## Documentation

For detailed documentation and interactive examples, see:
- `/app/components` - Basic UI components showcase
- `/app/components/interactive` - Interactive UI components showcase
- `/app/components/charts` - Financial visualization components showcase 