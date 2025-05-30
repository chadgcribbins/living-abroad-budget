'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Legend
} from 'recharts';

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  className?: string;
  height?: number | string;
  width?: number | string;
  colors?: string[];
  thresholds?: number[];
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  formatter?: (value: number) => string;
  label?: string | React.ReactNode;
  showLegend?: boolean;
  legendLabels?: string[];
}

/**
 * A customizable gauge chart component built on recharts
 * 
 * @example
 * <GaugeChart
 *   value={65}
 *   min={0}
 *   max={100}
 *   thresholds={[33, 67]}
 *   colors={['#FF5252', '#FFC107', '#4CAF50']}
 *   formatter={(value) => `${value}%`}
 * />
 */
const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  className = '',
  height = 300,
  width = '100%',
  colors = ['#FF5252', '#FFBF00', '#4CAF50'],
  thresholds = [33, 67],
  innerRadius = '70%',
  outerRadius = '90%',
  startAngle = 180,
  endAngle = 0,
  formatter = (value: number) => `${value}`,
  label,
  showLegend = false,
  legendLabels = ['Low', 'Medium', 'High'],
}) => {
  // Ensure value is within bounds
  const boundedValue = Math.min(Math.max(value, min), max);
  
  // Calculate percentage
  const percentage = ((boundedValue - min) / (max - min)) * 100;
  
  // Prepare data for rendering
  const data = [
    { name: 'value', value: percentage },
    { name: 'remainder', value: 100 - percentage },
  ];

  // Determine color based on thresholds
  let colorIndex = 0;
  if (thresholds && thresholds.length > 0) {
    for (let i = 0; i < thresholds.length; i++) {
      if (percentage >= thresholds[i]) {
        colorIndex = i + 1;
      }
    }
  }

  // Prepare legend data if needed
  const legendItems = [
    ...thresholds.slice(0, thresholds.length - 1).map((_, i) => ({
      name: legendLabels[i],
      value: i,
      color: colors[i],
    })),
    { name: legendLabels[thresholds.length], value: thresholds.length, color: colors[thresholds.length] }
  ];

  // Custom legend content
  const CustomLegend = () => {
    return (
      <div className="flex justify-center gap-6 mt-4">
        {legendItems.map((item, index) => (
          <div key={`legend-item-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            cornerRadius={0}
            stroke="none"
          >
            <Cell key="gauge-cell-0" fill={colors[colorIndex]} />
            <Cell key="gauge-cell-1" fill="#EAEAEA" /> {/* Background */}
            <Label
              content={
                ({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 20}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-2xl font-bold fill-current"
                      >
                        {formatter(boundedValue)}
                      </text>
                      {label && (
                        <text
                          x={cx}
                          y={cy + 10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm fill-base-content fill-opacity-60"
                        >
                          {label}
                        </text>
                      )}
                    </g>
                  );
                }
              }
              position="center"
            />
          </Pie>
          {showLegend && (
            <Legend content={<CustomLegend />} />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GaugeChart; 