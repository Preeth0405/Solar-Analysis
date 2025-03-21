import { SolarDataPoint, ChartData, HeatmapData } from '../types';

/**
 * Formats data for a line chart comparing solar production and energy demand over time
 */
export function formatProductionVsDemandChart(data: SolarDataPoint[]): ChartData {
  const labels = data.map(point => point.date);
  
  return {
    labels,
    datasets: [
      {
        label: 'Solar Production (kWh)',
        data: data.map(point => point.solarProduction),
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderColor: 'rgba(255, 165, 0, 1)',
        fill: false
      },
      {
        label: 'Energy Demand (kWh)',
        data: data.map(point => point.energyDemand),
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        borderColor: 'rgba(30, 144, 255, 1)',
        fill: false
      }
    ]
  };
}

/**
 * Formats data for a bar chart comparing grid import and excess export
 */
export function formatGridInteractionChart(data: SolarDataPoint[]): ChartData {
  const labels = data.map(point => point.date);
  
  return {
    labels,
    datasets: [
      {
        label: 'Grid Import (kWh)',
        data: data.map(point => point.gridImport || 0),
        backgroundColor: 'rgba(255, 69, 0, 0.7)'
      },
      {
        label: 'Excess Export (kWh)',
        data: data.map(point => point.excessExport || 0),
        backgroundColor: 'rgba(50, 205, 50, 0.7)'
      }
    ]
  };
}

/**
 * Formats data for a line chart showing net energy balance
 */
export function formatNetEnergyChart(data: SolarDataPoint[]): ChartData {
  const labels = data.map(point => point.date);
  
  return {
    labels,
    datasets: [
      {
        label: 'Net Energy (kWh)',
        data: data.map(point => point.netEnergy || 0),
        backgroundColor: 'rgba(147, 112, 219, 0.2)',
        borderColor: 'rgba(147, 112, 219, 1)',
        fill: true
      }
    ]
  };
}

/**
 * Formats data for a heatmap showing hourly solar production patterns
 */
export function formatHourlyProductionHeatmap(data: SolarDataPoint[]): HeatmapData {
  // Group data by month and hour
  const monthlyHourlyData: Record<string, Record<number, number[]>> = {};
  
  data.forEach(point => {
    if (!monthlyHourlyData[point.monthName]) {
      monthlyHourlyData[point.monthName] = {};
    }
    
    if (!monthlyHourlyData[point.monthName][point.hour]) {
      monthlyHourlyData[point.monthName][point.hour] = [];
    }
    
    monthlyHourlyData[point.monthName][point.hour].push(point.solarProduction);
  });
  
  // Calculate average for each month and hour
  const months = Object.keys(monthlyHourlyData);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const zValues: number[][] = [];
  
  hours.forEach(hour => {
    const hourRow: number[] = [];
    
    months.forEach(month => {
      const values = monthlyHourlyData[month][hour] || [];
      const average = values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
      
      hourRow.push(parseFloat(average.toFixed(2)));
    });
    
    zValues.push(hourRow);
  });
  
  return {
    x: months,
    y: hours,
    z: zValues
  };
}

/**
 * Formats data for a heatmap showing hourly energy demand patterns
 */
export function formatHourlyDemandHeatmap(data: SolarDataPoint[]): HeatmapData {
  // Group data by month and hour
  const monthlyHourlyData: Record<string, Record<number, number[]>> = {};
  
  data.forEach(point => {
    if (!monthlyHourlyData[point.monthName]) {
      monthlyHourlyData[point.monthName] = {};
    }
    
    if (!monthlyHourlyData[point.monthName][point.hour]) {
      monthlyHourlyData[point.monthName][point.hour] = [];
    }
    
    monthlyHourlyData[point.monthName][point.hour].push(point.energyDemand);
  });
  
  // Calculate average for each month and hour
  const months = Object.keys(monthlyHourlyData);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const zValues: number[][] = [];
  
  hours.forEach(hour => {
    const hourRow: number[] = [];
    
    months.forEach(month => {
      const values = monthlyHourlyData[month][hour] || [];
      const average = values.length > 0 
        ? values.reduce((sum, val) => sum + val, 0) / values.length 
        : 0;
      
      hourRow.push(parseFloat(average.toFixed(2)));
    });
    
    zValues.push(hourRow);
  });
  
  return {
    x: months,
    y: hours,
    z: zValues
  };
}

/**
 * Formats data for a line chart showing hourly averages
 */
export function formatHourlyAveragesChart(data: SolarDataPoint[]): ChartData {
  // Group data by hour
  const hourlyData: Record<number, { solar: number[], demand: number[] }> = {};
  
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { solar: [], demand: [] };
  }
  
  data.forEach(point => {
    hourlyData[point.hour].solar.push(point.solarProduction);
    hourlyData[point.hour].demand.push(point.energyDemand);
  });
  
  // Calculate averages
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const solarAverages = hours.map(hour => {
    const values = hourlyData[hour].solar;
    return values.length > 0 
      ? values.reduce((sum, val) => sum + val, 0) / values.length 
      : 0;
  });
  
  const demandAverages = hours.map(hour => {
    const values = hourlyData[hour].demand;
    return values.length > 0 
      ? values.reduce((sum, val) => sum + val, 0) / values.length 
      : 0;
  });
  
  return {
    labels: hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Avg Solar Production (kWh)',
        data: solarAverages.map(val => parseFloat(val.toFixed(2))),
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderColor: 'rgba(255, 165, 0, 1)',
        fill: false
      },
      {
        label: 'Avg Energy Demand (kWh)',
        data: demandAverages.map(val => parseFloat(val.toFixed(2))),
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        borderColor: 'rgba(30, 144, 255, 1)',
        fill: false
      }
    ]
  };
}

/**
 * Formats data for a pie chart showing self-consumption vs export
 */
export function formatSelfConsumptionPieChart(data: SolarDataPoint[]): ChartData {
  let totalProduction = 0;
  let totalExport = 0;
  
  data.forEach(point => {
    totalProduction += point.solarProduction;
    totalExport += point.excessExport || 0;
  });
  
  const selfConsumption = totalProduction - totalExport;
  
  return {
    labels: ['Self-Consumed', 'Exported to Grid'],
    datasets: [
      {
        label: 'Energy Distribution (kWh)',
        data: [selfConsumption, totalExport],
        backgroundColor: [
          'rgba(255, 165, 0, 0.7)',
          'rgba(50, 205, 50, 0.7)'
        ]
      }
    ]
  };
}

/**
 * Formats data for a pie chart showing grid import vs self-consumption
 */
export function formatGridDependencyPieChart(data: SolarDataPoint[]): ChartData {
  let totalDemand = 0;
  let totalImport = 0;
  
  data.forEach(point => {
    totalDemand += point.energyDemand;
    totalImport += point.gridImport || 0;
  });
  
  const selfSupplied = totalDemand - totalImport;
  
  return {
    labels: ['Self-Supplied', 'Imported from Grid'],
    datasets: [
      {
        label: 'Energy Source (kWh)',
        data: [selfSupplied, totalImport],
        backgroundColor: [
          'rgba(50, 205, 50, 0.7)',
          'rgba(255, 69, 0, 0.7)'
        ]
      }
    ]
  };
}
