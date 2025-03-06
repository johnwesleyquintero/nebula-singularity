import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormField } from "../ui/form";
// Refactored to reduce nesting depth
function renderReportNameField({ control, field }: any) {
  return (
    <FormItem>
      <FormLabel>Report Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter report name" {...field} />
      </FormControl>
      <FormDescription>Give your report a descriptive name.</FormDescription>
      <FormMessage />
    </FormItem>
  )
}

function ReportNameField({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="reportName"
      render={renderReportNameField}
    />
  )
}

export { ReportNameField };
