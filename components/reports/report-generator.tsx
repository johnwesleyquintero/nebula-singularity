"use client"

import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

const reportFormSchema = z.object({
  reportName: z.string().min(3, {
    message: "Report name must be at least 3 characters.",
  }),
  reportType: z.string({
    required_error: "Please select a report type.",
  }),
  dateRange: z.object({
    from: z.date({
      required_error: "A start date is required.",
    }),
    to: z.date({
      required_error: "An end date is required.",
    }),
  }),
  format: z.string({
    required_error: "Please select a format.",
  }),
  metrics: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one metric.",
  }),
})

type ReportFormValues = z.infer<typeof reportFormSchema>

const defaultValues: Partial<ReportFormValues> = {
  reportName: "",
  metrics: ["sales", "orders", "conversion_rate"],
}

const metrics = [
  {
    id: "sales",
    label: "Sales",
  },
  {
    id: "orders",
    label: "Orders",
  },
  {
    id: "units_sold",
    label: "Units Sold",
  },
  {
    id: "conversion_rate",
    label: "Conversion Rate",
  },
  {
    id: "ppc_spend",
    label: "PPC Spend",
  },
  {
    id: "acos",
    label: "ACOS",
  },
  {
    id: "tacos",
    label: "TACOS",
  },
  {
    id: "impressions",
    label: "Impressions",
  },
  {
    id: "clicks",
    label: "Clicks",
  },
  {
    id: "ctr",
    label: "CTR",
  },
]

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues,
  })

  function onSubmit(data: ReportFormValues) {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast.success("Report generated successfully!")
      console.log(data)
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="reportName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter report name" {...field} />
                </FormControl>
                <FormDescription>Give your report a descriptive name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="ppc">PPC Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the type of report you want to generate.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date Range</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormDescription>Select the date range for your report data.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose the file format for your report.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metrics"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Metrics</FormLabel>
                <FormDescription>Select the metrics to include in your report.</FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {metrics.map((metric) => (
                  <FormField
                    key={metric.id}
                    control={form.control}
                    name="metrics"
                    render={({ field }) => {
                      return (
                        <FormItem key={metric.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(metric.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, metric.id])
                                  : field.onChange(field.value?.filter((value) => value !== metric.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{metric.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </form>
    </Form>
  )
}

