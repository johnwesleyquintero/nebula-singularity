import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
  FormField
} from '../ui/form';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Loader2 } from 'lucide-react';

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

export interface ReportTemplate {
  id: string;
  name: string;
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

const MetricCheckbox = ({ metric, field }: { metric: any; field: any }) => {
  const handleChange = (checked: boolean) => {
    const newValue = checked
      ? [...field.value, metric.id]
      : field.value.filter((value: any) => value !== metric.id)
    field.onChange(newValue)
  }

  return (
    <FormControl>
      <Checkbox
        id={metric.id}
        checked={field.value.includes(metric.id)}
        onCheckedChange={handleChange}
      />
      <FormLabel htmlFor={metric.id} className="font-normal">
        {metric.label}
      </FormLabel>
    </FormControl>
  )
}

const MetricsField = ({ control, metrics }: { control: any; metrics: any[] }) => (
  <FormField
    control={control}
    name="metrics"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Metrics</FormLabel>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {metrics.map((metric: any) => (
            <MetricCheckbox key={metric.id} metric={metric} field={field} />
          ))}
        </div>
        <FormDescription>Select the metrics to include in your report.</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
)

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportType, onGenerate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [includeCharts, setIncludeCharts] = useState(false);

  const validateDates = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error('End date cannot be earlier than start date');
      return false;
    }

    return true;
  };

  const handleGenerate = async () => {
    if (!validateDates()) return;

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      toast.error('Error generating report', {
        description: errorMessage,
      });
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
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          `Generate ${reportType.toUpperCase()} Report`
        )}
      </Button>
    </div>
  );
};

export default ReportGenerator;
