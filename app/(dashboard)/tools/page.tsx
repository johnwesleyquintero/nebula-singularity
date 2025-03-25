import type { Metadata } from "next"
import { ToolsGrid } from "@/components/tools/tools-grid"

export const metadata: Metadata = {
  title: "Free Tools | Nebula-Suite",
  description: "Interactive tools to help Amazon sellers optimize their business",
}

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Free Tools</h1>
          <p className="text-muted-foreground">Interactive tools to help you optimize your Amazon business</p>
        </div>
      </div>
      <ToolsGrid />
    </div>
  )
}

