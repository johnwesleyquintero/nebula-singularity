"use client";

import { ACOSCalculator } from "@/components/tools/acos-calculator";
import { DescriptionEditor } from "@/components/tools/description-editor";
import { FBACalculator } from "@/components/tools/fba-calculator";
import { KeywordAnalyzer } from "@/components/tools/keyword-analyzer";
import { KeywordDeduplicator } from "@/components/tools/keyword-deduplicator";
import { ListingQualityChecker } from "@/components/tools/listing-quality-checker";
import { PPCCampaignAuditor } from "@/components/tools/ppc-campaign-auditor";
import { SalesEstimator } from "@/components/tools/sales-estimator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart2,
  Calculator,
  CheckSquare,
  FileText,
  Filter,
  PieChart,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export type ToolsGridProps = {
  searchQuery: string;
  selectedCategory: string;
};

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
    description:
      "Evaluate the quality and optimization of your product listings",
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
];

export function ToolsGrid({ searchQuery, selectedCategory }: ToolsGridProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedToolData = tools.find((tool) => tool.id === selectedTool);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <tool.icon className="h-5 w-5" />
                <CardTitle>{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                onClick={() => setSelectedTool(tool.id)}
                className="w-full"
              >
                Open Tool
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedToolData?.title}</DialogTitle>
            <DialogDescription>
              {selectedToolData?.description}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {selectedToolData?.component && <selectedToolData.component />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
