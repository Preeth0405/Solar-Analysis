import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalculationEngine from '../src/app/page';
import { SolarDataPoint } from '../src/lib/types';
import { generateSampleData } from '../src/lib/utils/data-processing';

// Mock the chart components to avoid Recharts rendering issues in tests
vi.mock('../src/components/charts', () => ({
  ProductionVsDemandChart: () => <div data-testid="production-vs-demand-chart">Chart Mock</div>,
  GridInteractionChart: () => <div data-testid="grid-interaction-chart">Chart Mock</div>,
  NetEnergyChart: () => <div data-testid="net-energy-chart">Chart Mock</div>,
  HourlyAveragesChart: () => <div data-testid="hourly-averages-chart">Chart Mock</div>,
  DailyTotalsChart: () => <div data-testid="daily-totals-chart">Chart Mock</div>
}));

// Mock the advanced analysis component
vi.mock('../src/components/advanced-analysis', () => ({
  AdvancedAnalysis: () => <div data-testid="advanced-analysis">Advanced Analysis Mock</div>
}));

describe('CalculationEngine Component', () => {
  beforeEach(() => {
    // Mock the file reader API
    global.FileReader = class {
      onload: any;
      readAsText(file: Blob) {
        // Simulate reading a CSV file with sample data
        const csvContent = `Timestamp,Date,Time,Hour,Day,Month,Month_Name,Year,Day_of_Week,Day_Name,Is_Weekend,Quarter,Week_of_Year,Solar_Production_kWh,Energy_Demand_kWh
2025-01-01T10:00:00,2025-01-01,10:00,10,1,1,January,2025,3,Wednesday,0,1,1,5.0,2.0
2025-01-01T11:00:00,2025-01-01,11:00,11,1,1,January,2025,3,Wednesday,0,1,1,6.0,3.0`;
        
        setTimeout(() => {
          this.onload({ target: { result: csvContent } });
        }, 0);
      }
    } as any;
  });

  it('should render initial state with no data', () => {
    render(<CalculationEngine />);
    
    // Check for initial state elements
    expect(screen.getByText('Solar Production and Demand Analysis')).toBeInTheDocument();
    expect(screen.getByText('Load Sample Data')).toBeInTheDocument();
    expect(screen.getByText('Upload Your Data')).toBeInTheDocument();
    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });

  it('should load sample data when button is clicked', async () => {
    // Mock the generateSampleData function to return a known dataset
    vi.mock('../src/lib/utils/data-processing', async () => {
      const actual = await vi.importActual('../src/lib/utils/data-processing');
      return {
        ...actual,
        generateSampleData: () => {
          return [
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
              netEnergy: 3.0,
              gridImport: 0,
              excessExport: 3.0
            }
          ] as SolarDataPoint[];
        }
      };
    });

    render(<CalculationEngine />);
    
    // Click the load sample data button
    const loadButton = screen.getByText('Load Sample Data');
    fireEvent.click(loadButton);
    
    // Wait for data to be loaded and UI to update
    await waitFor(() => {
      // Check that the no data message is no longer displayed
      expect(screen.queryByText('No Data Available')).not.toBeInTheDocument();
      
      // Check that analysis tabs are displayed
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Hourly Analysis')).toBeInTheDocument();
      expect(screen.getByText('Daily Analysis')).toBeInTheDocument();
      expect(screen.getByText('Monthly Analysis')).toBeInTheDocument();
      expect(screen.getByText('Energy Balance')).toBeInTheDocument();
    });
  });

  it('should handle file upload', async () => {
    render(<CalculationEngine />);
    
    // Get the hidden file input
    const fileInput = screen.getByTestId('file-upload');
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    
    // Simulate file upload
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for data to be loaded and UI to update
    await waitFor(() => {
      // Check that the no data message is no longer displayed
      expect(screen.queryByText('No Data Available')).not.toBeInTheDocument();
      
      // Check that analysis tabs are displayed
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  it('should switch between analysis views', async () => {
    // Mock the generateSampleData function
    vi.mock('../src/lib/utils/data-processing', async () => {
      const actual = await vi.importActual('../src/lib/utils/data-processing');
      return {
        ...actual,
        generateSampleData: () => {
          return [
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
              netEnergy: 3.0,
              gridImport: 0,
              excessExport: 3.0
            }
          ] as SolarDataPoint[];
        }
      };
    });

    render(<CalculationEngine />);
    
    // Click the load sample data button
    const loadButton = screen.getByText('Load Sample Data');
    fireEvent.click(loadButton);
    
    // Wait for data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
    
    // Click on the Hourly Analysis tab
    fireEvent.click(screen.getByText('Hourly Analysis'));
    
    // Check that hourly analysis content is displayed
    await waitFor(() => {
      expect(screen.getByText('Hourly Energy Analysis')).toBeInTheDocument();
    });
    
    // Click on the Daily Analysis tab
    fireEvent.click(screen.getByText('Daily Analysis'));
    
    // Check that daily analysis content is displayed
    await waitFor(() => {
      expect(screen.getByText('Daily Energy Analysis')).toBeInTheDocument();
    });
  });

  it('should allow exporting data', async () => {
    // Mock URL.createObjectURL and document.createElement
    const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
    const mockCreateElement = document.createElement.bind(document);
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    
    // Mock click function for the download link
    const mockClick = vi.fn();
    
    // Override global functions
    global.URL.createObjectURL = mockCreateObjectURL;
    document.createElement = (tag) => {
      const element = mockCreateElement(tag);
      if (tag === 'a') {
        element.click = mockClick;
      }
      return element;
    };
    document.body.appendChild = mockAppendChild;
    document.body.removeChild = mockRemoveChild;
    
    // Mock the generateSampleData function
    vi.mock('../src/lib/utils/data-processing', async () => {
      const actual = await vi.importActual('../src/lib/utils/data-processing');
      return {
        ...actual,
        generateSampleData: () => {
          return [
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
              netEnergy: 3.0,
              gridImport: 0,
              excessExport: 3.0
            }
          ] as SolarDataPoint[];
        }
      };
    });

    render(<CalculationEngine />);
    
    // Click the load sample data button
    const loadButton = screen.getByText('Load Sample Data');
    fireEvent.click(loadButton);
    
    // Wait for data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });
    
    // Click the export data button
    fireEvent.click(screen.getByText('Export Data'));
    
    // Check that the download functionality was triggered
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });
});
