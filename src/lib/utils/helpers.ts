import { SolarDataPoint } from '../types';

/**
 * Utility to parse CSV file content
 */
export function parseCSV(content: string): string[][] {
  const lines = content.trim().split('\n');
  return lines.map(line => {
    // Handle quoted values with commas inside them
    const result = [];
    let inQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    result.push(currentValue);
    return result;
  });
}

/**
 * Utility to convert a date object to YYYY-MM-DD format
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Utility to format a number with thousands separators
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Utility to format a percentage value
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
}

/**
 * Utility to get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1] || '';
}

/**
 * Utility to get day name from day of week (0-6, where 0 is Sunday)
 */
export function getDayName(dayOfWeek: number): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dayOfWeek] || '';
}

/**
 * Utility to determine season from month (Northern Hemisphere)
 */
export function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Fall';
  return 'Winter';
}

/**
 * Utility to determine time of day from hour
 */
export function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

/**
 * Utility to download data as CSV
 */
export function downloadCSV(data: SolarDataPoint[], filename: string): void {
  if (data.length === 0) return;
  
  // Get headers from first data point
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header as keyof SolarDataPoint];
        // Handle strings with commas by quoting them
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Utility to download chart as image (disabled for deployment)
 */
export function downloadChart(chartRef: React.RefObject<HTMLElement>, filename: string): void {
  console.log('Chart export functionality disabled in this build');
  // Function does nothing in this build
}


/**
 * Utility to generate color scale for heatmaps
 */
export function generateColorScale(
  min: number, 
  max: number, 
  steps = 10, 
  colorStart = [255, 255, 255], 
  colorEnd = [255, 69, 0]
): string[] {
  const result: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(colorStart[0] + ratio * (colorEnd[0] - colorStart[0]));
    const g = Math.round(colorStart[1] + ratio * (colorEnd[1] - colorStart[1]));
    const b = Math.round(colorStart[2] + ratio * (colorEnd[2] - colorStart[2]));
    
    result.push(`rgb(${r}, ${g}, ${b})`);
  }
  
  return result;
}
