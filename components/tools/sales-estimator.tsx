"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const salesEstimatorSchema = z.object({
  category: z.string({
    required_error: "Please select a product category",
  }),
  bsrRank: z.coerce.number().min(1, "BSR must be at least 1"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  conversionRate: z.coerce
    .number()
    .min(0.1, "Conversion rate must be at least 0.1")
    .max(30, "Conversion rate must be at most 30"),
});

type SalesEstimatorValues = z.infer<typeof salesEstimatorSchema>;

export function SalesEstimator() {
  const [estimationResult, setEstimationResult] = useState<{
    dailySales: number;
    monthlySales: number;
    annualSales: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    annualRevenue: number;
    estimatedTraffic: number;
  } | null>(null);

  const form = useForm<SalesEstimatorValues>({
    resolver: zodResolver(salesEstimatorSchema),
    defaultValues: {
      category: "",
      bsrRank: 5000,
      price: 29.99,
      conversionRate: 10,
    },
  });

  function estimateSales(values: SalesEstimatorValues) {
    // This is a simplified estimation model
    // In a real app, this would use more sophisticated algorithms or API calls

    // Category multipliers (simplified)
    const categoryMultipliers: Record<string, number> = {
      electronics: 1.2,
      "home-kitchen": 1.0,
      "toys-games": 0.9,
      beauty: 0.85,
      clothing: 1.1,
      books: 1.3,
      sports: 0.8,
      health: 0.95,
      "office-products": 0.75,
      "pet-supplies": 0.7,
    };

    const multiplier = categoryMultipliers[values.category] || 1.0;

    // BSR to sales relationship (simplified logarithmic model)
    // Higher BSR = lower sales
    let dailySales = 0;

    if (values.bsrRank <= 100) {
      dailySales = 100 * multiplier;
    } else if (values.bsrRank <= 1000) {
      dailySales = (100 - (Math.log10(values.bsrRank) - 2) * 30) * multiplier;
    } else if (values.bsrRank <= 10000) {
      dailySales = (70 - (Math.log10(values.bsrRank) - 3) * 20) * multiplier;
    } else if (values.bsrRank <= 100000) {
      dailySales = (50 - (Math.log10(values.bsrRank) - 4) * 15) * multiplier;
    } else {
      dailySales = (35 - (Math.log10(values.bsrRank) - 5) * 10) * multiplier;
    }

    // Ensure minimum sales
    dailySales = Math.max(0.1, dailySales);

    // Calculate other metrics
    const monthlySales = dailySales * 30;
    const annualSales = dailySales * 365;

    const dailyRevenue = dailySales * values.price;
    const monthlyRevenue = monthlySales * values.price;
    const annualRevenue = annualSales * values.price;

    // Estimate traffic based on conversion rate
    const estimatedTraffic = (dailySales / (values.conversionRate / 100)) * 1.1; // Adding 10% for non-converting views

    return {
      dailySales,
      monthlySales,
      annualSales,
      dailyRevenue,
      monthlyRevenue,
      annualRevenue,
      estimatedTraffic,
    };
  }

  function onSubmit(values: SalesEstimatorValues) {
    const result = estimateSales(values);
    setEstimationResult(result);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="home-kitchen">
                          Home & Kitchen
                        </SelectItem>
                        <SelectItem value="toys-games">Toys & Games</SelectItem>
                        <SelectItem value="beauty">
                          Beauty & Personal Care
                        </SelectItem>
                        <SelectItem value="clothing">
                          Clothing & Accessories
                        </SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="sports">
                          Sports & Outdoors
                        </SelectItem>
                        <SelectItem value="health">
                          Health & Household
                        </SelectItem>
                        <SelectItem value="office-products">
                          Office Products
                        </SelectItem>
                        <SelectItem value="pet-supplies">
                          Pet Supplies
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best matches your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bsrRank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Sellers Rank (BSR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the BSR of the product you want to estimate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the selling price of your product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conversionRate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Conversion Rate (%)</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value}%
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={30}
                        step={0.1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Estimated percentage of page views that convert to sales
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Estimate Sales
              </Button>
            </form>
          </Form>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sales Estimation</CardTitle>
              <CardDescription>
                Estimated sales based on BSR and category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {estimationResult ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Daily Sales
                      </p>
                      <p className="text-lg font-semibold">
                        {estimationResult.dailySales.toFixed(1)} units
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Monthly Sales
                      </p>
                      <p className="text-lg font-semibold">
                        {estimationResult.monthlySales.toFixed(0)} units
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Annual Sales
                      </p>
                      <p className="text-lg font-semibold">
                        {estimationResult.annualSales.toFixed(0)} units
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Estimated Traffic
                      </p>
                      <p className="text-lg font-semibold">
                        {estimationResult.estimatedTraffic.toFixed(0)} views/day
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Daily Revenue
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(estimationResult.dailyRevenue)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Monthly Revenue
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(estimationResult.monthlyRevenue)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Annual Revenue
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(estimationResult.annualRevenue)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={[
                          {
                            name: "Daily",
                            sales: estimationResult.dailySales,
                            revenue: estimationResult.dailyRevenue,
                          },
                          {
                            name: "Monthly",
                            sales: estimationResult.monthlySales / 30,
                            revenue: estimationResult.monthlyRevenue / 30,
                          },
                          {
                            name: "Annual",
                            sales: estimationResult.annualSales / 365,
                            revenue: estimationResult.annualRevenue / 365,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#8884d8"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#82ca9d"
                        />
                        <Tooltip
                          formatter={(value) =>
                            typeof value === "number" ? value.toFixed(2) : value
                          }
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="sales"
                          name="Units (Daily Avg)"
                          fill="#8884d8"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="revenue"
                          name="Revenue (Daily Avg)"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>
                      Note: These estimates are based on simplified models and
                      should be used as a general guide only.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-muted-foreground">
                    Enter product details to estimate sales
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
