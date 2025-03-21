import { SolarDataPoint, MonthlySummary, DataSummary, HourlyAverage, DailyData } from '../types';

/**
 * Calculates derived metrics for a solar data point
 */
export function calculateDerivedMetrics(dataPoint: SolarDataPoint): SolarDataPoint {
  const netEnergy = dataPoint.solarProduction - dataPoint.energyDemand;
  const gridImport = netEnergy < 0 ? Math.abs(netEnergy) : 0;
  const excessExport = netEnergy > 0 ? netEnergy : 0;

  return {
    ...dataPoint,
    netEnergy,
    gridImport,
    excessExport
  };
}

/**
 * Processes raw CSV data into structured solar data points
 */
export function processRawData(csvData: string): SolarDataPoint[] {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data: SolarDataPoint[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    
    // Map CSV data to our data structure
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
    
    // Calculate derived metrics
    data.push(calculateDerivedMetrics(dataPoint));
  }
  
  return data;
}

/**
 * Aggregates data by day
 */
export function aggregateByDay(data: SolarDataPoint[]): DailyData[] {
  const dailyMap = new Map<string, DailyData>();
  
  data.forEach(point => {
    const date = point.date;
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        solarProduction: 0,
        energyDemand: 0,
        netEnergy: 0,
        gridImport: 0,
        excessExport: 0
      });
    }
    
    const daily = dailyMap.get(date)!;
    daily.solarProduction += point.solarProduction;
    daily.energyDemand += point.energyDemand;
    daily.gridImport += point.gridImport || 0;
    daily.excessExport += point.excessExport || 0;
  });
  
  // Calculate net energy for each day
  const result = Array.from(dailyMap.values());
  result.forEach(day => {
    day.netEnergy = day.solarProduction - day.energyDemand;
  });
  
  // Sort by date
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Aggregates data by month
 */
export function aggregateByMonth(data: SolarDataPoint[]): MonthlySummary[] {
  const monthlyMap = new Map<string, MonthlySummary>();
  
  data.forEach(point => {
    const key = `${point.year}-${point.month}`;
    
    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        year: point.year,
        month: point.month,
        monthName: point.monthName,
        solarProduction: 0,
        energyDemand: 0,
        netEnergy: 0,
        gridImport: 0,
        excessExport: 0,
        selfConsumptionPercentage: 0,
        gridDependencyPercentage: 0
      });
    }
    
    const monthly = monthlyMap.get(key)!;
    monthly.solarProduction += point.solarProduction;
    monthly.energyDemand += point.energyDemand;
    monthly.gridImport += point.gridImport || 0;
    monthly.excessExport += point.excessExport || 0;
  });
  
  // Calculate derived metrics for each month
  const result = Array.from(monthlyMap.values());
  result.forEach(month => {
    month.netEnergy = month.solarProduction - month.energyDemand;
    
    // Calculate percentages
    month.selfConsumptionPercentage = month.solarProduction > 0 
      ? ((month.solarProduction - month.excessExport) / month.solarProduction) * 100 
      : 0;
      
    month.gridDependencyPercentage = month.energyDemand > 0 
      ? (month.gridImport / month.energyDemand) * 100 
      : 0;
  });
  
  // Sort by year and month
  return result.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}

/**
 * Aggregates data by hour of day
 */
export function aggregateByHour(data: SolarDataPoint[]): HourlyAverage[] {
  const hourlyMap = new Map<number, HourlyAverage>();
  const hourCounts = new Map<number, number>();
  
  // Initialize hourly averages
  for (let hour = 0; hour < 24; hour++) {
    hourlyMap.set(hour, {
      hour,
      solarProduction: 0,
      energyDemand: 0,
      netEnergy: 0,
      gridImport: 0,
      excessExport: 0
    });
    hourCounts.set(hour, 0);
  }
  
  // Sum values for each hour
  data.forEach(point => {
    const hour = point.hour;
    const hourData = hourlyMap.get(hour)!;
    const count = hourCounts.get(hour)! + 1;
    
    hourData.solarProduction += point.solarProduction;
    hourData.energyDemand += point.energyDemand;
    hourData.gridImport += point.gridImport || 0;
    hourData.excessExport += point.excessExport || 0;
    
    hourCounts.set(hour, count);
  });
  
  // Calculate averages
  const result = Array.from(hourlyMap.values());
  result.forEach(hourData => {
    const count = hourCounts.get(hourData.hour) || 1;
    
    hourData.solarProduction /= count;
    hourData.energyDemand /= count;
    hourData.gridImport /= count;
    hourData.excessExport /= count;
    hourData.netEnergy = hourData.solarProduction - hourData.energyDemand;
  });
  
  return result;
}

/**
 * Calculates overall data summary
 */
export function calculateSummary(data: SolarDataPoint[]): DataSummary {
  let totalSolarProduction = 0;
  let totalEnergyDemand = 0;
  let totalGridImport = 0;
  let totalExcessExport = 0;
  let peakSolarProduction = 0;
  let peakEnergyDemand = 0;
  
  data.forEach(point => {
    totalSolarProduction += point.solarProduction;
    totalEnergyDemand += point.energyDemand;
    totalGridImport += point.gridImport || 0;
    totalExcessExport += point.excessExport || 0;
    
    peakSolarProduction = Math.max(peakSolarProduction, point.solarProduction);
    peakEnergyDemand = Math.max(peakEnergyDemand, point.energyDemand);
  });
  
  // Get unique dates to calculate daily averages
  const uniqueDates = new Set(data.map(point => point.date));
  const dayCount = uniqueDates.size || 1;
  
  const selfConsumptionPercentage = totalSolarProduction > 0 
    ? ((totalSolarProduction - totalExcessExport) / totalSolarProduction) * 100 
    : 0;
    
  const gridDependencyPercentage = totalEnergyDemand > 0 
    ? (totalGridImport / totalEnergyDemand) * 100 
    : 0;
  
  return {
    totalSolarProduction,
    totalEnergyDemand,
    totalGridImport,
    totalExcessExport,
    averageDailySolarProduction: totalSolarProduction / dayCount,
    averageDailyEnergyDemand: totalEnergyDemand / dayCount,
    peakSolarProduction,
    peakEnergyDemand,
    selfConsumptionPercentage,
    gridDependencyPercentage
  };
}

/**
 * Generates sample data for demonstration
 */
export function generateSampleData(): SolarDataPoint[] {
  const data: SolarDataPoint[] = [];
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  
  // Generate data for 7 days (168 hours) as a sample
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const month = currentDate.getMonth() + 1; // 1-12
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1];
    
    for (let hour = 0; hour < 24; hour++) {
      // Solar production follows a bell curve during daylight hours
      let solarProduction = 0;
      if (hour >= 6 && hour <= 18) {
        solarProduction = Math.max(0, 5 * (1 - ((hour - 12) / 6) ** 2));
      }
      
      // Add some seasonal variation (assuming January)
      solarProduction *= 0.6; // Winter factor
      
      // Add some random variation
      solarProduction *= (0.8 + Math.random() * 0.4);
      
      // Energy demand pattern
      let energyDemand = 0;
      if (hour >= 6 && hour <= 9) { // Morning peak
        energyDemand = 2 + (hour - 6) * 0.5;
      } else if (hour >= 17 && hour <= 21) { // Evening peak
        energyDemand = 2 + (21 - hour) * 0.5;
      } else if (hour >= 22 || hour <= 5) { // Night (low demand)
        energyDemand = 0.8;
      } else { // Midday
        energyDemand = 1.5;
      }
      
      // Weekend vs weekday variation
      if (isWeekend) {
        energyDemand *= 1.2; // Higher home energy use on weekends
      }
      
      // Add some random variation
      energyDemand *= (0.9 + Math.random() * 0.2);
      
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const timestamp = `${dateStr}T${timeStr}:00`;
      
      const dataPoint: SolarDataPoint = {
        timestamp,
        date: dateStr,
        time: timeStr,
        hour,
        day: currentDate.getDate(),
        month,
        monthName,
        year: currentDate.getFullYear(),
        dayOfWeek,
        dayName,
        isWeekend,
        quarter: Math.floor((month - 1) / 3) + 1,
        weekOfYear: Math.ceil((day + 1) / 7),
        solarProduction: parseFloat(solarProduction.toFixed(2)),
        energyDemand: parseFloat(energyDemand.toFixed(2)),
      };
      
      data.push(calculateDerivedMetrics(dataPoint));
    }
  }
  
  return data;
}

/**
 * Filters data based on filter options
 */
export function filterData(data: SolarDataPoint[], filters: {
  startDate?: string;
  endDate?: string;
  months?: number[];
  hours?: number[];
  weekdaysOnly?: boolean;
  weekendsOnly?: boolean;
}): SolarDataPoint[] {
  return data.filter(point => {
    // Date range filter
    if (filters.startDate && point.date < filters.startDate) return false;
    if (filters.endDate && point.date > filters.endDate) return false;
    
    // Month filter
    if (filters.months && filters.months.length > 0 && !filters.months.includes(point.month)) return false;
    
    // Hour filter
    if (filters.hours && filters.hours.length > 0 && !filters.hours.includes(point.hour)) return false;
    
    // Weekday/weekend filter
    if (filters.weekdaysOnly && point.isWeekend) return false;
    if (filters.weekendsOnly && !point.isWeekend) return false;
    
    return true;
  });
}
