'use client';

import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  dayTypeOptions, 
  hourRangeOptions, 
  monthOptions, 
  seasonOptions, 
  timePeriodOptions 
} from '@/lib/data/constants';
import { FilterOptions } from '@/lib/types';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [timePeriod, setTimePeriod] = useState('all');
  const [months, setMonths] = useState<number[]>([]);
  const [dayType, setDayType] = useState('all');
  const [hourRange, setHourRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    
    // Reset custom date range if not custom
    if (value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
    
    // Apply filters
    applyFilters();
  };
  
  const handleMonthChange = (value: string) => {
    const monthValue = parseInt(value, 10);
    
    // Toggle month selection
    if (months.includes(monthValue)) {
      setMonths(months.filter(m => m !== monthValue));
    } else {
      setMonths([...months, monthValue]);
    }
    
    // Apply filters
    applyFilters();
  };
  
  const handleSeasonChange = (value: string) => {
    const season = seasonOptions.find(s => s.value === value);
    if (season) {
      setMonths(season.months);
    } else {
      setMonths([]);
    }
    
    // Apply filters
    applyFilters();
  };
  
  const handleDayTypeChange = (value: string) => {
    setDayType(value);
    
    // Apply filters
    applyFilters();
  };
  
  const handleHourRangeChange = (value: string) => {
    setHourRange(value);
    
    // Apply filters
    applyFilters();
  };
  
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    
    // Apply filters
    applyFilters();
  };
  
  const applyFilters = () => {
    // Get hours from selected hour range
    const selectedHourRange = hourRangeOptions.find(h => h.value === hourRange);
    const hours = selectedHourRange?.hours || [];
    
    // Determine weekday/weekend filter
    const weekdaysOnly = dayType === 'weekdays';
    const weekendsOnly = dayType === 'weekends';
    
    // Create filter options
    const filters: FilterOptions = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      months: months.length > 0 ? months : undefined,
      hours: hours.length > 0 ? hours : undefined,
      weekdaysOnly,
      weekendsOnly
    };
    
    // Call the filter change handler
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    setTimePeriod('all');
    setMonths([]);
    setDayType('all');
    setHourRange('all');
    setStartDate('');
    setEndDate('');
    
    // Apply reset filters
    onFilterChange({});
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Data</CardTitle>
        <CardDescription>Customize your view of the solar and demand data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Time Period</Label>
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                {timePeriodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {timePeriod === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Season</Label>
            <Select onValueChange={handleSeasonChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                {seasonOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Months</Label>
            <div className="grid grid-cols-3 gap-2">
              {monthOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`month-${option.value}`}
                    checked={months.includes(option.value)}
                    onChange={() => handleMonthChange(option.value.toString())}
                    className="rounded"
                  />
                  <Label htmlFor={`month-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Day Type</Label>
            <Select value={dayType} onValueChange={handleDayTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select day type" />
              </SelectTrigger>
              <SelectContent>
                {dayTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Hour Range</Label>
            <Select value={hourRange} onValueChange={handleHourRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select hour range" />
              </SelectTrigger>
              <SelectContent>
                {hourRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={resetFilters} variant="outline" className="w-full">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
