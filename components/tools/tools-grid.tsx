"use client"

import { ACOSCalculator } from "@/components/tools/acos-calculator"
import { DescriptionEditor } from "@/components/tools/description-editor"
import { FBACalculator } from "@/components/tools/fba-calculator"
import { KeywordAnalyzer } from "@/components/tools/keyword-analyzer"
import { KeywordDeduplicator } from "@/components/tools/keyword-deduplicator"
import { ListingQualityChecker } from "@/components/tools/listing-quality-checker"
import { PPCCampaignAuditor } from "@/components/tools/ppc-campaign-auditor"
import { SalesEstimator } from "@/components/tools/sales-estimator"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart2, Calculator, CheckSquare, FileText, Filter, PieChart, Search, TrendingUp } from "lucide-react"
import { useState } from "react"



export type ToolsGridProps = {
  searchQuery: string
  selectedCategory: string
}

const tools = [
  {
    id: "fba-calculator",
    title: "FBA Calculator",
    description: "Calculate the profitability of your FBA products",
    icon: Calculator,
    component: FBACalculator,
    category: "pricing",
  },
  {
    id: "keyword-analyzer",
    title: "Keyword Analyzer",
    description: "Discover and analyze relevant keywords for your products",
    icon: Search,
    component: KeywordAnalyzer,
    category: "keywords",
  },
  {
    id: "listing-quality-checker",
    title: "Listing Quality Checker",
    description: "Evaluate the quality and optimization of your product listings",
    icon: CheckSquare,
    component: ListingQualityChecker,
    category: "listings",
  },
  {
    id: "ppc-campaign-auditor",
    title: "PPC Campaign Auditor",
    description: "Analyze the performance of your PPC advertising campaigns",
    icon: BarChart2,
    component: PPCCampaignAuditor,
    category: "analytics",
  },
  {
    id: "description-editor",
    title: "Description Editor",
    description: "Create optimized product descriptions for your listings",
    icon: FileText,
    component: DescriptionEditor,
    category: "listings",
  },
  {
    id: "keyword-deduplicator",
    title: "Keyword Deduplicator",
    description: "Remove duplicate keywords from your keyword lists",
    icon: Filter,
    component: KeywordDeduplicator,
    category: "keywords",
  },
  {
    id: "acos-calculator",
    title: "ACoS Calculator",
    description: "Calculate your Advertising Cost of Sales (ACoS)",
    icon: PieChart,
    component: ACOSCalculator,
    category: "pricing",
  },
  {
    id: "sales-estimator",
    title: "Sales Estimator",
    description: "Estimate potential sales figures for your products",
    icon: TrendingUp,
    component: SalesEstimator,
    category: "analytics",
  },
]

