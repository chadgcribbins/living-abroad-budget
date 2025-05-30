'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Cell
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export type BarDataPoint = {
  name: string;
  [key: string]: string | number;
};

export type BarConfig = {
  dataKey: string;
  color: string;
  name?: string;
};

export interface BarChartProps {
  data: BarDataPoint[];
  bars: BarConfig[];
  height?: number | string;
  width?: number | string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  formatter?: (value: number) => string;
  tooltipFormatter?: (value: ValueType, name: NameType) => [ValueType, NameType];
  tooltipLabelFormatter?: (label: string) => string;
  layout?: 'vertical' | 'horizontal';
  barSize?: number;
  stackId?: string;
  isStacked?: boolean;
  barGap?: number;
  barCategoryGap?: number;
  useColorfulBars?: boolean;
  colorfulBarColors?: string[];
}

/**
 * A customizable bar chart component built on recharts
 * 
 * @example
 * <BarChart
 *   data={[
 *     { name: 'Category A', value1: 400, value2: 300 },
 *     { name: 'Category B', value1: 300, value2: 200 },
 *   ]}
 *   bars={[
 *     { dataKey: 'value1', color: '#8884d8' },
 *     { dataKey: 'value2', color: '#82ca9d' },
 *   ]}
 *   formatter={(value) => `$${value}`}
 * />
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  bars,
  height = 400,
  width = '100%',
  className = '',
  showGrid = true,
  showLegend = true,
  formatter,
  tooltipFormatter,
  tooltipLabelFormatter,
  layout = 'horizontal',
  barSize,
  stackId,
  isStacked = false,
  barGap,
  barCategoryGap,
  useColorfulBars = false,
  colorfulBarColors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658']
}) => {
  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) {
      return null;
    }

    const formattedLabel = tooltipLabelFormatter ? tooltipLabelFormatter(label) : label;

    return (
      <div className="bg-base-100 shadow-md p-3 border border-base-300 rounded-md">
        <p className="font-semibold">{formattedLabel}</p>
        <div className="mt-2">
          {payload.map((item, index) => {
            const value = tooltipFormatter
              ? tooltipFormatter(item.value as ValueType, item.name as NameType)[0]
              : formatter
              ? formatter(item.value as number)
              : item.value;
            
            return (
              <div key={`tooltip-item-${index}`} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}:</span>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // For single colorful bar
  const getColorfulBar = () => {
    if (bars.length !== 1 || !useColorfulBars) return null;
    
    return (
      <Bar 
        dataKey={bars[0].dataKey} 
        name={bars[0].name || bars[0].dataKey}
        barSize={barSize}
      >
        {data.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={colorfulBarColors[index % colorfulBarColors.length]}
          />
        ))}
      </Bar>
    );
  };
  
  // For regular bars (non-colorful or multiple bars)
  const getNormalBars = () => {
    if (useColorfulBars && bars.length === 1) return null;

    return bars.map((bar, index) => (
      <Bar
        key={`bar-${index}`}
        dataKey={bar.dataKey}
        fill={bar.color}
        name={bar.name || bar.dataKey}
        stackId={isStacked ? (stackId || 'stack') : undefined}
        barSize={barSize}
      />
    ));
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barGap={barGap}
          barCategoryGap={barCategoryGap}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
            axisLine={{ stroke: '#e0e0e0' }}
            type={layout === 'vertical' ? 'number' : 'category'}
            tickFormatter={layout === 'vertical' ? formatter : undefined}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={layout === 'horizontal' ? formatter : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          
          {getColorfulBar()}
          {getNormalBars()}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart; 