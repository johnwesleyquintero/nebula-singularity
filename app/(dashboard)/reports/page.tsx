import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsList } from "@/components/reports/reports-list"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Metadata } from 'next';
import { useForm } from 'react-hook-form'

export const metadata: Metadata = {
  title: "Reports | Nebula-Suite",
  description: "Data export and custom reporting for Amazon sellers",
}

const reportFilterSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(z.string()).min(1)
});

export default function ReportsPage() {
  const form = useForm<z.infer<typeof reportFilterSchema>>({
    resolver: zodResolver(reportFilterSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      metrics: []
    },
  });

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner aria-label="Loading reports..." />}>
        <div className="flex flex-col gap-4" role="main">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          </div>
          <Tabs defaultValue="saved" className="space-y-4">
            <TabsList aria-label="Report types">
              <TabsTrigger value="saved" aria-label="Saved reports">Saved Reports</TabsTrigger>
              <TabsTrigger value="generate" aria-label="Generate report">Generate Report</TabsTrigger>
              <TabsTrigger value="scheduled" aria-label="Scheduled reports">Scheduled Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Reports</CardTitle>
                  <CardDescription>Access and download your previously generated reports.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportsList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Custom Report</CardTitle>
                  <CardDescription>Create a custom report by selecting metrics and date ranges.</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scheduled" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Manage your scheduled reports and delivery settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Scheduled reports feature coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
