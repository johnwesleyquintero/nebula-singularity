"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Report = {
  id: string
  name: string
  type: "sales" | "inventory" | "ppc" | "custom"
  format: "csv" | "pdf"
  dateCreated: string
  size: string
}

const reports: Report[] = [
  {
    id: "1",
    name: "Monthly Sales Report - June 2023",
    type: "sales",
    format: "csv",
    dateCreated: "2023-07-01",
    size: "1.2 MB",
  },
  {
    id: "2",
    name: "Inventory Status Report",
    type: "inventory",
    format: "csv",
    dateCreated: "2023-06-28",
    size: "850 KB",
  },
  {
    id: "3",
    name: "PPC Performance Q2 2023",
    type: "ppc",
    format: "pdf",
    dateCreated: "2023-06-30",
    size: "2.4 MB",
  },
  {
    id: "4",
    name: "Custom Product Analysis",
    type: "custom",
    format: "csv",
    dateCreated: "2023-06-25",
    size: "1.8 MB",
  },
  {
    id: "5",
    name: "Weekly Sales Summary",
    type: "sales",
    format: "csv",
    dateCreated: "2023-06-24",
    size: "720 KB",
  },
]

export function ReportsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReports = reports.filter((report) => report.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case "inventory":
        return <FileSpreadsheet className="h-4 w-4 text-blue-500" />
      case "ppc":
        return <FileText className="h-4 w-4 text-amber-500" />
      case "custom":
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full appearance-none pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      <span>{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{report.type}</TableCell>
                  <TableCell className="uppercase">{report.format}</TableCell>
                  <TableCell>{formatDate(report.dateCreated)}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Share report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

