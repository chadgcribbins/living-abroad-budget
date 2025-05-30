import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LineChart } from '@/components/charts';

// Mock recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: ({ dataKey, stroke }: { dataKey: string; stroke: string }) => (
      <div data-testid={`line-${dataKey}`} data-stroke={stroke}></div>
    ),
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

describe('LineChart Component', () => {
  const testData = [
    { date: 'Jan', value1: 100, value2: 200 },
    { date: 'Feb', value1: 200, value2: 300 },
  ];

  const testLines = [
    { dataKey: 'value1', color: '#ff0000', name: 'Value 1' },
    { dataKey: 'value2', color: '#00ff00', name: 'Value 2' },
  ];

  test('renders the LineChart component', () => {
    render(<LineChart data={testData} lines={testLines} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('renders both lines with correct data keys', () => {
    render(<LineChart data={testData} lines={testLines} />);
    
    expect(screen.getByTestId('line-value1')).toBeInTheDocument();
    expect(screen.getByTestId('line-value2')).toBeInTheDocument();
  });

  test('renders with correct line colors', () => {
    render(<LineChart data={testData} lines={testLines} />);
    
    expect(screen.getByTestId('line-value1')).toHaveAttribute('data-stroke', '#ff0000');
    expect(screen.getByTestId('line-value2')).toHaveAttribute('data-stroke', '#00ff00');
  });

  test('renders axes and grid', () => {
    render(<LineChart data={testData} lines={testLines} />);
    
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  test('does not render grid when showGrid is false', () => {
    render(<LineChart data={testData} lines={testLines} showGrid={false} />);
    
    expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
  });

  test('renders legend by default', () => {
    render(<LineChart data={testData} lines={testLines} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('does not render legend when showLegend is false', () => {
    render(<LineChart data={testData} lines={testLines} showLegend={false} />);
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });
}); 