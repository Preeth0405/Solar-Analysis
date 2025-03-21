'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SolarDataPoint } from '@/lib/types';
import { 
  ProductionVsDemandChart, 
  GridInteractionChart, 
  NetEnergyChart,
  HourlyAveragesChart,
  DailyTotalsChart
} from '@/components/charts';

interface DailyAnalysisProps {
  data: SolarDataPoint[];
}

export function DailyAnalysis({ data }: DailyAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Energy Analysis</CardTitle>
          <CardDescription>
            Analyze daily patterns of solar production and energy demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="production-demand">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="production-demand">Production vs Demand</TabsTrigger>
              <TabsTrigger value="grid-interaction">Grid Interaction</TabsTrigger>
              <TabsTrigger value="net-energy">Net Energy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="production-demand">
              <DailyTotalsChart data={data} height={400} />
            </TabsContent>
            
            <TabsContent value="grid-interaction">
              <GridInteractionChart data={data} height={400} />
            </TabsContent>
            
            <TabsContent value="net-energy">
              <NetEnergyChart data={data} height={400} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface HourlyAnalysisProps {
  data: SolarDataPoint[];
}

export function HourlyAnalysis({ data }: HourlyAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hourly Energy Analysis</CardTitle>
          <CardDescription>
            Analyze hourly patterns of solar production and energy demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HourlyAveragesChart data={data} height={400} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Peak Production Hours</CardTitle>
            <CardDescription>Hours with highest solar production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500">Peak production analysis will be implemented in the next phase</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peak Demand Hours</CardTitle>
            <CardDescription>Hours with highest energy demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500">Peak demand analysis will be implemented in the next phase</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MonthlyAnalysisProps {
  data: SolarDataPoint[];
}

export function MonthlyAnalysis({ data }: MonthlyAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Energy Analysis</CardTitle>
          <CardDescription>
            Analyze monthly patterns of solar production and energy demand
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Monthly analysis visualizations will be implemented in the next phase</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface EnergyBalanceProps {
  data: SolarDataPoint[];
}

export function EnergyBalance({ data }: EnergyBalanceProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Energy Balance Analysis</CardTitle>
          <CardDescription>
            Analyze energy balance, grid import, and excess export
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Energy balance visualizations will be implemented in the next phase</p>
        </CardContent>
      </Card>
    </div>
  );
}
