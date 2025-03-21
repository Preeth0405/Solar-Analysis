'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SolarDataPoint } from '@/lib/types';
import { calculateCostSavings, calculateEmissionsReduction, calculateSelfSufficiency, calculateStoragePotential, calculatePeakShaving } from '@/lib/utils/advanced-calculations';
import { formatNumber, formatPercentage } from '@/lib/utils/helpers';
import { colorScheme } from '@/lib/data/constants';

interface AdvancedAnalysisProps {
  data: SolarDataPoint[];
}

export function AdvancedAnalysis({ data }: AdvancedAnalysisProps) {
  const [gridImportRate, setGridImportRate] = useState(0.15);
  const [gridExportRate, setGridExportRate] = useState(0.08);
  const [emissionFactor, setEmissionFactor] = useState(0.5);
  const [storageCapacity, setStorageCapacity] = useState(5);
  
  // Calculate metrics
  const costSavings = calculateCostSavings(data, gridImportRate, gridExportRate);
  const emissions = calculateEmissionsReduction(data, emissionFactor);
  const selfSufficiency = calculateSelfSufficiency(data);
  const storagePotential = calculateStoragePotential(data);
  const peakShaving = calculatePeakShaving(data, storageCapacity);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="cost">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="cost">Cost Savings</TabsTrigger>
          <TabsTrigger value="emissions">Emissions</TabsTrigger>
          <TabsTrigger value="self-sufficiency">Self-Sufficiency</TabsTrigger>
          <TabsTrigger value="storage">Storage Potential</TabsTrigger>
          <TabsTrigger value="peak">Peak Shaving</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Savings Analysis</CardTitle>
              <CardDescription>Financial benefits of your solar energy system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cost Comparison</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Cost Without Solar</p>
                      <p className="text-2xl font-bold">${formatNumber(costSavings.totalCostWithoutSolar)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Cost With Solar</p>
                      <p className="text-2xl font-bold">${formatNumber(costSavings.totalCostWithSolar)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Savings</p>
                      <p className="text-2xl font-bold text-green-600">${formatNumber(costSavings.totalSavings)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Savings Percentage</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(costSavings.savingsPercentage)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Savings Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grid Import Cost</p>
                      <p className="text-lg font-semibold text-red-500">${formatNumber(costSavings.totalGridImportCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grid Export Credit</p>
                      <p className="text-lg font-semibold text-green-600">${formatNumber(costSavings.totalGridExportCredit)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Solar Savings (Avoided Import)</p>
                      <p className="text-lg font-semibold text-green-600">${formatNumber(costSavings.totalSolarSavings)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emissions Reduction Analysis</CardTitle>
              <CardDescription>Environmental benefits of your solar energy system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Emissions Comparison</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emissions Without Solar</p>
                      <p className="text-2xl font-bold">{formatNumber(emissions.emissionsWithoutSolar)} kg CO₂</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emissions With Solar</p>
                      <p className="text-2xl font-bold">{formatNumber(emissions.emissionsWithSolar)} kg CO₂</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emissions Reduction</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(emissions.emissionsReduction)} kg CO₂</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reduction Percentage</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(emissions.reductionPercentage)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Environmental Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emissions Reduction (Metric Tons)</p>
                      <p className="text-lg font-semibold">{formatNumber(emissions.emissionsReductionTons)} tons CO₂</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Equivalent Trees Planted</p>
                      <p className="text-lg font-semibold">{emissions.equivalentTreesPlanted} trees</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="self-sufficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Self-Sufficiency Analysis</CardTitle>
              <CardDescription>How independent your energy usage is from the grid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Self-Sufficiency Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Self-Sufficiency Percentage</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(selfSufficiency.selfSufficiencyPercentage)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Self-Consumption Percentage</p>
                      <p className="text-2xl font-bold">{formatPercentage(selfSufficiency.selfConsumptionPercentage)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grid Dependency Percentage</p>
                      <p className="text-2xl font-bold text-red-500">{formatPercentage(selfSufficiency.gridDependencyPercentage)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hour Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Self-Sufficient Hours</p>
                      <p className="text-lg font-semibold">{selfSufficiency.selfSufficientHours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Excess Production Hours</p>
                      <p className="text-lg font-semibold">{selfSufficiency.excessProductionHours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Grid Dependent Hours</p>
                      <p className="text-lg font-semibold">{selfSufficiency.gridDependentHours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">No Production Hours</p>
                      <p className="text-lg font-semibold">{selfSufficiency.noProductionHours} hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Storage Potential Analysis</CardTitle>
              <CardDescription>How battery storage could improve your energy self-sufficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Storage Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Self-Sufficiency</p>
                      <p className="text-2xl font-bold">{formatPercentage(storagePotential.currentSelfSufficiency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Potential Self-Sufficiency with Storage</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(storagePotential.potentialSelfSufficiency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Self-Sufficiency Improvement</p>
                      <p className="text-2xl font-bold text-green-600">+{formatPercentage(storagePotential.selfSufficiencyImprovement)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Storage Recommendations</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Optimal Storage Capacity</p>
                      <p className="text-lg font-semibold">{formatNumber(storagePotential.optimalStorageCapacity)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Excess Energy</p>
                      <p className="text-lg font-semibold">{formatNumber(storagePotential.totalExcessEnergy)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Deficit Energy</p>
                      <p className="text-lg font-semibold">{formatNumber(storagePotential.totalDeficitEnergy)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Potential Additional Self-Consumption</p>
                      <p className="text-lg font-semibold">{formatNumber(storagePotential.potentialAdditionalSelfConsumption)} kWh</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="peak" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Shaving Analysis</CardTitle>
              <CardDescription>How battery storage could reduce peak demand charges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Peak Demand Impact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Peak Demand</p>
                      <p className="text-2xl font-bold">{formatNumber(peakShaving.totalPeakDemand)} kW</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Peak Demand After Shaving</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(peakShaving.totalPeakDemandAfterShaving)} kW</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Peak Reduction</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(peakShaving.totalPeakReduction)} kW</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Peak Reduction Percentage</p>
                      <p className="text-2xl font-bold text-green-600">{formatPercentage(peakShaving.peakReductionPercentage)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Storage Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recommended Storage Capacity</p>
                      <p className="text-lg font-semibold">{formatNumber(peakShaving.recommendedStorageCapacity)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Days Analyzed</p>
                      <p className="text-lg font-semibold">{peakShaving.daysAnalyzed} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
