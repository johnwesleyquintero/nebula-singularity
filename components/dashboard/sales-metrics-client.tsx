"use client";
import dynamic from "next/dynamic";

const SalesMetrics = dynamic(
  () =>
    import("@/components/dashboard/sales-metrics").then(
      (mod) => mod.SalesMetrics,
    ),
  { ssr: false },
);

export default function SalesMetricsClient() {
  return <SalesMetrics />;
}
