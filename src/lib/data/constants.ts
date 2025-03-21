import { SolarDataPoint } from '../types';

/**
 * Sample data for the solar analysis web application
 * This provides a week of hourly data for demonstration purposes
 */
export const sampleData: SolarDataPoint[] = [
  // This will be populated by the generateSampleData function
];

/**
 * Default color scheme for the application
 */
export const colorScheme = {
  solarProduction: '#FFA500', // Orange
  energyDemand: '#1E90FF',    // Blue
  gridImport: '#FF4500',      // Red
  excessExport: '#32CD32',    // Green
  netEnergy: '#9370DB',       // Purple
  background: '#FFFFFF',      // White
  text: '#333333',            // Dark gray
};

/**
 * Time period options for filtering
 */
export const timePeriodOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];

/**
 * Month options for filtering
 */
export const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

/**
 * Season options for filtering
 */
export const seasonOptions = [
  { label: 'Winter', value: 'winter', months: [12, 1, 2] },
  { label: 'Spring', value: 'spring', months: [3, 4, 5] },
  { label: 'Summer', value: 'summer', months: [6, 7, 8] },
  { label: 'Fall', value: 'fall', months: [9, 10, 11] },
];

/**
 * Day type options for filtering
 */
export const dayTypeOptions = [
  { label: 'All Days', value: 'all' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekends', value: 'weekends' },
];

/**
 * Hour range options for filtering
 */
export const hourRangeOptions = [
  { label: 'All Hours', value: 'all', hours: Array.from({ length: 24 }, (_, i) => i) },
  { label: 'Daytime (6am-6pm)', value: 'daytime', hours: Array.from({ length: 13 }, (_, i) => i + 6) },
  { label: 'Nighttime (6pm-6am)', value: 'nighttime', hours: [...Array.from({ length: 6 }, (_, i) => i + 18), ...Array.from({ length: 6 }, (_, i) => i)] },
  { label: 'Morning (5am-12pm)', value: 'morning', hours: Array.from({ length: 7 }, (_, i) => i + 5) },
  { label: 'Afternoon (12pm-5pm)', value: 'afternoon', hours: Array.from({ length: 5 }, (_, i) => i + 12) },
  { label: 'Evening (5pm-9pm)', value: 'evening', hours: Array.from({ length: 4 }, (_, i) => i + 17) },
  { label: 'Night (9pm-5am)', value: 'night', hours: [...Array.from({ length: 3 }, (_, i) => i + 21), ...Array.from({ length: 5 }, (_, i) => i)] },
];

/**
 * View options for the dashboard
 */
export const viewOptions = [
  { label: 'Overview', value: 'overview' },
  { label: 'Hourly Analysis', value: 'hourly' },
  { label: 'Daily Analysis', value: 'daily' },
  { label: 'Monthly Analysis', value: 'monthly' },
  { label: 'Energy Balance', value: 'balance' },
];

/**
 * Chart type options
 */
export const chartTypeOptions = [
  { label: 'Line Chart', value: 'line' },
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Area Chart', value: 'area' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Heatmap', value: 'heatmap' },
];

/**
 * Default chart settings
 */
export const defaultChartSettings = {
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  animation: true,
  responsive: true,
};
