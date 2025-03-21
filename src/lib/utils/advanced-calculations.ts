import { SolarDataPoint, DataSummary } from '../types';

/**
 * Calculates energy cost savings based on solar production and grid rates
 * @param data Array of solar data points
 * @param gridImportRate Cost per kWh for importing from grid
 * @param gridExportRate Credit per kWh for exporting to grid
 * @returns Object containing cost savings information
 */
export function calculateCostSavings(
  data: SolarDataPoint[],
  gridImportRate: number = 0.15, // Default import rate: $0.15/kWh
  gridExportRate: number = 0.08  // Default export rate: $0.08/kWh
) {
  let totalGridImportCost = 0;
  let totalGridExportCredit = 0;
  let totalSolarSavings = 0;
  let totalCostWithoutSolar = 0;
  let totalCostWithSolar = 0;
  
  data.forEach(point => {
    // Calculate what the cost would be without solar (all demand from grid)
    const costWithoutSolar = point.energyDemand * gridImportRate;
    totalCostWithoutSolar += costWithoutSolar;
    
    // Calculate grid import cost
    const gridImportCost = (point.gridImport || 0) * gridImportRate;
    totalGridImportCost += gridImportCost;
    
    // Calculate grid export credit
    const gridExportCredit = (point.excessExport || 0) * gridExportRate;
    totalGridExportCredit += gridExportCredit;
    
    // Calculate solar savings (avoided grid import)
    const selfConsumedSolar = point.solarProduction - (point.excessExport || 0);
    const solarSavings = selfConsumedSolar * gridImportRate;
    totalSolarSavings += solarSavings;
    
    // Calculate net cost with solar
    const costWithSolar = gridImportCost - gridExportCredit;
    totalCostWithSolar += costWithSolar;
  });
  
  // Calculate total savings
  const totalSavings = totalCostWithoutSolar - totalCostWithSolar;
  
  // Calculate savings percentage
  const savingsPercentage = totalCostWithoutSolar > 0 
    ? (totalSavings / totalCostWithoutSolar) * 100 
    : 0;
  
  return {
    totalGridImportCost,
    totalGridExportCredit,
    totalSolarSavings,
    totalCostWithoutSolar,
    totalCostWithSolar,
    totalSavings,
    savingsPercentage
  };
}

/**
 * Calculates carbon emissions reduction based on solar production
 * @param data Array of solar data points
 * @param gridEmissionFactor Carbon emissions per kWh from grid (kg CO2/kWh)
 * @returns Object containing emissions reduction information
 */
export function calculateEmissionsReduction(
  data: SolarDataPoint[],
  gridEmissionFactor: number = 0.5 // Default: 0.5 kg CO2/kWh
) {
  let totalSelfConsumedSolar = 0;
  let totalGridImport = 0;
  let totalEnergyDemand = 0;
  
  data.forEach(point => {
    // Calculate self-consumed solar
    const selfConsumedSolar = point.solarProduction - (point.excessExport || 0);
    totalSelfConsumedSolar += selfConsumedSolar;
    
    // Track grid import and total demand
    totalGridImport += (point.gridImport || 0);
    totalEnergyDemand += point.energyDemand;
  });
  
  // Calculate emissions without solar (all from grid)
  const emissionsWithoutSolar = totalEnergyDemand * gridEmissionFactor;
  
  // Calculate emissions with solar (only grid import produces emissions)
  const emissionsWithSolar = totalGridImport * gridEmissionFactor;
  
  // Calculate emissions reduction
  const emissionsReduction = emissionsWithoutSolar - emissionsWithSolar;
  
  // Calculate reduction percentage
  const reductionPercentage = emissionsWithoutSolar > 0 
    ? (emissionsReduction / emissionsWithoutSolar) * 100 
    : 0;
  
  return {
    emissionsWithoutSolar,
    emissionsWithSolar,
    emissionsReduction,
    reductionPercentage,
    // Convert to common units for better understanding
    emissionsReductionTons: emissionsReduction / 1000, // Convert kg to metric tons
    equivalentTreesPlanted: Math.round(emissionsReduction / 21.7) // Approx. 21.7 kg CO2 per tree per year
  };
}

/**
 * Calculates energy self-sufficiency metrics
 * @param data Array of solar data points
 * @returns Object containing self-sufficiency metrics
 */
export function calculateSelfSufficiency(data: SolarDataPoint[]) {
  let totalSolarProduction = 0;
  let totalEnergyDemand = 0;
  let totalGridImport = 0;
  let totalExcessExport = 0;
  let totalSelfConsumed = 0;
  
  // Hours with complete self-sufficiency (no grid import)
  let selfSufficientHours = 0;
  
  // Hours with excess production
  let excessProductionHours = 0;
  
  // Hours with grid dependency
  let gridDependentHours = 0;
  
  // Hours with no solar production
  let noProductionHours = 0;
  
  data.forEach(point => {
    totalSolarProduction += point.solarProduction;
    totalEnergyDemand += point.energyDemand;
    totalGridImport += (point.gridImport || 0);
    totalExcessExport += (point.excessExport || 0);
    
    // Calculate self-consumed solar
    const selfConsumed = point.solarProduction - (point.excessExport || 0);
    totalSelfConsumed += selfConsumed;
    
    // Categorize hours
    if (point.solarProduction === 0) {
      noProductionHours++;
    } else if ((point.gridImport || 0) === 0 && (point.excessExport || 0) === 0) {
      selfSufficientHours++; // Perfect match between production and demand
    } else if ((point.excessExport || 0) > 0) {
      excessProductionHours++;
    } else if ((point.gridImport || 0) > 0) {
      gridDependentHours++;
    }
  });
  
  // Calculate self-sufficiency percentage
  const selfSufficiencyPercentage = totalEnergyDemand > 0 
    ? (totalSelfConsumed / totalEnergyDemand) * 100 
    : 0;
  
  // Calculate self-consumption percentage
  const selfConsumptionPercentage = totalSolarProduction > 0 
    ? (totalSelfConsumed / totalSolarProduction) * 100 
    : 0;
  
  // Calculate grid dependency percentage
  const gridDependencyPercentage = totalEnergyDemand > 0 
    ? (totalGridImport / totalEnergyDemand) * 100 
    : 0;
  
  return {
    totalSelfConsumed,
    selfSufficiencyPercentage,
    selfConsumptionPercentage,
    gridDependencyPercentage,
    selfSufficientHours,
    excessProductionHours,
    gridDependentHours,
    noProductionHours,
    hoursCounted: data.length
  };
}

/**
 * Calculates energy storage potential to increase self-consumption
 * @param data Array of solar data points
 * @returns Object containing storage potential metrics
 */
export function calculateStoragePotential(data: SolarDataPoint[]) {
  // Group data by day
  const dailyData: Record<string, SolarDataPoint[]> = {};
  
  data.forEach(point => {
    if (!dailyData[point.date]) {
      dailyData[point.date] = [];
    }
    
    dailyData[point.date].push(point);
  });
  
  let totalExcessEnergy = 0;
  let totalDeficitEnergy = 0;
  let potentialAdditionalSelfConsumption = 0;
  let optimalStorageCapacity = 0;
  
  // Analyze each day
  Object.values(dailyData).forEach(dayPoints => {
    let dailyExcess = 0;
    let dailyDeficit = 0;
    let dailyStorageLevel = 0;
    let dailyAdditionalSelfConsumption = 0;
    let maxStorageNeeded = 0;
    
    // Sort by hour to ensure chronological order
    dayPoints.sort((a, b) => a.hour - b.hour);
    
    // Simulate storage throughout the day
    dayPoints.forEach(point => {
      const excess = (point.excessExport || 0);
      const deficit = (point.gridImport || 0);
      
      dailyExcess += excess;
      dailyDeficit += deficit;
      
      if (excess > 0) {
        // Charge storage with excess energy
        dailyStorageLevel += excess;
      } else if (deficit > 0 && dailyStorageLevel > 0) {
        // Discharge storage to cover deficit
        const energyFromStorage = Math.min(dailyStorageLevel, deficit);
        dailyStorageLevel -= energyFromStorage;
        dailyAdditionalSelfConsumption += energyFromStorage;
      }
      
      // Track maximum storage level needed
      maxStorageNeeded = Math.max(maxStorageNeeded, dailyStorageLevel);
    });
    
    totalExcessEnergy += dailyExcess;
    totalDeficitEnergy += dailyDeficit;
    potentialAdditionalSelfConsumption += dailyAdditionalSelfConsumption;
    
    // Update optimal storage capacity based on this day
    optimalStorageCapacity = Math.max(optimalStorageCapacity, maxStorageNeeded);
  });
  
  // Calculate potential improvement in self-sufficiency
  const totalEnergyDemand = data.reduce((sum, point) => sum + point.energyDemand, 0);
  const currentSelfConsumed = data.reduce((sum, point) => {
    const selfConsumed = point.solarProduction - (point.excessExport || 0);
    return sum + selfConsumed;
  }, 0);
  
  const currentSelfSufficiency = totalEnergyDemand > 0 
    ? (currentSelfConsumed / totalEnergyDemand) * 100 
    : 0;
    
  const potentialSelfSufficiency = totalEnergyDemand > 0 
    ? ((currentSelfConsumed + potentialAdditionalSelfConsumption) / totalEnergyDemand) * 100 
    : 0;
    
  const selfSufficiencyImprovement = potentialSelfSufficiency - currentSelfSufficiency;
  
  return {
    totalExcessEnergy,
    totalDeficitEnergy,
    potentialAdditionalSelfConsumption,
    optimalStorageCapacity,
    currentSelfSufficiency,
    potentialSelfSufficiency,
    selfSufficiencyImprovement,
    storageUtilizationRate: totalExcessEnergy > 0 
      ? (potentialAdditionalSelfConsumption / totalExcessEnergy) * 100 
      : 0
  };
}

/**
 * Calculates peak shaving potential using energy storage
 * @param data Array of solar data points
 * @param storageCapacity Storage capacity in kWh
 * @param maxDischargeRate Maximum discharge rate in kW
 * @returns Object containing peak shaving metrics
 */
export function calculatePeakShaving(
  data: SolarDataPoint[],
  storageCapacity: number = 5, // Default: 5 kWh storage
  maxDischargeRate: number = 2  // Default: 2 kW max discharge
) {
  // Group data by day
  const dailyData: Record<string, SolarDataPoint[]> = {};
  
  data.forEach(point => {
    if (!dailyData[point.date]) {
      dailyData[point.date] = [];
    }
    
    dailyData[point.date].push(point);
  });
  
  let totalPeakDemand = 0;
  let totalPeakDemandAfterShaving = 0;
  let totalPeakReduction = 0;
  
  // Analyze each day
  Object.values(dailyData).forEach(dayPoints => {
    // Sort by hour to ensure chronological order
    dayPoints.sort((a, b) => a.hour - b.hour);
    
    // Find peak demand hour
    const peakDemandPoint = [...dayPoints].sort((a, b) => b.energyDemand - a.energyDemand)[0];
    const peakDemand = peakDemandPoint.energyDemand;
    totalPeakDemand += peakDemand;
    
    // Simulate storage for peak shaving
    let storageLevel = storageCapacity; // Start with full storage
    const modifiedDemand = [...dayPoints].map(point => {
      let modifiedPoint = { ...point };
      
      // If this is a high demand point and we have storage available
      if (point.energyDemand > (peakDemand * 0.7) && storageLevel > 0) {
        // Calculate how much we can discharge
        const dischargeNeeded = Math.min(
          point.energyDemand - (point.solarProduction - (point.excessExport || 0)),
          maxDischargeRate,
          storageLevel
        );
        
        if (dischargeNeeded > 0) {
          storageLevel -= dischargeNeeded;
          modifiedPoint.gridImport = Math.max(0, (point.gridImport || 0) - dischargeNeeded);
        }
      }
      
      return modifiedPoint;
    });
    
    // Find new peak demand after shaving
    const peakDemandAfterShaving = Math.max(...modifiedDemand.map(p => (p.gridImport || 0)));
    totalPeakDemandAfterShaving += peakDemandAfterShaving;
    
    // Calculate peak reduction
    const peakReduction = peakDemand - peakDemandAfterShaving;
    totalPeakReduction += peakReduction;
  });
  
  // Calculate average peak reduction percentage
  const peakReductionPercentage = totalPeakDemand > 0 
    ? (totalPeakReduction / totalPeakDemand) * 100 
    : 0;
  
  return {
    totalPeakDemand,
    totalPeakDemandAfterShaving,
    totalPeakReduction,
    peakReductionPercentage,
    recommendedStorageCapacity: storageCapacity,
    daysAnalyzed: Object.keys(dailyData).length
  };
}

/**
 * Calculates comprehensive energy metrics for the dashboard
 * @param data Array of solar data points
 * @returns Object containing all calculated metrics
 */
export function calculateAllMetrics(data: SolarDataPoint[]) {
  const summary = {
    basic: calculateSummary(data),
    costSavings: calculateCostSavings(data),
    emissions: calculateEmissionsReduction(data),
    selfSufficiency: calculateSelfSufficiency(data),
    storagePotential: calculateStoragePotential(data),
    peakShaving: calculatePeakShaving(data)
  };
  
  return summary;
}
