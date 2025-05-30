import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PieChart, PieDataPoint } from '@/components/charts';

// Mock recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({ data, dataKey, innerRadius, outerRadius, children }: { 
      data: PieDataPoint[]; 
      dataKey: string; 
      innerRadius?: number | string; 
      outerRadius?: number | string;
      children?: React.ReactNode;
    }) => (
      <div 
        data-testid="pie" 
        data-datakey={dataKey} 
        data-innerradius={innerRadius}
        data-outerradius={outerRadius}
        data-itemcount={data.length}
      >
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill: string }) => (
      <div data-testid="pie-cell" data-fill={fill}></div>
    ),
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

describe('PieChart Component', () => {
  const testData = [
    { name: 'Category 1', value: 40 },
    { name: 'Category 2', value: 30 },
    { name: 'Category 3', value: 30 },
  ];

  test('renders the PieChart component', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  test('renders a pie with the correct data key', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-datakey', 'value');
  });

  test('renders with correct number of cells', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-itemcount', testData.length.toString());
    expect(screen.getAllByTestId('pie-cell').length).toBe(testData.length);
  });

  test('uses custom colors when provided', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    render(<PieChart data={testData} colors={customColors} />);
    
    const cells = screen.getAllByTestId('pie-cell');
    expect(cells[0]).toHaveAttribute('data-fill', customColors[0]);
    expect(cells[1]).toHaveAttribute('data-fill', customColors[1]);
    expect(cells[2]).toHaveAttribute('data-fill', customColors[2]);
  });

  test('renders as a donut chart when innerRadius is provided', () => {
    render(<PieChart data={testData} innerRadius="60%" />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-innerradius', '60%');
  });

  test('uses default innerRadius of 0', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-innerradius', '0');
  });

  test('customizes outerRadius when provided', () => {
    render(<PieChart data={testData} outerRadius="90%" />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-outerradius', '90%');
  });

  test('uses default outerRadius of 80%', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('pie')).toHaveAttribute('data-outerradius', '80%');
  });

  test('renders tooltip by default', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  test('renders legend by default', () => {
    render(<PieChart data={testData} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('does not render legend when showLegend is false', () => {
    render(<PieChart data={testData} showLegend={false} />);
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });
}); 