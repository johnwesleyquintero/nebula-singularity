import { useForm } from 'react-hook-form';
import { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Chart } from '@/components/Chart';
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsList } from "@/components/reports/reports-list"
import { ReportNameField } from "@/components/reports/report-generator"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface ReportData {
  id: string;
  date: Date;
  metric: number;
  category: string;
}

export const metadata: Metadata = {
  title: "Reports | Nebula-Suite",
  description: "Data export and custom reporting for Amazon sellers",
}

const reportFilterSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(z.string()).min(1)
});

export default async function ReportsPage() {
  const reportData = await getReportData();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reportFilterSchema)
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
                  <ReportNameField control={control} />
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
          {errors && (
            <div role="alert" className="text-red-500">
              {Object.values(errors).map(error => (
                <p key={error.message}>{error.message}</p>
              ))}
            </div>
          )}
          <Chart data={reportData} aria-label="Report data visualization" />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

async function getReportData() {
  const res = await fetch('https://api.nebula.com/reports', {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch report data');
  }

  return res.json();
}
