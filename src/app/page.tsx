'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateDerivedMetrics, 
  calculateSummary, 
  filterData, 
  generateSampleData,
  aggregateByDay,
  aggregateByMonth,
  aggregateByHour
} from '@/lib/utils/data-processing';
import { SolarDataPoint, FilterOptions, DataSummary } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterPanel } from '@/components/filter-panel';
import { Overview } from '@/components/summary-cards';
import { DailyAnalysis, HourlyAnalysis, MonthlyAnalysis, EnergyBalance } from '@/components/analysis-views';
import { viewOptions } from '@/lib/data/constants';
import { downloadCSV } from '@/lib/utils/helpers';

export default function CalculationEngine() {
  const [rawData, setRawData] = useState<SolarDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<SolarDataPoint[]>([]);
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [activeView, setActiveView] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [calculationComplete, setCalculationComplete] = useState(false);

  // Load sample data
  const handleLoadSampleData = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const sampleData = generateSampleData();
      processData(sampleData);
      setIsLoading(false);
    }, 500);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.trim().split('\n');
      const headers = lines[0].split(',');
      
      const processedData: SolarDataPoint[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        
        const dataPoint: SolarDataPoint = {
          timestamp: row['Timestamp'] || '',
          date: row['Date'] || '',
          time: row['Time'] || '',
          hour: parseInt(row['Hour'] || '0', 10),
          day: parseInt(row['Day'] || '0', 10),
          month: parseInt(row['Month'] || '0', 10),
          monthName: row['Month_Name'] || '',
          year: parseInt(row['Year'] || '0', 10),
          dayOfWeek: parseInt(row['Day_of_Week'] || '0', 10),
          dayName: row['Day_Name'] || '',
          isWeekend: row['Is_Weekend'] === '1',
          quarter: parseInt(row['Quarter'] || '0', 10),
          weekOfYear: parseInt(row['Week_of_Year'] || '0', 10),
          solarProduction: parseFloat(row['Solar_Production_kWh'] || '0'),
          energyDemand: parseFloat(row['Energy_Demand_kWh'] || '0'),
        };
        
        processedData.push(dataPoint);
      }
      
      processData(processedData);
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  // Process data with calculations
  const processData = (data: SolarDataPoint[]) => {
    // Calculate derived metrics for each data point
    const dataWithCalculations = data.map(point => calculateDerivedMetrics(point));
    
    // Set raw data
    setRawData(dataWithCalculations);
    setFilteredData(dataWithCalculations);
    
    // Calculate summary
    setSummary(calculateSummary(dataWithCalculations));
    
    // Mark calculations as complete
    setCalculationComplete(true);
  };

  // Handle filter changes
  const handleFilterChange = (filters: FilterOptions) => {
    if (rawData.length === 0) return;
    
    // Apply filters to raw data
    const filtered = filterData(rawData, filters);
    
    // Update filtered data
    setFilteredData(filtered);
    
    // Recalculate summary based on filtered data
    setSummary(calculateSummary(filtered));
  };

  // Export calculated data
  const handleExportData = () => {
    if (filteredData.length === 0) return;
    
    // Download filtered data as CSV
    downloadCSV(filteredData, 'solar_analysis_data.csv');
  };

  // Calculate additional metrics for specific views
  const getDailyData = () => {
    return aggregateByDay(filteredData);
  };

  const getMonthlyData = () => {
    return aggregateByMonth(filteredData);
  };

  const getHourlyAverages = () => {
    return aggregateByHour(filteredData);
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Solar Production and Demand Analysis</h1>
        <p className="text-gray-600 mb-6 text-center max-w-2xl">
          Analyze solar production and energy demand data with hourly intervals. 
          Calculate grid import and excess energy export to optimize your energy usage.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Button 
            onClick={handleLoadSampleData} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load Sample Data'}
          </Button>
          
          <div className="relative">
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-green-600 hover:bg-green-700 w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Upload Your Data'}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {filteredData.length > 0 && summary ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Analysis Dashboard</h2>
            <Button onClick={handleExportData} variant="outline">
              Export Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
            
            <div className="md:col-span-3">
              <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  {viewOptions.map((option) => (
                    <TabsTrigger key={option.value} value={option.value}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="overview">
                  <Overview data={filteredData} summary={summary} />
                </TabsContent>
                
                <TabsContent value="hourly">
                  <HourlyAnalysis data={filteredData} />
                </TabsContent>
                
                <TabsContent value="daily">
                  <DailyAnalysis data={filteredData} />
                </TabsContent>
                
                <TabsContent value="monthly">
                  <MonthlyAnalysis data={filteredData} />
                </TabsContent>
                
                <TabsContent value="balance">
                  <EnergyBalance data={filteredData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-4 text-center">
            Please load sample data or upload your own CSV file to start analyzing your solar production and energy demand.
          </p>
          <p className="text-sm text-gray-500 text-center max-w-lg">
            Your data should include hourly solar production and energy demand values. 
            The application will calculate grid import and excess energy export based on this data.
          </p>
        </div>
      )}
    </main>
  );
}
