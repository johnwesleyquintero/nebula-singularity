import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

export type ReportType = 'pdf' | 'csv' | 'xlsx';

export interface ReportData {
  startDate: string;
  endDate: string;
  filters: {
    department?: string;
    status?: string;
  };
  includeCharts: boolean;
}

interface ReportGeneratorProps {
  reportType: ReportType;
  onGenerate: (data: ReportData) => Promise<void>;
}

interface DateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="startDate">Start Date</Label>
      <Input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
    </div>
    <div>
      <Label htmlFor="endDate">End Date</Label>
      <Input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />
    </div>
  </div>
);

interface ReportFiltersProps {
  department: string;
  status: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ department, status, onDepartmentChange, onStatusChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label>Department</Label>
      <Select onValueChange={onDepartmentChange} value={department}>
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Status</Label>
      <Select onValueChange={onStatusChange} value={status}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

interface ChartToggleProps {
  includeCharts: boolean;
  onToggle: (checked: boolean) => void;
}

const ChartToggle: React.FC<ChartToggleProps> = ({ includeCharts, onToggle }) => (
  <div className="flex items-center space-x-2">
    <Switch
      id="includeCharts"
      checked={includeCharts}
      onCheckedChange={onToggle}
    />
    <Label htmlFor="includeCharts">Include Charts</Label>
  </div>
);

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportType, onGenerate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [includeCharts, setIncludeCharts] = useState(false);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select a valid date range');
      return;
    }

    const reportData: ReportData = {
      startDate,
      endDate,
      filters: {
        department: department || undefined,
        status: status || undefined,
      },
      includeCharts,
    };

    try {
      setIsLoading(true);
      await onGenerate(reportData);
      toast.success('Report generated successfully');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <DateRange
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <ReportFilters
        department={department}
        status={status}
        onDepartmentChange={setDepartment}
        onStatusChange={setStatus}
      />
      <ChartToggle
        includeCharts={includeCharts}
        onToggle={setIncludeCharts}
      />
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : `Generate ${reportType.toUpperCase()} Report`}
      </Button>
    </div>
  );
};

export default ReportGenerator;
