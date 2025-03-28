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
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const fbaCalculatorSchema = z.object({
  productPrice: z.coerce
    .number()
    .min(0.01, "Product price must be greater than 0"),
  productCost: z.coerce.number().min(0, "Product cost cannot be negative"),
  shippingToAmazon: z.coerce
    .number()
    .min(0, "Shipping cost cannot be negative"),
  weight: z.coerce.number().min(0.01, "Weight must be greater than 0"),
  length: z.coerce.number().min(0.01, "Length must be greater than 0"),
  width: z.coerce.number().min(0.01, "Width must be greater than 0"),
  height: z.coerce.number().min(0.01, "Height must be greater than 0"),
});

type FBACalculatorValues = z.infer<typeof fbaCalculatorSchema>;

export function FBACalculator() {
  const [results, setResults] = useState<{
    fbaFees: number;
    referralFee: number;
    totalCosts: number;
    profit: number;
    margin: number;
    roi: number;
  } | null>(null);

  const form = useForm<FBACalculatorValues>({
    resolver: zodResolver(fbaCalculatorSchema),
    defaultValues: {
      productPrice: 29.99,
      productCost: 10,
      shippingToAmazon: 2,
      weight: 1,
      length: 10,
      width: 6,
      height: 2,
    },
  });

  function calculateFBAFees(values: FBACalculatorValues) {
    // Calculate dimensional weight (length × width × height ÷ 139)
    const dimensionalWeight =
      (values.length * values.width * values.height) / 139;
    const billableWeight = Math.max(values.weight, dimensionalWeight);

    // Basic FBA fee calculation (simplified)
    let fbaFee = 2.41; // Base fee for small standard items

    if (billableWeight > 1) {
      fbaFee += (billableWeight - 1) * 0.38; // Additional fee per pound over 1 lb
    }

    // Size tier adjustments (simplified)
    if (
      values.length > 15 ||
      values.width > 12 ||
      values.height > 0.75 ||
      billableWeight > 1
    ) {
      fbaFee = 3.48; // Standard size
      if (billableWeight > 1) {
        fbaFee += (billableWeight - 1) * 0.38;
      }
    }

    if (
      values.length > 18 ||
      values.width > 14 ||
      values.height > 8 ||
      billableWeight > 20
    ) {
      fbaFee = 8.26; // Large standard size
      if (billableWeight > 1) {
        fbaFee += (billableWeight - 1) * 0.38;
      }
    }

    // Referral fee (typically 15% for most categories)
    const referralFee = values.productPrice * 0.15;

    // Calculate total costs
    const totalCosts =
      values.productCost + values.shippingToAmazon + fbaFee + referralFee;

    // Calculate profit
    const profit = values.productPrice - totalCosts;

    // Calculate profit margin
    const margin = (profit / values.productPrice) * 100;

    // Calculate ROI
    const roi = (profit / (values.productCost + values.shippingToAmazon)) * 100;

    return {
      fbaFees: fbaFee,
      referralFee,
      totalCosts,
      profit,
      margin,
      roi,
    };
  }

  function onSubmit(values: FBACalculatorValues) {
    const calculationResults = calculateFBAFees(values);
    setResults(calculationResults);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    The selling price of your product on Amazon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Cost ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your cost to purchase or manufacture the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingToAmazon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping to Amazon ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cost to ship your product to Amazon's fulfillment center
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lb)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (in)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (in)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (in)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Calculate FBA Fees
            </Button>
          </form>
        </Form>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Profitability Analysis</CardTitle>
            <CardDescription>
              Breakdown of costs and profit for your FBA product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Product Price
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(form.getValues("productPrice"))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Product Cost
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(form.getValues("productCost"))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Shipping to Amazon
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(form.getValues("shippingToAmazon"))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      FBA Fees
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(results.fbaFees)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Referral Fee
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(results.referralFee)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Costs
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(results.totalCosts)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Net Profit
                    </p>
                    <p
                      className={`text-xl font-bold ${results.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(results.profit)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Profit Margin
                    </p>
                    <p
                      className={`text-xl font-bold ${results.margin >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {results.margin.toFixed(2)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      ROI
                    </p>
                    <p
                      className={`text-xl font-bold ${results.roi >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {results.roi.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">
                  Enter product details and calculate to see results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
