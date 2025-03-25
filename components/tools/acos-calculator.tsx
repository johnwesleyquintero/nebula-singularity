"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const acosCalculatorSchema = z.object({
  adSpend: z.coerce.number().min(0, "Ad spend cannot be negative"),
  sales: z.coerce.number().min(0, "Sales cannot be negative"),
})

type ACOSCalculatorValues = z.infer<typeof acosCalculatorSchema>

const targetAcosCalculatorSchema = z.object({
  productPrice: z.coerce.number().min(0.01, "Product price must be greater than 0"),
  productCost: z.coerce.number().min(0, "Product cost cannot be negative"),
  otherCosts: z.coerce.number().min(0, "Other costs cannot be negative"),
  targetProfit: z.coerce.number().min(0, "Target profit cannot be negative"),
})

type TargetACOSCalculatorValues = z.infer<typeof targetAcosCalculatorSchema>

export function ACOSCalculator() {
  const [acosResult, setAcosResult] = useState<{
    acos: number
    roas: number
  } | null>(null)

  const [targetAcosResult, setTargetAcosResult] = useState<{
    targetAcos: number
    breakEvenAcos: number
    maxCpc: number
  } | null>(null)

  const acosForm = useForm<ACOSCalculatorValues>({
    resolver: zodResolver(acosCalculatorSchema),
    defaultValues: {
      adSpend: 100,
      sales: 500,
    },
  })

  const targetAcosForm = useForm<TargetACOSCalculatorValues>({
    resolver: zodResolver(targetAcosCalculatorSchema),
    defaultValues: {
      productPrice: 29.99,
      productCost: 10,
      otherCosts: 2,
      targetProfit: 5,
    },
  })

  function calculateAcos(values: ACOSCalculatorValues) {
    const acos = values.sales > 0 ? (values.adSpend / values.sales) * 100 : 0
    const roas = values.adSpend > 0 ? values.sales / values.adSpend : 0

    return {
      acos,
      roas,
    }
  }

  function calculateTargetAcos(values: TargetACOSCalculatorValues) {
    const totalCosts = values.productCost + values.otherCosts
    const breakEvenAcos = ((values.productPrice - totalCosts) / values.productPrice) * 100
    const targetAcos = ((values.productPrice - totalCosts - values.targetProfit) / values.productPrice) * 100

    // Assuming 2% CTR for max CPC calculation
    const assumedCtr = 0.02
    const maxCpc = values.productPrice * (targetAcos / 100) * assumedCtr

    return {
      targetAcos: Math.max(0, targetAcos),
      breakEvenAcos,
      maxCpc,
    }
  }

  function onSubmitAcos(values: ACOSCalculatorValues) {
    const result = calculateAcos(values)
    setAcosResult(result)
  }

  function onSubmitTargetAcos(values: TargetACOSCalculatorValues) {
    const result = calculateTargetAcos(values)
    setTargetAcosResult(result)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculate">
        <TabsList>
          <TabsTrigger value="calculate">Calculate ACoS</TabsTrigger>
          <TabsTrigger value="target">Target ACoS</TabsTrigger>
        </TabsList>
        <TabsContent value="calculate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Form {...acosForm}>
                <form onSubmit={acosForm.handleSubmit(onSubmitAcos)} className="space-y-4">
                  <FormField
                    control={acosForm.control}
                    name="adSpend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Spend ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Your total advertising spend</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={acosForm.control}
                    name="sales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Your total sales from advertising</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Calculate ACoS
                  </Button>
                </form>
              </Form>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>ACoS Analysis</CardTitle>
                  <CardDescription>Your Advertising Cost of Sales metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {acosResult ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Ad Spend</p>
                          <p className="text-lg font-semibold">{formatCurrency(acosForm.getValues("adSpend"))}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Sales</p>
                          <p className="text-lg font-semibold">{formatCurrency(acosForm.getValues("sales"))}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">ACoS</p>
                          <p
                            className={`text-xl font-bold ${acosResult.acos <= 30 ? "text-green-600" : acosResult.acos <= 50 ? "text-amber-600" : "text-red-600"}`}
                          >
                            {acosResult.acos.toFixed(2)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                          <p
                            className={`text-xl font-bold ${acosResult.roas >= 3 ? "text-green-600" : acosResult.roas >= 2 ? "text-amber-600" : "text-red-600"}`}
                          >
                            {acosResult.roas.toFixed(2)}x
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Ad Spend", value: acosForm.getValues("adSpend") },
                                {
                                  name: "Net Sales",
                                  value: acosForm.getValues("sales") - acosForm.getValues("adSpend"),
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#ef4444" />
                              <Cell fill="#22c55e" />
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {acosResult.acos <= 15 ? (
                          <p>Your ACoS is excellent! Your advertising is highly profitable.</p>
                        ) : acosResult.acos <= 30 ? (
                          <p>Your ACoS is good. Your advertising is profitable.</p>
                        ) : acosResult.acos <= 50 ? (
                          <p>Your ACoS is average. Consider optimizing your campaigns to improve profitability.</p>
                        ) : (
                          <p>Your ACoS is high. Your advertising may not be profitable unless you have high margins.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">Enter ad spend and sales to calculate ACoS</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="target" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Form {...targetAcosForm}>
                <form onSubmit={targetAcosForm.handleSubmit(onSubmitTargetAcos)} className="space-y-4">
                  <FormField
                    control={targetAcosForm.control}
                    name="productPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Your product's selling price</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={targetAcosForm.control}
                    name="productCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Cost ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Your cost to purchase or manufacture the product</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={targetAcosForm.control}
                    name="otherCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Costs ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Shipping, Amazon fees, etc.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={targetAcosForm.control}
                    name="targetProfit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Profit per Unit ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>Your desired profit per unit sold</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Calculate Target ACoS
                  </Button>
                </form>
              </Form>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Target ACoS Analysis</CardTitle>
                  <CardDescription>Your optimal Advertising Cost of Sales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {targetAcosResult ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Product Price</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(targetAcosForm.getValues("productPrice"))}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Total Costs</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(
                              targetAcosForm.getValues("productCost") + targetAcosForm.getValues("otherCosts"),
                            )}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Break-Even ACoS</p>
                          <p className="text-xl font-bold text-amber-600">
                            {targetAcosResult.breakEvenAcos.toFixed(2)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Target ACoS</p>
                          <p className="text-xl font-bold text-green-600">{targetAcosResult.targetAcos.toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Maximum CPC Bid</p>
                        <p className="text-lg font-semibold">{formatCurrency(targetAcosResult.maxCpc)}</p>
                        <p className="text-xs text-muted-foreground">Based on estimated 2% CTR</p>
                      </div>
                      <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Product Cost", value: targetAcosForm.getValues("productCost") },
                                { name: "Other Costs", value: targetAcosForm.getValues("otherCosts") },
                                { name: "Target Profit", value: targetAcosForm.getValues("targetProfit") },
                                {
                                  name: "Ad Spend",
                                  value: targetAcosForm.getValues("productPrice") * (targetAcosResult.targetAcos / 100),
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              <Cell fill="#94a3b8" />
                              <Cell fill="#64748b" />
                              <Cell fill="#22c55e" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>
                          To maintain your target profit of {formatCurrency(targetAcosForm.getValues("targetProfit"))}{" "}
                          per unit, keep your ACoS below {targetAcosResult.targetAcos.toFixed(2)}%.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">Enter product details to calculate target ACoS</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

