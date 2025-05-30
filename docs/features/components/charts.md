# Chart Components

This section documents the financial visualization components used throughout the Living Abroad Budget application.

## LineChart

Time-series visualization for financial data such as monthly income/expenses, investment performance over time, or currency exchange rate trends.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `Array<DataPoint>` | - | Array of data points for the chart (required) |
| `lines` | `Array<LineConfig>` | - | Configuration for each line to display (required) |
| `xAxisDataKey` | `string` | `'date'` | The key for x-axis data |
| `height` | `number \| string` | `400` | Chart height |
| `formatter` | `(value: number) => string` | - | Function to format Y-axis values and tooltips |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLegend` | `boolean` | `true` | Whether to show the legend |

### Interface

```typescript
interface DataPoint {
  [key: string]: any;
  // Example: { date: 'Jan', income: 1000, expenses: 800 }
}

interface LineConfig {
  dataKey: string; // Key in the data object for this line's values
  color: string;   // Line color (hex, rgb, etc.)
  name: string;    // Display name in legend and tooltips
}
```

### Example

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

## BarChart

Comparison visualization for financial categories such as budget allocations, expense categories, or comparing values between different periods or scenarios.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `Array<BarDataPoint>` | - | Array of data points for the chart (required) |
| `bars` | `Array<BarConfig>` | - | Configuration for each bar to display (required) |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Chart orientation |
| `isStacked` | `boolean` | `false` | Whether to stack bars |
| `useColorfulBars` | `boolean` | `false` | Use unique colors for each bar |
| `formatter` | `(value: number) => string` | - | Function to format axis values and tooltips |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLegend` | `boolean` | `true` | Whether to show the legend |

### Interface

```typescript
interface BarDataPoint {
  name: string;
  [key: string]: any;
  // Example: { name: 'Housing', value: 1200 }
  // Or for comparison: { name: 'Housing', uk: 1400, portugal: 900 }
}

interface BarConfig {
  dataKey: string; // Key in the data object for this bar's values
  color: string;   // Bar color (hex, rgb, etc.)
  name: string;    // Display name in legend and tooltips
}
```

### Basic Example

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

### Comparison Example (Stacked)

```tsx
<BarChart 
  data={[
    { name: 'Housing', uk: 1400, portugal: 900 },
    { name: 'Food', uk: 600, portugal: 450 },
    // ...more data
  ]} 
  bars={[
    { dataKey: 'uk', color: '#3B82F6', name: 'UK' },
    { dataKey: 'portugal', color: '#10B981', name: 'Portugal' }
  ]}
  formatter={(value) => `$${value}`}
  isStacked={true}
/>
```

## PieChart

Proportion visualization for budget allocation, portfolio composition, or expense breakdowns as percentages of a whole.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `data` | `Array<PieDataPoint>` | - | Array of data points for the chart (required) |
| `innerRadius` | `number \| string` | `0` | Inner radius for donut charts |
| `outerRadius` | `number \| string` | `'80%'` | Outer radius |
| `colors` | `Array<string>` | - | Array of colors for pie segments |
| `formatter` | `(value: number) => string` | - | Function to format values in tooltips |
| `activeIndex` | `number` | - | Index of the active (highlighted) segment |
| `onSliceClick` | `(index: number) => void` | - | Callback when a slice is clicked |
| `showLegend` | `boolean` | `true` | Whether to show the legend |

### Interface

```typescript
interface PieDataPoint {
  name: string;
  value: number;
  // Example: { name: 'Housing', value: 40 }
}
```

### Basic Example

```tsx
<PieChart 
  data={[
    { name: 'Housing', value: 40 },
    { name: 'Food', value: 20 },
    // ...more data
  ]} 
  formatter={(value) => `${value}%`}
/>
```

### Donut Chart Example

```tsx
<PieChart 
  data={[
    { name: 'Housing', value: 40 },
    { name: 'Food', value: 20 },
    // ...more data
  ]} 
  formatter={(value) => `${value}%`}
  innerRadius="60%"
  outerRadius="80%"
/>
```

## GaugeChart

Progress visualization for financial goals and metrics such as savings rate, budget utilization, or financial health indicators.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `value` | `number` | - | Current value to display (required) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `thresholds` | `Array<number>` | `[33, 67]` | Threshold values for color changes |
| `colors` | `Array<string>` | - | Colors for each threshold range (default: red, yellow, green) |
| `formatter` | `(value: number) => string` | - | Function to format the displayed value |
| `label` | `string \| ReactNode` | - | Label to display below the value |
| `showLegend` | `boolean` | `false` | Whether to show a legend |
| `legendLabels` | `Array<string>` | - | Labels for legend items |

### Example

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

## Interactive Chart Components

For interactivity beyond the default chart behaviors:

- All charts support tooltips on hover
- `PieChart` supports slice selection via `activeIndex` and `onSliceClick`
- `GaugeChart` can be animated by updating the `value` prop (typically with useState)

### Example of Interactive Gauge Chart

```tsx
const [savingsRate, setSavingsRate] = useState(65);

return (
  <>
    <GaugeChart 
      value={savingsRate} 
      thresholds={[30, 70]}
      formatter={(value) => `${value}%`}
      label="Savings Rate"
    />
    
    <div className="flex justify-center mt-4 gap-4">
      <Button 
        onClick={() => setSavingsRate(Math.max(0, savingsRate - 10))}
        disabled={savingsRate <= 0}
      >
        Decrease
      </Button>
      <Button 
        onClick={() => setSavingsRate(Math.min(100, savingsRate + 10))}
        disabled={savingsRate >= 100}
      >
        Increase
      </Button>
    </div>
  </>
);
``` 