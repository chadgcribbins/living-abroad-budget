'use client';

import React from 'react';
import { LineChart, BarChart, PieChart, GaugeChart } from './charts';
import type { LineDataPoint, BarDataPoint, PieDataPoint } from './charts';

// Sample data for the charts
const lineChartData: LineDataPoint[] = [
  { date: 'Jan', expenses: 1500, income: 2500, savings: 1000 },
  { date: 'Feb', expenses: 1600, income: 2700, savings: 1100 },
  { date: 'Mar', expenses: 1400, income: 2800, savings: 1400 },
  { date: 'Apr', expenses: 1700, income: 2900, savings: 1200 },
  { date: 'May', expenses: 1800, income: 3000, savings: 1200 },
  { date: 'Jun', expenses: 1500, income: 3100, savings: 1600 },
];

const barChartData: BarDataPoint[] = [
  { name: 'Housing', current: 900, average: 800 },
  { name: 'Food', current: 400, average: 350 },
  { name: 'Transport', current: 200, average: 250 },
  { name: 'Utilities', current: 150, average: 180 },
  { name: 'Entertainment', current: 300, average: 220 },
  { name: 'Other', current: 250, average: 300 },
];

const pieChartData: PieDataPoint[] = [
  { name: 'Stocks', value: 4500 },
  { name: 'Bonds', value: 2500 },
  { name: 'Cash', value: 1200 },
  { name: 'Real Estate', value: 3000 },
  { name: 'Crypto', value: 800 },
];

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString()}`;
};

/**
 * Financial dashboard component showcasing various chart visualizations
 */
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
      
      {/* Income & Expenses Trend */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Income & Expenses Trend</h2>
          <p className="text-sm text-base-content/70">Monthly financial overview</p>
          <div className="h-80 mt-4">
            <LineChart
              data={lineChartData}
              lines={[
                { dataKey: 'income', color: '#4CAF50', name: 'Income' },
                { dataKey: 'expenses', color: '#FF5252', name: 'Expenses' },
                { dataKey: 'savings', color: '#2196F3', name: 'Savings' }
              ]}
              formatter={formatCurrency}
            />
          </div>
        </div>
      </div>
      
      {/* Expense Categories Comparison */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Expense Comparison</h2>
          <p className="text-sm text-base-content/70">Current vs Average</p>
          <div className="h-80 mt-4">
            <BarChart
              data={barChartData}
              bars={[
                { dataKey: 'current', color: '#FF5252', name: 'Current Month' },
                { dataKey: 'average', color: '#9C27B0', name: 'Monthly Average' }
              ]}
              formatter={formatCurrency}
            />
          </div>
        </div>
      </div>
      
      {/* Investment Portfolio & Savings Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Portfolio */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Investment Portfolio</h2>
            <p className="text-sm text-base-content/70">Asset allocation</p>
            <div className="h-80 mt-4">
              <PieChart
                data={pieChartData}
                innerRadius="60%"
                formatter={formatCurrency}
                colors={['#4CAF50', '#2196F3', '#FFEB3B', '#FF9800', '#9C27B0']}
              />
            </div>
          </div>
        </div>
        
        {/* Savings Goal Progress */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Savings Goal Progress</h2>
            <p className="text-sm text-base-content/70">Emergency fund status</p>
            <div className="h-80 mt-4 flex items-center justify-center">
              <GaugeChart
                value={75}
                min={0}
                max={100}
                thresholds={[33, 67]}
                colors={['#FF5252', '#FFEB3B', '#4CAF50']}
                formatter={(value) => `${value}%`}
                label="Goal: $10,000"
                showLegend={true}
                legendLabels={['At Risk', 'Building', 'On Track']}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Debt-to-Income Ratio */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Debt-to-Income</h2>
            <div className="h-60 mt-2">
              <GaugeChart
                value={38}
                min={0}
                max={100}
                thresholds={[35, 45]}
                colors={['#4CAF50', '#FFEB3B', '#FF5252']}
                formatter={(value) => `${value}%`}
                innerRadius="65%"
                outerRadius="85%"
              />
            </div>
          </div>
        </div>
        
        {/* Savings Rate */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Monthly Savings Rate</h2>
            <div className="h-60 mt-2">
              <GaugeChart
                value={22}
                min={0}
                max={50}
                thresholds={[15, 25]}
                colors={['#FF5252', '#FFEB3B', '#4CAF50']}
                formatter={(value) => `${value}%`}
                innerRadius="65%"
                outerRadius="85%"
              />
            </div>
          </div>
        </div>
        
        {/* Investment Performance */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Investment Return</h2>
            <div className="h-60 mt-2">
              <GaugeChart
                value={8.5}
                min={0}
                max={15}
                thresholds={[5, 10]}
                colors={['#FF5252', '#FFEB3B', '#4CAF50']}
                formatter={(value) => `${value}%`}
                innerRadius="65%"
                outerRadius="85%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 