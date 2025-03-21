import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateDerivedMetrics, 
  calculateSummary, 
  filterData, 
  aggregateByDay, 
  aggregateByMonth, 
  aggregateByHour 
} from '../src/lib/utils/data-processing';
import { SolarDataPoint } from '../src/lib/types';

describe('Data Processing Utilities', () => {
  let testData: SolarDataPoint[];
  
  beforeEach(() => {
    // Create test data with known values
    testData = [
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
  });
  
  describe('calculateDerivedMetrics', () => {
    it('should calculate net energy correctly', () => {
      const result = calculateDerivedMetrics(testData[0]);
      expect(result.netEnergy).toBe(3.0); // 5.0 - 2.0 = 3.0
    });
    
    it('should calculate grid import correctly when demand exceeds production', () => {
      const result = calculateDerivedMetrics(testData[2]);
      expect(result.gridImport).toBe(4.0); // 0.0 - 4.0 = -4.0, so gridImport = 4.0
    });
    
    it('should calculate excess export correctly when production exceeds demand', () => {
      const result = calculateDerivedMetrics(testData[0]);
      expect(result.excessExport).toBe(3.0); // 5.0 - 2.0 = 3.0, so excessExport = 3.0
    });
    
    it('should handle zero values correctly', () => {
      const zeroPoint: SolarDataPoint = {
        ...testData[0],
        solarProduction: 0,
        energyDemand: 0
      };
      const result = calculateDerivedMetrics(zeroPoint);
      expect(result.netEnergy).toBe(0);
      expect(result.gridImport).toBe(0);
      expect(result.excessExport).toBe(0);
    });
  });
  
  describe('calculateSummary', () => {
    it('should calculate total solar production correctly', () => {
      // Process data to add derived metrics
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      expect(summary.totalSolarProduction).toBe(15.5); // 5.0 + 6.0 + 0.0 + 4.5 = 15.5
    });
    
    it('should calculate total energy demand correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      expect(summary.totalEnergyDemand).toBe(11.5); // 2.0 + 3.0 + 4.0 + 2.5 = 11.5
    });
    
    it('should calculate total grid import correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      expect(summary.totalGridImport).toBe(4.0); // Only the third point has grid import of 4.0
    });
    
    it('should calculate total excess export correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      expect(summary.totalExcessExport).toBe(8.0); // 3.0 + 3.0 + 0.0 + 2.0 = 8.0
    });
    
    it('should calculate self-consumption percentage correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      // Self-consumption = (totalSolarProduction - totalExcessExport) / totalSolarProduction * 100
      // = (15.5 - 8.0) / 15.5 * 100 = 48.39%
      expect(summary.selfConsumptionPercentage).toBeCloseTo(48.39, 1);
    });
    
    it('should calculate grid dependency percentage correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const summary = calculateSummary(processedData);
      // Grid dependency = totalGridImport / totalEnergyDemand * 100
      // = 4.0 / 11.5 * 100 = 34.78%
      expect(summary.gridDependencyPercentage).toBeCloseTo(34.78, 1);
    });
  });
  
  describe('filterData', () => {
    it('should filter by date range correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const filtered = filterData(processedData, { startDate: '2025-01-02' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].date).toBe('2025-01-02');
    });
    
    it('should filter by hour correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const filtered = filterData(processedData, { hours: [10] });
      expect(filtered.length).toBe(2);
      expect(filtered[0].hour).toBe(10);
      expect(filtered[1].hour).toBe(10);
    });
    
    it('should filter by weekday/weekend correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const filtered = filterData(processedData, { weekdaysOnly: true });
      expect(filtered.length).toBe(4); // All test data is on weekdays
      
      const weekendPoint: SolarDataPoint = {
        ...testData[0],
        date: '2025-01-04',
        dayOfWeek: 6,
        dayName: 'Saturday',
        isWeekend: true
      };
      const dataWithWeekend = [...processedData, calculateDerivedMetrics(weekendPoint)];
      
      const filteredWeekdays = filterData(dataWithWeekend, { weekdaysOnly: true });
      expect(filteredWeekdays.length).toBe(4);
      
      const filteredWeekends = filterData(dataWithWeekend, { weekendsOnly: true });
      expect(filteredWeekends.length).toBe(1);
      expect(filteredWeekends[0].isWeekend).toBe(true);
    });
  });
  
  describe('aggregateByDay', () => {
    it('should aggregate data by day correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const dailyData = aggregateByDay(processedData);
      
      expect(dailyData.length).toBe(2); // Two unique dates
      
      // First day: 2025-01-01 with 3 data points
      expect(dailyData[0].date).toBe('2025-01-01');
      expect(dailyData[0].solarProduction).toBe(11.0); // 5.0 + 6.0 + 0.0 = 11.0
      expect(dailyData[0].energyDemand).toBe(9.0); // 2.0 + 3.0 + 4.0 = 9.0
      expect(dailyData[0].gridImport).toBe(4.0); // Only the third point has grid import of 4.0
      expect(dailyData[0].excessExport).toBe(6.0); // 3.0 + 3.0 + 0.0 = 6.0
      
      // Second day: 2025-01-02 with 1 data point
      expect(dailyData[1].date).toBe('2025-01-02');
      expect(dailyData[1].solarProduction).toBe(4.5);
      expect(dailyData[1].energyDemand).toBe(2.5);
    });
  });
  
  describe('aggregateByMonth', () => {
    it('should aggregate data by month correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const monthlyData = aggregateByMonth(processedData);
      
      expect(monthlyData.length).toBe(1); // One unique month (January 2025)
      expect(monthlyData[0].year).toBe(2025);
      expect(monthlyData[0].month).toBe(1);
      expect(monthlyData[0].monthName).toBe('January');
      expect(monthlyData[0].solarProduction).toBe(15.5); // 5.0 + 6.0 + 0.0 + 4.5 = 15.5
      expect(monthlyData[0].energyDemand).toBe(11.5); // 2.0 + 3.0 + 4.0 + 2.5 = 11.5
      expect(monthlyData[0].gridImport).toBe(4.0);
      expect(monthlyData[0].excessExport).toBe(8.0);
      
      // Self-consumption percentage = (totalSolarProduction - totalExcessExport) / totalSolarProduction * 100
      // = (15.5 - 8.0) / 15.5 * 100 = 48.39%
      expect(monthlyData[0].selfConsumptionPercentage).toBeCloseTo(48.39, 1);
      
      // Grid dependency percentage = totalGridImport / totalEnergyDemand * 100
      // = 4.0 / 11.5 * 100 = 34.78%
      expect(monthlyData[0].gridDependencyPercentage).toBeCloseTo(34.78, 1);
    });
  });
  
  describe('aggregateByHour', () => {
    it('should aggregate data by hour correctly', () => {
      const processedData = testData.map(point => calculateDerivedMetrics(point));
      const hourlyData = aggregateByHour(processedData);
      
      expect(hourlyData.length).toBe(24); // 24 hours in a day
      
      // Hour 10 has two data points
      const hour10 = hourlyData.find(h => h.hour === 10);
      expect(hour10).toBeDefined();
      expect(hour10!.solarProduction).toBeCloseTo(4.75, 2); // Average of 5.0 and 4.5
      expect(hour10!.energyDemand).toBeCloseTo(2.25, 2); // Average of 2.0 and 2.5
      
      // Hour 11 has one data point
      const hour11 = hourlyData.find(h => h.hour === 11);
      expect(hour11).toBeDefined();
      expect(hour11!.solarProduction).toBe(6.0);
      expect(hour11!.energyDemand).toBe(3.0);
      
      // Hour 20 has one data point
      const hour20 = hourlyData.find(h => h.hour === 20);
      expect(hour20).toBeDefined();
      expect(hour20!.solarProduction).toBe(0.0);
      expect(hour20!.energyDemand).toBe(4.0);
      
      // Other hours should have zero values
      const hour0 = hourlyData.find(h => h.hour === 0);
      expect(hour0).toBeDefined();
      expect(hour0!.solarProduction).toBe(0);
      expect(hour0!.energyDemand).toBe(0);
    });
  });
});
