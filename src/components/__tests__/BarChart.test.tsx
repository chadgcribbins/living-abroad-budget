import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BarChart } from '@/components/charts';

// Mock recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children, layout }: { children: React.ReactNode, layout?: string }) => (
      <div data-testid="bar-chart" data-layout={layout}>{children}</div>
    ),
    Bar: ({ dataKey, fill, stackId, children }: { 
      dataKey: string; 
      fill?: string;
      stackId?: string;
      children?: React.ReactNode;
    }) => (
      <div 
        data-testid={`bar-${dataKey}`} 
        data-fill={fill}
        data-stacked={Boolean(stackId)}
      >
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => (
      <div data-testid="bar-cell" data-fill={fill}></div>
    ),
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

describe('BarChart Component', () => {
  const testData = [
    { name: 'Category 1', value: 100 },
    { name: 'Category 2', value: 200 },
  ];

  const testBars = [
    { dataKey: 'value', color: '#8884d8', name: 'Value' },
  ];

  test('renders the BarChart component', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('renders bar with correct data key', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('bar-value')).toBeInTheDocument();
  });

  test('renders with correct fill color', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('bar-value')).toHaveAttribute('data-fill', '#8884d8');
  });

  test('renders in horizontal layout by default', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-layout', 'horizontal');
  });

  test('renders in vertical layout when specified', () => {
    render(<BarChart data={testData} bars={testBars} layout="vertical" />);
    
    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-layout', 'vertical');
  });

  test('renders with stacked bars when isStacked is true', () => {
    const multipleTestBars = [
      { dataKey: 'value1', color: '#8884d8', name: 'Value 1' },
      { dataKey: 'value2', color: '#82ca9d', name: 'Value 2' },
    ];
    const stackedData = [
      { name: 'Category 1', value1: 100, value2: 200 },
      { name: 'Category 2', value1: 200, value2: 300 },
    ];

    render(<BarChart data={stackedData} bars={multipleTestBars} isStacked={true} />);
    
    const bars = screen.getAllByTestId(/^bar-value/);
    bars.forEach(bar => {
      expect(bar).toHaveAttribute('data-stacked', 'true');
    });
  });

  test('renders colorful bars when useColorfulBars is true', () => {
    render(<BarChart data={testData} bars={testBars} useColorfulBars={true} />);
    
    expect(screen.getByTestId('bar-value')).toBeInTheDocument();
  });

  test('renders with grid by default', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  test('does not render grid when showGrid is false', () => {
    render(<BarChart data={testData} bars={testBars} showGrid={false} />);
    
    expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument();
  });

  test('renders legend by default', () => {
    render(<BarChart data={testData} bars={testBars} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('does not render legend when showLegend is false', () => {
    render(<BarChart data={testData} bars={testBars} showLegend={false} />);
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });
}); 