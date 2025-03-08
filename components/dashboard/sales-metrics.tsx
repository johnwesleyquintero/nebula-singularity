import React from 'react';
"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    organic: 4000,
    ppc: 2400,
  },
  {
    name: "Feb",
    organic: 3000,
    ppc: 1398,
  },
  {
    name: "Mar",
    organic: 9800,
    ppc: 2000,
  },
  {
    name: "Apr",
    organic: 3908,
    ppc: 2780,
  },
  {
    name: "May",
    organic: 4800,
    ppc: 1890,
  },
  {
    name: "Jun",
    organic: 3800,
    ppc: 2390,
  },
]

export function SalesMetrics() {
  return (
    <ChartContainer
      config={{
        organic: {
          label: "Organic Sales",
          color: "hsl(var(--chart-1))",
        },
        ppc: {
          label: "PPC Sales",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="organic" fill="var(--color-organic)" />
          <Bar dataKey="ppc" fill="var(--color-ppc)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

