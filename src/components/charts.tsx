'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { colorScheme } from '@/lib/data/constants';
import { SolarDataPoint } from '@/lib/types';

interface ChartProps {
  data: SolarDataPoint[];
  height?: number;
}

export function ProductionVsDemandChart({ data, height = 300 }: ChartProps) {
  // Format data for the chart
  const chartData = data.map(point => ({
    date: point.date,
    solarProduction: point.solarProduction,
    energyDemand: point.energyDemand
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solar Production vs Energy Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="solarProduction" 
                name="Solar Production" 
                stroke={colorScheme.solarProduction} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="energyDemand" 
                name="Energy Demand" 
                stroke={colorScheme.energyDemand} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function GridInteractionChart({ data, height = 300 }: ChartProps) {
  // Format data for the chart
  const chartData = data.map(point => ({
    date: point.date,
    gridImport: point.gridImport || 0,
    excessExport: point.excessExport || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grid Import vs Excess Export</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="gridImport" 
                name="Grid Import" 
                fill={colorScheme.gridImport} 
              />
              <Bar 
                dataKey="excessExport" 
                name="Excess Export" 
                fill={colorScheme.excessExport} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function NetEnergyChart({ data, height = 300 }: ChartProps) {
  // Format data for the chart
  const chartData = data.map(point => ({
    date: point.date,
    netEnergy: point.netEnergy || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Energy Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="netEnergyPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorScheme.excessExport} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colorScheme.excessExport} stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="netEnergyNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorScheme.gridImport} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colorScheme.gridImport} stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="netEnergy" 
                name="Net Energy" 
                stroke={colorScheme.netEnergy}
                fillOpacity={1}
                fill="url(#netEnergyPositive)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function HourlyAveragesChart({ data, height = 300 }: ChartProps) {
  // Group data by hour and calculate averages
  const hourlyData: Record<number, { solar: number[], demand: number[] }> = {};
  
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { solar: [], demand: [] };
  }
  
  data.forEach(point => {
    hourlyData[point.hour].solar.push(point.solarProduction);
    hourlyData[point.hour].demand.push(point.energyDemand);
  });
  
  // Calculate averages
  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const solarValues = hourlyData[hour].solar;
    const demandValues = hourlyData[hour].demand;
    
    const solarAvg = solarValues.length > 0 
      ? solarValues.reduce((sum, val) => sum + val, 0) / solarValues.length 
      : 0;
      
    const demandAvg = demandValues.length > 0 
      ? demandValues.reduce((sum, val) => sum + val, 0) / demandValues.length 
      : 0;
    
    return {
      hour: `${hour}:00`,
      solarProduction: parseFloat(solarAvg.toFixed(2)),
      energyDemand: parseFloat(demandAvg.toFixed(2))
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Hourly Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="solarProduction" 
                name="Avg Solar Production" 
                stroke={colorScheme.solarProduction} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="energyDemand" 
                name="Avg Energy Demand" 
                stroke={colorScheme.energyDemand} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyTotalsChart({ data, height = 300 }: ChartProps) {
  // Group data by date
  const dailyData: Record<string, { solar: number, demand: number }> = {};
  
  data.forEach(point => {
    if (!dailyData[point.date]) {
      dailyData[point.date] = { solar: 0, demand: 0 };
    }
    
    dailyData[point.date].solar += point.solarProduction;
    dailyData[point.date].demand += point.energyDemand;
  });
  
  // Convert to array for chart
  const chartData = Object.entries(dailyData).map(([date, values]) => ({
    date,
    solarProduction: parseFloat(values.solar.toFixed(2)),
    energyDemand: parseFloat(values.demand.toFixed(2))
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Energy Totals</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="solarProduction" 
                name="Solar Production" 
                fill={colorScheme.solarProduction} 
              />
              <Bar 
                dataKey="energyDemand" 
                name="Energy Demand" 
                fill={colorScheme.energyDemand} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
