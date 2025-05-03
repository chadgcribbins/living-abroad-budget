'use client';

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  PieLabelRenderProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export type PieDataPoint = {
  name: string;
  value: number;
  color?: string;
};

// For Recharts' Pie component, label can be one of the following:
// - boolean: true/false to show/hide the default label
// - React element: A custom component to render for each segment
// - Function: A function that returns a React element
// - Object: Configuration for the label
type PieLabel = 
  | boolean 
  | React.ReactElement 
  | ((props: PieLabelRenderProps) => React.ReactNode) 
  | { offset?: number; position?: string };

export interface PieChartProps {
  data: PieDataPoint[];
  height?: number | string;
  width?: number | string;
  className?: string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  showLegend?: boolean;
  formatter?: (value: number) => string;
  tooltipFormatter?: (value: ValueType, name: NameType) => [ValueType, NameType];
  colors?: string[];
  dataKey?: string;
  nameKey?: string;
  paddingAngle?: number;
  activeIndex?: number;
  onSliceClick?: (data: PieDataPoint, index: number) => void;
  startAngle?: number;
  endAngle?: number;
  labelLine?: boolean;
  label?: PieLabel;
}

/**
 * A customizable pie chart component built on recharts
 * Supports both pie and donut charts (set innerRadius for donut)
 * 
 * @example
 * <PieChart
 *   data={[
 *     { name: 'Group A', value: 400 },
 *     { name: 'Group B', value: 300 },
 *   ]}
 *   innerRadius="60%"
 *   outerRadius="80%"
 *   formatter={(value) => `$${value}`}
 * />
 */
const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 400,
  width = '100%',
  className = '',
  innerRadius = 0,
  outerRadius = "80%",
  showLegend = true,
  formatter,
  tooltipFormatter,
  colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'],
  dataKey = "value",
  nameKey = "name",
  paddingAngle = 0,
  activeIndex,
  onSliceClick,
  startAngle = 0,
  endAngle = 360,
  labelLine = true,
  label = false,
}) => {
  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) {
      return null;
    }

    const item = payload[0];
    const value = tooltipFormatter
      ? tooltipFormatter(item.value as ValueType, item.name as NameType)[0]
      : formatter
      ? formatter(item.value as number)
      : item.value;

    return (
      <div className="bg-base-100 shadow-md p-3 border border-base-300 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">{item.name}:</span>
          <span>{value}</span>
        </div>
      </div>
    );
  };

  // Handle click on a slice
  const handleClick = (data: PieDataPoint, index: number) => {
    if (onSliceClick) {
      onSliceClick(data, index);
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart>
          <Pie
            activeIndex={activeIndex}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            nameKey={nameKey}
            dataKey={dataKey}
            paddingAngle={paddingAngle}
            startAngle={startAngle}
            endAngle={endAngle}
            onClick={handleClick}
            labelLine={labelLine}
            label={label}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart; 