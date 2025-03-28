"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type CampaignData = {
  name: string;
  type: string;
  budget: number;
  spend: number;
  sales: number;
  acos: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  orders: number;
  conversionRate: number;
};

type KeywordData = {
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  sales: number;
  acos: number;
  orders: number;
  conversionRate: number;
  status: "high-performing" | "average" | "underperforming" | "new";
};

type AuditResult = {
  campaignScore: number;
  campaignFeedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  keywordAnalysis: {
    highPerforming: KeywordData[];
    underperforming: KeywordData[];
    negative: string[];
  };
};

export function PPCCampaignAuditor() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<string>("");
  const [keywordData, setKeywordData] = useState<string>("");
  const [negativeKeywords, setNegativeKeywords] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const analyzeCampaign = () => {
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Parse campaign data (in a real app, this would parse CSV or JSON)
      // For demo, we'll generate mock data
      const mockCampaign: CampaignData = {
        name: "Summer Sale Campaign",
        type: "Sponsored Products",
        budget: 25,
        spend: 18.75,
        sales: 85.2,
        acos: 22.01,
        impressions: 4250,
        clicks: 125,
        ctr: 2.94,
        cpc: 0.15,
        orders: 7,
        conversionRate: 5.6,
      };

      // Generate mock keywords
      const mockKeywords: KeywordData[] = [
        {
          keyword: "wireless headphones",
          matchType: "broad",
          impressions: 1250,
          clicks: 45,
          ctr: 3.6,
          spend: 6.75,
          sales: 39.99,
          acos: 16.88,
          orders: 3,
          conversionRate: 6.67,
          status: "high-performing",
        },
        {
          keyword: "bluetooth earbuds",
          matchType: "phrase",
          impressions: 980,
          clicks: 32,
          ctr: 3.27,
          spend: 4.8,
          sales: 26.99,
          acos: 17.78,
          orders: 2,
          conversionRate: 6.25,
          status: "high-performing",
        },
        {
          keyword: "noise cancelling headphones",
          matchType: "exact",
          impressions: 520,
          clicks: 18,
          ctr: 3.46,
          spend: 3.24,
          sales: 0,
          acos: Number.POSITIVE_INFINITY,
          orders: 0,
          conversionRate: 0,
          status: "underperforming",
        },
        {
          keyword: "wireless earphones",
          matchType: "broad",
          impressions: 750,
          clicks: 22,
          ctr: 2.93,
          spend: 3.3,
          sales: 13.99,
          acos: 23.59,
          orders: 1,
          conversionRate: 4.55,
          status: "average",
        },
        {
          keyword: "headphones with microphone",
          matchType: "phrase",
          impressions: 320,
          clicks: 8,
          ctr: 2.5,
          spend: 1.2,
          sales: 0,
          acos: Number.POSITIVE_INFINITY,
          orders: 0,
          conversionRate: 0,
          status: "underperforming",
        },
      ];

      // Parse negative keywords
      const mockNegativeKeywords = negativeKeywords
        ? negativeKeywords
            .split(/[\n,]+/)
            .map((k) => k.trim())
            .filter(Boolean)
        : ["cheap", "free", "used"];

      // Generate audit result
      const campaignScore = calculateCampaignScore(
        mockCampaign,
        mockKeywords,
        mockNegativeKeywords,
      );

      const auditResult: AuditResult = {
        campaignScore,
        campaignFeedback: generateFeedback(
          mockCampaign,
          mockKeywords,
          mockNegativeKeywords,
        ),
        keywordAnalysis: {
          highPerforming: mockKeywords.filter(
            (k) => k.status === "high-performing",
          ),
          underperforming: mockKeywords.filter(
            (k) => k.status === "underperforming",
          ),
          negative: mockNegativeKeywords,
        },
      };

      setAuditResult(auditResult);
      setIsLoading(false);
    }, 2000);
  };

  const calculateCampaignScore = (
    campaign: CampaignData,
    keywords: KeywordData[],
    negativeKeywords: string[],
  ): number => {
    let score = 0;

    // Score based on ACOS
    if (campaign.acos < 15) score += 25;
    else if (campaign.acos < 25) score += 20;
    else if (campaign.acos < 35) score += 15;
    else if (campaign.acos < 45) score += 10;
    else score += 5;

    // Score based on CTR
    if (campaign.ctr > 3) score += 15;
    else if (campaign.ctr > 2) score += 10;
    else if (campaign.ctr > 1) score += 5;

    // Score based on conversion rate
    if (campaign.conversionRate > 6) score += 20;
    else if (campaign.conversionRate > 4) score += 15;
    else if (campaign.conversionRate > 2) score += 10;
    else score += 5;

    // Score based on keyword performance distribution
    const highPerformingPercentage =
      keywords.filter((k) => k.status === "high-performing").length /
      keywords.length;
    if (highPerformingPercentage > 0.5) score += 20;
    else if (highPerformingPercentage > 0.3) score += 15;
    else if (highPerformingPercentage > 0.1) score += 10;
    else score += 5;

    // Score based on negative keywords
    if (negativeKeywords.length > 10) score += 20;
    else if (negativeKeywords.length > 5) score += 15;
    else if (negativeKeywords.length > 0) score += 10;

    return Math.min(score, 100);
  };

  const generateFeedback = (
    campaign: CampaignData,
    keywords: KeywordData[],
    negativeKeywords: string[],
  ) => {
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // ACOS analysis
    if (campaign.acos < 20) {
      strengths.push(
        `Strong ACOS of ${campaign.acos.toFixed(2)}%, well below the typical target of 25-30%`,
      );
    } else if (campaign.acos < 30) {
      strengths.push(
        `Good ACOS of ${campaign.acos.toFixed(2)}%, within the typical target range`,
      );
    } else {
      weaknesses.push(
        `High ACOS of ${campaign.acos.toFixed(2)}%, above the typical target of 25-30%`,
      );
      recommendations.push(
        "Consider pausing or adjusting bids for keywords with high ACOS",
      );
    }

    // CTR analysis
    if (campaign.ctr > 3) {
      strengths.push(
        `Excellent CTR of ${campaign.ctr.toFixed(2)}%, indicating strong ad relevance`,
      );
    } else if (campaign.ctr > 1.5) {
      strengths.push(
        `Good CTR of ${campaign.ctr.toFixed(2)}%, above the Amazon average`,
      );
    } else {
      weaknesses.push(
        `Low CTR of ${campaign.ctr.toFixed(2)}%, indicating potential issues with ad relevance`,
      );
      recommendations.push(
        "Improve ad copy and ensure keywords are relevant to your product",
      );
    }

    // Conversion rate analysis
    if (campaign.conversionRate > 5) {
      strengths.push(
        `Strong conversion rate of ${campaign.conversionRate.toFixed(2)}%`,
      );
    } else if (campaign.conversionRate > 3) {
      strengths.push(
        `Good conversion rate of ${campaign.conversionRate.toFixed(2)}%`,
      );
    } else {
      weaknesses.push(
        `Low conversion rate of ${campaign.conversionRate.toFixed(2)}%`,
      );
      recommendations.push(
        "Optimize your product listing to improve conversion rate",
      );
    }

    // Budget utilization
    const budgetUtilization = (campaign.spend / campaign.budget) * 100;
    if (budgetUtilization > 95) {
      weaknesses.push(
        `Budget is fully utilized (${budgetUtilization.toFixed(0)}%), potentially limiting campaign reach`,
      );
      recommendations.push(
        "Consider increasing your daily budget to capture more sales",
      );
    } else if (budgetUtilization < 50) {
      weaknesses.push(
        `Low budget utilization (${budgetUtilization.toFixed(0)}%), indicating potential targeting issues`,
      );
      recommendations.push(
        "Expand keyword targeting or increase bids to utilize budget more effectively",
      );
    } else {
      strengths.push(
        `Good budget utilization (${budgetUtilization.toFixed(0)}%)`,
      );
    }

    // Keyword performance
    const highPerformingCount = keywords.filter(
      (k) => k.status === "high-performing",
    ).length;
    const underperformingCount = keywords.filter(
      (k) => k.status === "underperforming",
    ).length;

    if (highPerformingCount > underperformingCount) {
      strengths.push(
        `Strong keyword performance with ${highPerformingCount} high-performing keywords`,
      );
    } else if (underperformingCount > highPerformingCount) {
      weaknesses.push(
        `${underperformingCount} underperforming keywords identified`,
      );
      recommendations.push("Pause or reduce bids for underperforming keywords");
    }

    // Negative keywords
    if (negativeKeywords.length > 10) {
      strengths.push(
        `Good use of negative keywords (${negativeKeywords.length})`,
      );
    } else {
      weaknesses.push(
        `Limited use of negative keywords (${negativeKeywords.length})`,
      );
      recommendations.push("Add more negative keywords to reduce wasted spend");
    }

    return {
      strengths,
      weaknesses,
      recommendations,
    };
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input">
        <TabsList>
          <TabsTrigger value="input">Campaign Data</TabsTrigger>
          {auditResult && (
            <TabsTrigger value="results">Audit Results</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="input" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-data">Campaign Data</Label>
              <Textarea
                id="campaign-data"
                placeholder="Enter your campaign data or paste from a report"
                className="min-h-[120px]"
                value={campaignData}
                onChange={(e) => setCampaignData(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                For demo purposes, you can leave this blank and we'll use sample
                data
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword-data">Keyword Data</Label>
              <Textarea
                id="keyword-data"
                placeholder="Enter your keyword performance data"
                className="min-h-[120px]"
                value={keywordData}
                onChange={(e) => setKeywordData(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                For demo purposes, you can leave this blank and we'll use sample
                data
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="negative-keywords">
                Negative Keywords (Optional)
              </Label>
              <Textarea
                id="negative-keywords"
                placeholder="Enter your negative keywords, separated by commas or new lines"
                className="min-h-[80px]"
                value={negativeKeywords}
                onChange={(e) => setNegativeKeywords(e.target.value)}
              />
            </div>

            <Button onClick={analyzeCampaign} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Campaign...
                </>
              ) : (
                "Audit PPC Campaign"
              )}
            </Button>
          </div>
        </TabsContent>

        {auditResult && (
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Score</CardTitle>
                <CardDescription>
                  Based on ACOS, CTR, conversion rate, and keyword performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-4xl font-bold">
                    {auditResult.campaignScore}/100
                  </div>
                  <Progress
                    value={auditResult.campaignScore}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    {auditResult.campaignScore >= 80
                      ? "Excellent campaign performance"
                      : auditResult.campaignScore >= 60
                        ? "Good campaign with room for improvement"
                        : "Campaign needs significant optimization"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                    Campaign Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {auditResult.campaignFeedback.strengths.map(
                      (strength, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-green-500">•</span>
                          {strength}
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="mr-2 h-5 w-5 text-red-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {auditResult.campaignFeedback.weaknesses.map(
                      (weakness, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-red-500">•</span>
                          {weakness}
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Actionable steps to improve your campaign performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {auditResult.campaignFeedback.recommendations.map(
                    (recommendation, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-primary">→</span>
                        {recommendation}
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High-Performing Keywords</CardTitle>
                <CardDescription>
                  Keywords with strong performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Match Type</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">Conv. Rate</TableHead>
                      <TableHead className="text-right">ACOS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditResult.keywordAnalysis.highPerforming.map(
                      (keyword, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {keyword.keyword}
                          </TableCell>
                          <TableCell>{keyword.matchType}</TableCell>
                          <TableCell className="text-right">
                            {keyword.ctr.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {keyword.conversionRate.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {keyword.acos === Number.POSITIVE_INFINITY
                              ? "∞"
                              : `${keyword.acos.toFixed(2)}%`}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Underperforming Keywords</CardTitle>
                <CardDescription>
                  Keywords that need optimization or pausing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Match Type</TableHead>
                      <TableHead className="text-right">Spend</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">ACOS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditResult.keywordAnalysis.underperforming.map(
                      (keyword, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {keyword.keyword}
                          </TableCell>
                          <TableCell>{keyword.matchType}</TableCell>
                          <TableCell className="text-right">
                            ${keyword.spend.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${keyword.sales.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {keyword.acos === Number.POSITIVE_INFINITY
                              ? "∞"
                              : `${keyword.acos.toFixed(2)}%`}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                Use these insights to optimize your campaign. Focus on pausing
                underperforming keywords and increasing bids on high-performing
                ones.
              </AlertDescription>
            </Alert>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
