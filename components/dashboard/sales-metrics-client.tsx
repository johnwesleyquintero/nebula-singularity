"use client";
import dynamic from 'next/dynamic';

const SalesMetrics = dynamic(
  () => import('@/components/dashboard/sales-metrics'),
  { ssr: false }
);

export default function SalesMetricsClient() {
  return <SalesMetrics />;
}