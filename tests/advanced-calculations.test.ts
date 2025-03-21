import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateCostSavings, 
  calculateEmissionsReduction, 
  calculateSelfSufficiency, 
  calculateStoragePotential, 
  calculatePeakShaving 
} from '../src/lib/utils/advanced-calculations';
import { SolarDataPoint } from '../src/lib/types';
import { calculateDerivedMetrics } from '../src/lib/utils/data-processing';

describe('Advanced Calculations Utilities', () => {
  let testData: SolarDataPoint[];
  
  beforeEach(() => {
    // Create test data with known values
    const rawData = [
      {
        timestamp: '2025-01-01T10:00:00',
        date: '2025-01-01',
        time: '10:00',
        hour: 10,
        day: 1,
        month: 1,
        monthName: 'January',
        year: 2025,
        dayOfWeek: 3,
        dayName: 'Wednesday',
        isWeekend: false,
        quarter: 1,
        weekOfYear: 1,
        solarProduction: 5.0,
        energyDemand: 2.0,
      },
      {
        timestamp: '2025-01-01T11:00:00',
        date: '2025-01-01',
        time: '11:00',
        hour: 11,
        day: 1,
        month: 1,
        monthName: 'January',
        year: 2025,
        dayOfWeek: 3,
        dayName: 'Wednesday',
        isWeekend: false,
        quarter: 1,
        weekOfYear: 1,
        solarProduction: 6.0,
        energyDemand: 3.0,
      },
      {
        timestamp: '2025-01-01T20:00:00',
        date: '2025-01-01',
        time: '20:00',
        hour: 20,
        day: 1,
        month: 1,
        monthName: 'January',
        year: 2025,
        dayOfWeek: 3,
        dayName: 'Wednesday',
        isWeekend: false,
        quarter: 1,
        weekOfYear: 1,
        solarProduction: 0.0,
        energyDemand: 4.0,
      },
      {
        timestamp: '2025-01-02T10:00:00',
        date: '2025-01-02',
        time: '10:00',
        hour: 10,
        day: 2,
        month: 1,
        monthName: 'January',
        year: 2025,
        dayOfWeek: 4,
        dayName: 'Thursday',
        isWeekend: false,
        quarter: 1,
        weekOfYear: 1,
        solarProduction: 4.5,
        energyDemand: 2.5,
      }
    ];
    
    // Process data to add derived metrics
    testData = rawData.map(point => calculateDerivedMetrics(point));
  });
  
  describe('calculateCostSavings', () => {
    it('should calculate cost savings correctly with default rates', () => {
      const costSavings = calculateCostSavings(testData);
      
      // Total energy demand: 11.5 kWh
      // Total grid import: 4.0 kWh
      // Total excess export: 8.0 kWh
      // Total self-consumed solar: 7.5 kWh (15.5 - 8.0)
      
      // Total cost without solar = 11.5 * 0.15 = 1.725
      expect(costSavings.totalCostWithoutSolar).toBeCloseTo(1.725, 3);
      
      // Total grid import cost = 4.0 * 0.15 = 0.6
      expect(costSavings.totalGridImportCost).toBeCloseTo(0.6, 3);
      
      // Total grid export credit = 8.0 * 0.08 = 0.64
      expect(costSavings.totalGridExportCredit).toBeCloseTo(0.64, 3);
      
      // Total solar savings = 7.5 * 0.15 = 1.125
      expect(costSavings.totalSolarSavings).toBeCloseTo(1.125, 3);
      
      // Total cost with solar = 0.6 - 0.64 = -0.04 (credit)
      expect(costSavings.totalCostWithSolar).toBeCloseTo(-0.04, 3);
      
      // Total savings = 1.725 - (-0.04) = 1.765
      expect(costSavings.totalSavings).toBeCloseTo(1.765, 3);
      
      // Savings percentage = (1.765 / 1.725) * 100 = 102.32%
      expect(costSavings.savingsPercentage).toBeCloseTo(102.32, 2);
    });
    
    it('should calculate cost savings correctly with custom rates', () => {
      const gridImportRate = 0.20; // $0.20/kWh
      const gridExportRate = 0.05; // $0.05/kWh
      
      const costSavings = calculateCostSavings(testData, gridImportRate, gridExportRate);
      
      // Total cost without solar = 11.5 * 0.20 = 2.3
      expect(costSavings.totalCostWithoutSolar).toBeCloseTo(2.3, 3);
      
      // Total grid import cost = 4.0 * 0.20 = 0.8
      expect(costSavings.totalGridImportCost).toBeCloseTo(0.8, 3);
      
      // Total grid export credit = 8.0 * 0.05 = 0.4
      expect(costSavings.totalGridExportCredit).toBeCloseTo(0.4, 3);
      
      // Total cost with solar = 0.8 - 0.4 = 0.4
      expect(costSavings.totalCostWithSolar).toBeCloseTo(0.4, 3);
      
      // Total savings = 2.3 - 0.4 = 1.9
      expect(costSavings.totalSavings).toBeCloseTo(1.9, 3);
    });
  });
  
  describe('calculateEmissionsReduction', () => {
    it('should calculate emissions reduction correctly with default factor', () => {
      const emissions = calculateEmissionsReduction(testData);
      
      // Total energy demand: 11.5 kWh
      // Total grid import: 4.0 kWh
      
      // Emissions without solar = 11.5 * 0.5 = 5.75 kg CO2
      expect(emissions.emissionsWithoutSolar).toBeCloseTo(5.75, 3);
      
      // Emissions with solar = 4.0 * 0.5 = 2.0 kg CO2
      expect(emissions.emissionsWithSolar).toBeCloseTo(2.0, 3);
      
      // Emissions reduction = 5.75 - 2.0 = 3.75 kg CO2
      expect(emissions.emissionsReduction).toBeCloseTo(3.75, 3);
      
      // Reduction percentage = (3.75 / 5.75) * 100 = 65.22%
      expect(emissions.reductionPercentage).toBeCloseTo(65.22, 2);
      
      // Emissions reduction in tons = 3.75 / 1000 = 0.00375 tons
      expect(emissions.emissionsReductionTons).toBeCloseTo(0.00375, 5);
      
      // Equivalent trees planted = 3.75 / 21.7 ≈ 0.17 trees (rounded to 0)
      expect(emissions.equivalentTreesPlanted).toBe(0);
    });
    
    it('should calculate emissions reduction correctly with custom factor', () => {
      const gridEmissionFactor = 0.8; // 0.8 kg CO2/kWh
      
      const emissions = calculateEmissionsReduction(testData, gridEmissionFactor);
      
      // Emissions without solar = 11.5 * 0.8 = 9.2 kg CO2
      expect(emissions.emissionsWithoutSolar).toBeCloseTo(9.2, 3);
      
      // Emissions with solar = 4.0 * 0.8 = 3.2 kg CO2
      expect(emissions.emissionsWithSolar).toBeCloseTo(3.2, 3);
      
      // Emissions reduction = 9.2 - 3.2 = 6.0 kg CO2
      expect(emissions.emissionsReduction).toBeCloseTo(6.0, 3);
    });
  });
  
  describe('calculateSelfSufficiency', () => {
    it('should calculate self-sufficiency metrics correctly', () => {
      const selfSufficiency = calculateSelfSufficiency(testData);
      
      // Total solar production: 15.5 kWh
      // Total energy demand: 11.5 kWh
      // Total grid import: 4.0 kWh
      // Total excess export: 8.0 kWh
      // Total self-consumed solar: 7.5 kWh (15.5 - 8.0)
      
      expect(selfSufficiency.totalSelfConsumed).toBeCloseTo(7.5, 3);
      
      // Self-sufficiency percentage = (7.5 / 11.5) * 100 = 65.22%
      expect(selfSufficiency.selfSufficiencyPercentage).toBeCloseTo(65.22, 2);
      
      // Self-consumption percentage = (7.5 / 15.5) * 100 = 48.39%
      expect(selfSufficiency.selfConsumptionPercentage).toBeCloseTo(48.39, 2);
      
      // Grid dependency percentage = (4.0 / 11.5) * 100 = 34.78%
      expect(selfSufficiency.gridDependencyPercentage).toBeCloseTo(34.78, 2);
      
      // Hour counts
      expect(selfSufficiency.hoursCounted).toBe(4);
      expect(selfSufficiency.noProductionHours).toBe(1); // Hour with 0 production
      expect(selfSufficiency.gridDependentHours).toBe(1); // Hour with grid import
      expect(selfSufficiency.excessProductionHours).toBe(3); // Hours with excess export
    });
  });
  
  describe('calculateStoragePotential', () => {
    it('should calculate storage potential correctly', () => {
      const storagePotential = calculateStoragePotential(testData);
      
      // Total excess energy: 8.0 kWh
      expect(storagePotential.totalExcessEnergy).toBeCloseTo(8.0, 3);
      
      // Total deficit energy: 4.0 kWh
      expect(storagePotential.totalDeficitEnergy).toBeCloseTo(4.0, 3);
      
      // Current self-sufficiency = (7.5 / 11.5) * 100 = 65.22%
      expect(storagePotential.currentSelfSufficiency).toBeCloseTo(65.22, 2);
      
      // The potential additional self-consumption depends on the daily pattern
      // For our test data, we have excess during day and deficit at night
      // We should be able to store at least some of the excess to cover the deficit
      expect(storagePotential.potentialAdditionalSelfConsumption).toBeGreaterThan(0);
      expect(storagePotential.potentialAdditionalSelfConsumption).toBeLessThanOrEqual(4.0);
      
      // Potential self-sufficiency should be higher than current
      expect(storagePotential.potentialSelfSufficiency).toBeGreaterThan(storagePotential.currentSelfSufficiency);
      
      // Self-sufficiency improvement should be positive
      expect(storagePotential.selfSufficiencyImprovement).toBeGreaterThan(0);
    });
  });
  
  describe('calculatePeakShaving', () => {
    it('should calculate peak shaving metrics correctly with default storage', () => {
      const peakShaving = calculatePeakShaving(testData);
      
      // Our test data has a peak demand of 4.0 kWh in the evening
      expect(peakShaving.totalPeakDemand).toBeGreaterThan(0);
      
      // With storage, peak demand should be reduced
      expect(peakShaving.totalPeakDemandAfterShaving).toBeLessThanOrEqual(peakShaving.totalPeakDemand);
      
      // Peak reduction should be positive
      expect(peakShaving.totalPeakReduction).toBeGreaterThanOrEqual(0);
      
      // Peak reduction percentage should be between 0 and 100
      expect(peakShaving.peakReductionPercentage).toBeGreaterThanOrEqual(0);
      expect(peakShaving.peakReductionPercentage).toBeLessThanOrEqual(100);
      
      // Days analyzed should match our test data
      expect(peakShaving.daysAnalyzed).toBe(2);
    });
    
    it('should calculate peak shaving metrics correctly with custom storage', () => {
      const storageCapacity = 10; // 10 kWh
      const maxDischargeRate = 5; // 5 kW
      
      const peakShaving = calculatePeakShaving(testData, storageCapacity, maxDischargeRate);
      
      // With larger storage, we should be able to reduce peak demand more
      expect(peakShaving.recommendedStorageCapacity).toBe(storageCapacity);
      
      // Peak reduction should be positive
      expect(peakShaving.totalPeakReduction).toBeGreaterThanOrEqual(0);
    });
  });
});
