import React from 'react';
"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Day 1",
    spend: 400,
    sales: 240,
    acos: 16.7,
  },
  {
    name: "Day 2",
    spend: 300,
    sales: 139,
    acos: 21.6,
  },
  {
    name: "Day 3",
    spend: 200,
    sales: 980,
    acos: 2.0,
  },
  {
    name: "Day 4",
    spend: 278,
    sales: 390,
    acos: 7.1,
  },
  {
    name: "Day 5",
    spend: 189,
    sales: 480,
    acos: 3.9,
  },
  {
    name: "Day 6",
    spend: 239,
    sales: 380,
    acos: 6.3,
  },
  {
    name: "Day 7",
    spend: 349,
    sales: 430,
    acos: 8.1,
  },
  {
    name: "Day 8",
    spend: 249,
    sales: 530,
    acos: 4.7,
  },
  {
    name: "Day 9",
    spend: 349,
    sales: 490,
    acos: 7.1,
  },
  {
    name: "Day 10",
    spend: 249,
    sales: 380,
    acos: 6.6,
  },
]

export function PPCOverview() {
  return (
    <ChartContainer
      config={{
        spend: {
          label: "Ad Spend",
          color: "hsl(var(--chart-1))",
        },
        sales: {
          label: "Ad Sales",
          color: "hsl(var(--chart-2))",
        },
        acos: {
          label: "ACOS %",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="spend"
            stroke="var(--color-spend)"
            fill="var(--color-spend)"
            fillOpacity={0.3}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="var(--color-sales)"
            fill="var(--color-sales)"
            fillOpacity={0.3}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="acos"
            stroke="var(--color-acos)"
            fill="var(--color-acos)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

