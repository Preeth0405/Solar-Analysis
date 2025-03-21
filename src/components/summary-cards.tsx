'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SolarDataPoint, DataSummary } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import { colorScheme } from '@/lib/data/constants';

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  color: string;
  unit?: string;
  decimals?: number;
}

export function SummaryCard({ 
  title, 
  value, 
  description, 
  color, 
  unit = 'kWh', 
  decimals = 2 
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>
          {formatNumber(value, decimals)} {unit}
        </div>
      </CardContent>
    </Card>
  );
}

interface PercentageCardProps {
  title: string;
  value: number;
  description: string;
  color: string;
}

export function PercentageCard({ 
  title, 
  value, 
  description, 
  color 
}: PercentageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-center my-4">
          {formatPercentage(value)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="h-4 rounded-full" 
            style={{ 
              width: `${Math.min(100, value)}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataSummaryCardProps {
  summary: DataSummary;
  dataPoints: number;
}

export function DataSummaryCard({ summary, dataPoints }: DataSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Summary</CardTitle>
        <CardDescription>Key metrics from your solar and demand data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Average Daily Production</p>
            <p className="text-lg font-semibold">{formatNumber(summary.averageDailySolarProduction)} kWh</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Daily Demand</p>
            <p className="text-lg font-semibold">{formatNumber(summary.averageDailyEnergyDemand)} kWh</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Peak Solar Production</p>
            <p className="text-lg font-semibold">{formatNumber(summary.peakSolarProduction)} kWh</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Peak Energy Demand</p>
            <p className="text-lg font-semibold">{formatNumber(summary.peakEnergyDemand)} kWh</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Energy Balance</p>
            <p className="text-lg font-semibold">
              {formatNumber(summary.totalSolarProduction - summary.totalEnergyDemand)} kWh
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Data Points</p>
            <p className="text-lg font-semibold">{dataPoints}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OverviewProps {
  data: SolarDataPoint[];
  summary: DataSummary;
}

export function Overview({ data, summary }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Solar Production"
          value={summary.totalSolarProduction}
          description="Total energy produced"
          color={colorScheme.solarProduction}
        />
        
        <SummaryCard
          title="Total Energy Demand"
          value={summary.totalEnergyDemand}
          description="Total energy consumed"
          color={colorScheme.energyDemand}
        />
        
        <SummaryCard
          title="Grid Import"
          value={summary.totalGridImport}
          description="Energy imported from grid"
          color={colorScheme.gridImport}
        />
        
        <SummaryCard
          title="Excess Export"
          value={summary.totalExcessExport}
          description="Energy exported to grid"
          color={colorScheme.excessExport}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PercentageCard
          title="Self-Consumption"
          value={summary.selfConsumptionPercentage}
          description="Percentage of solar energy directly consumed"
          color={colorScheme.solarProduction}
        />
        
        <PercentageCard
          title="Grid Dependency"
          value={summary.gridDependencyPercentage}
          description="Percentage of energy demand met by grid"
          color={colorScheme.gridImport}
        />
      </div>
      
      <DataSummaryCard summary={summary} dataPoints={data.length} />
    </div>
  );
}
