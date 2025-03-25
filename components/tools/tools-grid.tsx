"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calculator, Search, CheckSquare, BarChart2, FileText, Filter, PieChart, TrendingUp } from "lucide-react"
import { FBACalculator } from "@/components/tools/fba-calculator"
import { KeywordAnalyzer } from "@/components/tools/keyword-analyzer"
import { ListingQualityChecker } from "@/components/tools/listing-quality-checker"
import { PPCCampaignAuditor } from "@/components/tools/ppc-campaign-auditor"
import { DescriptionEditor } from "@/components/tools/description-editor"
import { KeywordDeduplicator } from "@/components/tools/keyword-deduplicator"
import { ACOSCalculator } from "@/components/tools/acos-calculator"
import { SalesEstimator } from "@/components/tools/sales-estimator"

const tools = [
  {
    id: "fba-calculator",
    title: "FBA Calculator",
    description: "Calculate the profitability of your FBA products",
    icon: Calculator,
    component: FBACalculator,
  },
  {
    id: "keyword-analyzer",
    title: "Keyword Analyzer",
    description: "Discover and analyze relevant keywords for your products",
    icon: Search,
    component: KeywordAnalyzer,
  },
  {
    id: "listing-quality-checker",
    title: "Listing Quality Checker",
    description: "Evaluate the quality and optimization of your product listings",
    icon: CheckSquare,
    component: ListingQualityChecker,
  },
  {
    id: "ppc-campaign-auditor",
    title: "PPC Campaign Auditor",
    description: "Analyze the performance of your PPC advertising campaigns",
    icon: BarChart2,
    component: PPCCampaignAuditor,
  },
  {
    id: "description-editor",
    title: "Description Editor",
    description: "Create optimized product descriptions for your listings",
    icon: FileText,
    component: DescriptionEditor,
  },
  {
    id: "keyword-deduplicator",
    title: "Keyword Deduplicator",
    description: "Remove duplicate keywords from your keyword lists",
    icon: Filter,
    component: KeywordDeduplicator,
  },
  {
    id: "acos-calculator",
    title: "ACoS Calculator",
    description: "Calculate your Advertising Cost of Sales (ACoS)",
    icon: PieChart,
    component: ACOSCalculator,
  },
  {
    id: "sales-estimator",
    title: "Sales Estimator",
    description: "Estimate potential sales figures for your products",
    icon: TrendingUp,
    component: SalesEstimator,
  },
]

export function ToolsGrid() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const openTool = (toolId: string) => {
    setSelectedTool(toolId)
  }

  const closeTool = () => {
    setSelectedTool(null)
  }

  const selectedToolData = tools.find((tool) => tool.id === selectedTool)

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button onClick={() => openTool(tool.id)} className="w-full">
                Open Tool
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && closeTool()}>
        {selectedToolData && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <selectedToolData.icon className="h-5 w-5" />
                {selectedToolData.title}
              </DialogTitle>
              <DialogDescription>{selectedToolData.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">{selectedTool && <selectedToolData.component />}</div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

