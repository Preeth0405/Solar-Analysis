// Data types for solar production and demand analysis

export interface SolarDataPoint {
  timestamp: string;
  date: string;
  time: string;
  hour: number;
  day: number;
  month: number;
  monthName: string;
  year: number;
  dayOfWeek: number;
  dayName: string;
  isWeekend: boolean;
  quarter: number;
  weekOfYear: number;
  solarProduction: number;
  energyDemand: number;
  netEnergy?: number;
  gridImport?: number;
  excessExport?: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  monthName: string;
  solarProduction: number;
  energyDemand: number;
  netEnergy: number;
  gridImport: number;
  excessExport: number;
  selfConsumptionPercentage: number;
  gridDependencyPercentage: number;
}

export interface DataSummary {
  totalSolarProduction: number;
  totalEnergyDemand: number;
  totalGridImport: number;
  totalExcessExport: number;
  averageDailySolarProduction: number;
  averageDailyEnergyDemand: number;
  peakSolarProduction: number;
  peakEnergyDemand: number;
  selfConsumptionPercentage: number;
  gridDependencyPercentage: number;
}

export interface HourlyAverage {
  hour: number;
  solarProduction: number;
  energyDemand: number;
  netEnergy: number;
  gridImport: number;
  excessExport: number;
}

export interface DailyData {
  date: string;
  solarProduction: number;
  energyDemand: number;
  netEnergy: number;
  gridImport: number;
  excessExport: number;
}

export interface TimeOfDay {
  morning: number[];
  afternoon: number[];
  evening: number[];
  night: number[];
}

export interface Season {
  winter: number[];
  spring: number[];
  summer: number[];
  fall: number[];
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  months?: number[];
  days?: number[];
  hours?: number[];
  seasons?: string[];
  weekdaysOnly?: boolean;
  weekendsOnly?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface HeatmapData {
  x: string[];
  y: number[];
  z: number[][];
}

export type DataView = 'overview' | 'hourly' | 'daily' | 'monthly' | 'balance';
