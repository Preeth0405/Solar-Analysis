import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterPanel } from '../src/components/filter-panel';
import { SummaryCard, PercentageCard, DataSummaryCard } from '../src/components/summary-cards';
import { ProductionVsDemandChart, GridInteractionChart, NetEnergyChart } from '../src/components/charts';
import { AdvancedAnalysis } from '../src/components/advanced-analysis';
import { SolarDataPoint, DataSummary } from '../src/lib/types';
import { calculateDerivedMetrics, calculateSummary } from '../src/lib/utils/data-processing';

describe('UI Components', () => {
  let testData: SolarDataPoint[];
  let summary: DataSummary;
  
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
      }
    ];
    
    // Process data to add derived metrics
    testData = rawData.map(point => calculateDerivedMetrics(point));
    summary = calculateSummary(testData);
  });
  
  describe('SummaryCard', () => {
    it('should render with correct props', () => {
      render(
        <SummaryCard
          title="Test Title"
          value={100}
          description="Test Description"
          color="#FF0000"
          unit="kWh"
          decimals={2}
        />
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('100.00 kWh')).toBeInTheDocument();
    });
  });
  
  describe('PercentageCard', () => {
    it('should render with correct props', () => {
      render(
        <PercentageCard
          title="Test Percentage"
          value={75.5}
          description="Test Description"
          color="#00FF00"
        />
      );
      
      expect(screen.getByText('Test Percentage')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('75.5%')).toBeInTheDocument();
    });
  });
  
  describe('DataSummaryCard', () => {
    it('should render with correct data', () => {
      render(
        <DataSummaryCard
          summary={summary}
          dataPoints={testData.length}
        />
      );
      
      expect(screen.getByText('Data Summary')).toBeInTheDocument();
      expect(screen.getByText('Key metrics from your solar and demand data')).toBeInTheDocument();
      
      // Check for specific metrics
      expect(screen.getByText('Average Daily Production')).toBeInTheDocument();
      expect(screen.getByText('Average Daily Demand')).toBeInTheDocument();
      expect(screen.getByText('Peak Solar Production')).toBeInTheDocument();
      expect(screen.getByText('Peak Energy Demand')).toBeInTheDocument();
      expect(screen.getByText('Net Energy Balance')).toBeInTheDocument();
      expect(screen.getByText('Data Points')).toBeInTheDocument();
      
      // Check for the number of data points
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
  
  describe('FilterPanel', () => {
    it('should call onFilterChange when filters are applied', async () => {
      const mockOnFilterChange = vi.fn();
      
      render(
        <FilterPanel onFilterChange={mockOnFilterChange} />
      );
      
      // Find and click the day type select
      const dayTypeSelect = screen.getByText('Select day type');
      fireEvent.click(dayTypeSelect);
      
      // Wait for the dropdown to appear and select "Weekdays"
      await waitFor(() => {
        const weekdaysOption = screen.getByText('Weekdays');
        fireEvent.click(weekdaysOption);
      });
      
      // Verify that onFilterChange was called
      expect(mockOnFilterChange).toHaveBeenCalled();
      
      // Verify that the filter includes weekdaysOnly: true
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
        weekdaysOnly: true
      }));
    });
    
    it('should reset filters when reset button is clicked', async () => {
      const mockOnFilterChange = vi.fn();
      
      render(
        <FilterPanel onFilterChange={mockOnFilterChange} />
      );
      
      // Find and click the reset button
      const resetButton = screen.getByText('Reset Filters');
      fireEvent.click(resetButton);
      
      // Verify that onFilterChange was called with empty filters
      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });
  });
  
  describe('Chart Components', () => {
    // Note: Full chart testing would require more complex setup with Recharts
    // These are simplified tests to verify basic rendering
    
    it('should render ProductionVsDemandChart with data', () => {
      render(
        <ProductionVsDemandChart data={testData} height={300} />
      );
      
      expect(screen.getByText('Solar Production vs Energy Demand')).toBeInTheDocument();
    });
    
    it('should render GridInteractionChart with data', () => {
      render(
        <GridInteractionChart data={testData} height={300} />
      );
      
      expect(screen.getByText('Grid Import vs Excess Export')).toBeInTheDocument();
    });
    
    it('should render NetEnergyChart with data', () => {
      render(
        <NetEnergyChart data={testData} height={300} />
      );
      
      expect(screen.getByText('Net Energy Balance')).toBeInTheDocument();
    });
  });
  
  describe('AdvancedAnalysis', () => {
    it('should render with tabs for different analyses', () => {
      render(
        <AdvancedAnalysis data={testData} />
      );
      
      // Check for tab headers
      expect(screen.getByText('Cost Savings')).toBeInTheDocument();
      expect(screen.getByText('Emissions')).toBeInTheDocument();
      expect(screen.getByText('Self-Sufficiency')).toBeInTheDocument();
      expect(screen.getByText('Storage Potential')).toBeInTheDocument();
      expect(screen.getByText('Peak Shaving')).toBeInTheDocument();
      
      // Check for content in the default tab (Cost Savings)
      expect(screen.getByText('Cost Savings Analysis')).toBeInTheDocument();
      expect(screen.getByText('Financial benefits of your solar energy system')).toBeInTheDocument();
      expect(screen.getByText('Cost Comparison')).toBeInTheDocument();
      expect(screen.getByText('Savings Breakdown')).toBeInTheDocument();
    });
    
    it('should switch tabs when clicked', async () => {
      render(
        <AdvancedAnalysis data={testData} />
      );
      
      // Click on the Emissions tab
      fireEvent.click(screen.getByText('Emissions'));
      
      // Check that Emissions content is displayed
      await waitFor(() => {
        expect(screen.getByText('Emissions Reduction Analysis')).toBeInTheDocument();
        expect(screen.getByText('Environmental benefits of your solar energy system')).toBeInTheDocument();
      });
      
      // Click on the Self-Sufficiency tab
      fireEvent.click(screen.getByText('Self-Sufficiency'));
      
      // Check that Self-Sufficiency content is displayed
      await waitFor(() => {
        expect(screen.getByText('Energy Self-Sufficiency Analysis')).toBeInTheDocument();
        expect(screen.getByText('How independent your energy usage is from the grid')).toBeInTheDocument();
      });
    });
  });
});
