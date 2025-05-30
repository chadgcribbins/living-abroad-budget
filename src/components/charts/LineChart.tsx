'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export type DataPoint = {
  date: string;
  [key: string]: string | number;
};

export type LineConfig = {
  dataKey: string;
  color: string;
  name?: string;
};

export interface LineChartProps {
  data: DataPoint[];
  lines: LineConfig[];
  xAxisDataKey?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  formatter?: (value: number) => string;
  tooltipFormatter?: (value: ValueType, name: NameType) => [ValueType, NameType];
  tooltipLabelFormatter?: (label: string) => string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisDataKey = 'date',
  height = 400,
  width = '100%',
  className = '',
  showGrid = true,
  showLegend = true,
  formatter,
  tooltipFormatter,
  tooltipLabelFormatter,
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

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={formatter}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              name={line.name || line.dataKey}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart; 