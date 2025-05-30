# UI Components

This section documents the basic UI elements used throughout the Living Abroad Budget application.

## Button

Customizable button with various variants and states.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables the button |

### Example

```tsx
<Button variant="primary" size="md" isLoading={false} disabled={false}>
  Click Me
</Button>
```

## Card

Container for content with title, subtitle, and footer options.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `'default' \| 'bordered'` | `'default'` | Card style variant |
| `title` | `string \| ReactNode` | - | Card title |
| `subtitle` | `string \| ReactNode` | - | Card subtitle |
| `footer` | `ReactNode` | - | Card footer content |
| `headerAction` | `ReactNode` | - | Action component in header |
| `className` | `string` | - | Additional CSS classes |

### Example

```tsx
<Card
  variant="bordered"
  title="Card Title"
  subtitle="Card Subtitle"
  footer={<Button>Action</Button>}
  className="p-4"
>
  Card content goes here
</Card>
```

## Input

Form input with support for labels, icons, and validation.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Input placeholder |
| `helperText` | `string` | - | Helper text below input |
| `error` | `string` | - | Error message |
| `leftIcon` | `ReactNode` | - | Icon on the left side |
| `rightIcon` | `ReactNode` | - | Icon on the right side |
| `type` | `string` | `'text'` | Input type (text, password, etc.) |

### Example

```tsx
<Input
  label="Username"
  placeholder="Enter username"
  helperText="Enter your username here"
  error={errors.username}
  leftIcon={<UserIcon />}
/>
```

## Select

Dropdown selection component.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | - | Select label |
| `options` | `Array<{ value: string, label: string }>` | `[]` | Options for the select |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `value` | `string` | - | Current value |
| `onChange` | `(value: string) => void` | - | Change handler |

### Example

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

## CurrencyInput

Specialized input for financial amounts with formatting.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | - | Input label |
| `value` | `number` | - | Current value |
| `onChange` | `(value: number) => void` | - | Change handler |
| `currencySymbol` | `string` | `'€'` | Currency symbol to display |
| `decimalPlaces` | `number` | `2` | Number of decimal places |
| `error` | `string` | - | Error message |

### Example

```tsx
<CurrencyInput
  label="Amount"
  value={amount}
  onChange={setAmount}
  currencySymbol="€"
  decimalPlaces={2}
/>
```

## Checkbox

Checkbox input component.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | - | Checkbox label |
| `checked` | `boolean` | `false` | Whether checkbox is checked |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `disabled` | `boolean` | `false` | Whether checkbox is disabled |
| `error` | `string` | - | Error message |

### Example

```tsx
<Checkbox
  label="I agree to the terms"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>
```

## Radio

Radio button group component.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | `string` | - | Group label |
| `options` | `Array<{ value: string, label: string }>` | `[]` | Radio options |
| `value` | `string` | - | Current selected value |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `error` | `string` | - | Error message |

### Example

```tsx
<Radio
  label="Options"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  value={selectedOption}
  onChange={(e) => setSelectedOption(e.target.value)}
  direction="horizontal"
/>
```

## Tabs

Tabbed content interface.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `tabs` | `Array<{ id: string, label: string, content: ReactNode }>` | `[]` | Tab definitions |
| `defaultActiveTab` | `string` | - | ID of initially active tab |
| `onTabChange` | `(tabId: string) => void` | - | Tab change handler |

### Example

```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <div>Tab 1 content</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Tab 2 content</div> },
  ]}
  defaultActiveTab="tab1"
/>
```

## ThemeToggle

Light/dark theme toggle button.

### Example

```tsx
<ThemeToggle />
``` 