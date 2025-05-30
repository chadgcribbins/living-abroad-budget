'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  GaugeChart 
} from '@/components/charts';
import { Button, Card, Tabs } from '@/components/ui';
import { PageContainer } from '@/components/layout';

const ChartComponentsPage = () => {
  const tabItems = [
    { id: 'line', label: 'Line Charts', content: <LineChartSection /> },
    { id: 'bar', label: 'Bar Charts', content: <BarChartSection /> },
    { id: 'pie', label: 'Pie Charts', content: <PieChartSection /> },
    { id: 'gauge', label: 'Gauge Charts', content: <GaugeChartSection /> },
  ];

  return (
    <PageContainer title="Financial Chart Components">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Financial Visualization Components</h1>
      <Tabs 
        tabs={tabItems} 
        defaultActiveTab="line" 
        contentClassName="block min-h-[200px] visible"
      />
    </PageContainer>
  );
};

// Example data for line chart
const lineChartData = [
  { date: 'Jan', income: 1000, expenses: 800 },
  { date: 'Feb', income: 1200, expenses: 900 },
  { date: 'Mar', income: 1100, expenses: 950 },
  { date: 'Apr', income: 1400, expenses: 1000 },
  { date: 'May', income: 1300, expenses: 1100 },
  { date: 'Jun', income: 1500, expenses: 1200 },
];

const LineChartSection = () => {
  const lineConfig = [
    { dataKey: 'income', color: '#4CAF50', name: 'Income' },
    { dataKey: 'expenses', color: '#F44336', name: 'Expenses' },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Line Chart</h2>
        <p className="text-base-content/70">
          Line charts are perfect for visualizing time-series financial data such as monthly income/expenses,
          investment performance over time, or currency exchange rate trends.
        </p>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Basic Line Chart</h3>
          <div className="h-80">
            <LineChart 
              data={lineChartData} 
              lines={lineConfig}
              formatter={(value) => `$${value}`}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<LineChart 
  data={[
    { date: 'Jan', income: 1000, expenses: 800 },
    { date: 'Feb', income: 1200, expenses: 900 },
    // ...more data
  ]} 
  lines={[
    { dataKey: 'income', color: '#4CAF50', name: 'Income' },
    { dataKey: 'expenses', color: '#F44336', name: 'Expenses' },
  ]}
  formatter={(value) => \`$\${value}\`}
/>`}
            </pre>
          </div>
        </Card>
        
        <div className="p-4 border border-base-300 rounded-md">
          <h3 className="font-semibold mb-2">Props</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">data</td>
                <td className="py-2">DataPoint[]</td>
                <td className="py-2">Array of data points for the chart (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">lines</td>
                <td className="py-2">LineConfig[]</td>
                <td className="py-2">Configuration for each line to display (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">xAxisDataKey</td>
                <td className="py-2">string</td>
                <td className="py-2">The key for x-axis data (default: &apos;date&apos;)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">height</td>
                <td className="py-2">number | string</td>
                <td className="py-2">Chart height (default: 400)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">formatter</td>
                <td className="py-2">function</td>
                <td className="py-2">Function to format Y-axis values and tooltips</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">showGrid</td>
                <td className="py-2">boolean</td>
                <td className="py-2">Whether to show grid lines (default: true)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">showLegend</td>
                <td className="py-2">boolean</td>
                <td className="py-2">Whether to show the legend (default: true)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Example data for bar chart
const barChartData = [
  { name: 'Housing', value: 1200 },
  { name: 'Food', value: 500 },
  { name: 'Transport', value: 300 },
  { name: 'Utilities', value: 200 },
  { name: 'Entertainment', value: 150 },
  { name: 'Healthcare', value: 100 },
];

const BarChartSection = () => {
  // Comparison data for stacked bar chart
  const comparisonData = [
    { name: 'Housing', uk: 1400, portugal: 900 },
    { name: 'Food', uk: 600, portugal: 450 },
    { name: 'Transport', uk: 350, portugal: 200 },
    { name: 'Utilities', uk: 250, portugal: 150 },
    { name: 'Healthcare', uk: 200, portugal: 100 },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bar Chart</h2>
        <p className="text-base-content/70">
          Bar charts are great for comparing financial metrics across categories, 
          showing budget allocations, or comparing expenses between different periods or scenarios.
        </p>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Basic Bar Chart</h3>
          <div className="h-80">
            <BarChart 
              data={barChartData} 
              bars={[{ dataKey: 'value', color: '#6366F1', name: 'Amount' }]}
              formatter={(value) => `$${value}`}
              useColorfulBars={true}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<BarChart 
  data={[
    { name: 'Housing', value: 1200 },
    { name: 'Food', value: 500 },
    // ...more data
  ]} 
  bars={[{ dataKey: 'value', color: '#6366F1', name: 'Amount' }]}
  formatter={(value) => \`$\${value}\`}
  useColorfulBars={true}
/>`}
            </pre>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Comparison Bar Chart (Stacked)</h3>
          <div className="h-80">
            <BarChart 
              data={comparisonData} 
              bars={[
                { dataKey: 'uk', color: '#3B82F6', name: 'UK' },
                { dataKey: 'portugal', color: '#10B981', name: 'Portugal' }
              ]}
              formatter={(value) => `$${value}`}
              isStacked={true}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<BarChart 
  data={[
    { name: 'Housing', uk: 1400, portugal: 900 },
    { name: 'Food', uk: 600, portugal: 450 },
    // ...more data
  ]} 
  bars={[
    { dataKey: 'uk', color: '#3B82F6', name: 'UK' },
    { dataKey: 'portugal', color: '#10B981', name: 'Portugal' }
  ]}
  formatter={(value) => \`$\${value}\`}
  isStacked={true}
/>`}
            </pre>
          </div>
        </Card>
        
        <div className="p-4 border border-base-300 rounded-md">
          <h3 className="font-semibold mb-2">Props</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">data</td>
                <td className="py-2">BarDataPoint[]</td>
                <td className="py-2">Array of data points for the chart (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">bars</td>
                <td className="py-2">BarConfig[]</td>
                <td className="py-2">Configuration for each bar to display (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">layout</td>
                <td className="py-2">&apos;horizontal&apos; | &apos;vertical&apos;</td>
                <td className="py-2">Chart orientation (default: &apos;horizontal&apos;)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">isStacked</td>
                <td className="py-2">boolean</td>
                <td className="py-2">Whether to stack bars (default: false)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">useColorfulBars</td>
                <td className="py-2">boolean</td>
                <td className="py-2">Use unique colors for each bar (default: false)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">formatter</td>
                <td className="py-2">function</td>
                <td className="py-2">Function to format axis values and tooltips</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Example data for pie chart
const pieChartData = [
  { name: 'Housing', value: 40 },
  { name: 'Food', value: 20 },
  { name: 'Transport', value: 15 },
  { name: 'Utilities', value: 10 },
  { name: 'Entertainment', value: 10 },
  { name: 'Healthcare', value: 5 },
];

const PieChartSection = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pie Chart</h2>
        <p className="text-base-content/70">
          Pie charts are ideal for showing proportions such as budget allocations, portfolio composition,
          or expense breakdowns as percentages of a whole.
        </p>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Basic Pie Chart</h3>
          <div className="h-80">
            <PieChart 
              data={pieChartData} 
              formatter={(value) => `${value}%`}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<PieChart 
  data={[
    { name: 'Housing', value: 40 },
    { name: 'Food', value: 20 },
    // ...more data
  ]} 
  formatter={(value) => \`\${value}%\`}
/>`}
            </pre>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Donut Chart</h3>
          <div className="h-80">
            <PieChart 
              data={pieChartData} 
              formatter={(value) => `${value}%`}
              innerRadius="60%"
              outerRadius="80%"
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<PieChart 
  data={[
    { name: 'Housing', value: 40 },
    { name: 'Food', value: 20 },
    // ...more data
  ]} 
  formatter={(value) => \`\${value}%\`}
  innerRadius="60%"
  outerRadius="80%"
/>`}
            </pre>
          </div>
        </Card>
        
        <div className="p-4 border border-base-300 rounded-md">
          <h3 className="font-semibold mb-2">Props</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">data</td>
                <td className="py-2">PieDataPoint[]</td>
                <td className="py-2">Array of data points for the chart (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">innerRadius</td>
                <td className="py-2">number | string</td>
                <td className="py-2">Inner radius for donut charts (default: 0)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">outerRadius</td>
                <td className="py-2">number | string</td>
                <td className="py-2">Outer radius (default: &apos;80%&apos;)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">colors</td>
                <td className="py-2">string[]</td>
                <td className="py-2">Array of colors for pie segments</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">formatter</td>
                <td className="py-2">function</td>
                <td className="py-2">Function to format values in tooltips</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">activeIndex</td>
                <td className="py-2">number</td>
                <td className="py-2">Index of the active (highlighted) segment</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">onSliceClick</td>
                <td className="py-2">function</td>
                <td className="py-2">Callback when a slice is clicked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const GaugeChartSection = () => {
  const [savingsRate, setSavingsRate] = useState(65);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Gauge Chart</h2>
        <p className="text-base-content/70">
          Gauge charts are perfect for visualizing progress toward financial goals, showing financial health indicators, 
          or displaying metrics that have thresholds like budget utilization.
        </p>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Basic Gauge Chart</h3>
          <div className="h-80">
            <GaugeChart 
              value={savingsRate} 
              min={0}
              max={100}
              thresholds={[30, 70]}
              formatter={(value) => `${value}%`}
              label="Savings Rate"
              showLegend={true}
              legendLabels={['Low', 'Medium', 'High']}
            />
          </div>
          
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
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Example Code:</h4>
            <pre className="p-4 bg-base-200 rounded-md text-sm overflow-x-auto">
              {`<GaugeChart 
  value={65} 
  min={0}
  max={100}
  thresholds={[30, 70]}
  formatter={(value) => \`\${value}%\`}
  label="Savings Rate"
  showLegend={true}
  legendLabels={['Low', 'Medium', 'High']}
/>`}
            </pre>
          </div>
        </Card>
        
        <div className="p-4 border border-base-300 rounded-md">
          <h3 className="font-semibold mb-2">Props</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">value</td>
                <td className="py-2">number</td>
                <td className="py-2">Current value to display (required)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">min</td>
                <td className="py-2">number</td>
                <td className="py-2">Minimum value (default: 0)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">max</td>
                <td className="py-2">number</td>
                <td className="py-2">Maximum value (default: 100)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">thresholds</td>
                <td className="py-2">number[]</td>
                <td className="py-2">Threshold values for color changes (default: [33, 67])</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">colors</td>
                <td className="py-2">string[]</td>
                <td className="py-2">Colors for each threshold range (default: red, yellow, green)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">formatter</td>
                <td className="py-2">function</td>
                <td className="py-2">Function to format the displayed value</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">label</td>
                <td className="py-2">string | ReactNode</td>
                <td className="py-2">Label to display below the value</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">showLegend</td>
                <td className="py-2">boolean</td>
                <td className="py-2">Whether to show a legend (default: false)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">legendLabels</td>
                <td className="py-2">string[]</td>
                <td className="py-2">Labels for legend items</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ChartComponentsPage;