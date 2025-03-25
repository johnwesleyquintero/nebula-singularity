import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PPCOverview } from "@/components/analytics/ppc-overview"
import { PPCCampaigns } from "@/components/analytics/ppc-campaigns"

export const metadata: Metadata = {
  title: "PPC Analytics | Nebula-Singularity",
  description: "Pay-Per-Click performance tracking for Amazon sellers",
}

export default function PPCAnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">PPC Analytics</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>PPC Performance Overview</CardTitle>
              <CardDescription>Your advertising performance metrics for the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <PPCOverview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Detailed breakdown of your campaign performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <PPCCampaigns />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>Detailed breakdown of your keyword performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Keyword performance data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

