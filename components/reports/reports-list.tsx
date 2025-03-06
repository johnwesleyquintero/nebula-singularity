"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileText, MoreHorizontal, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
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

const ITEMS_PER_PAGE = 5

export function ReportsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const filteredReports = reports.filter((report) => report.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedReports = filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleDownload = async (report: Report) => {
    try {
      setIsLoading(true)
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Downloaded ${report.name}`)
    } catch (error) {
      toast.error('Failed to download report')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (report: Report) => {
    try {
      setIsLoading(true)
      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Deleted ${report.name}`)
    } catch (error) {
      toast.error('Failed to delete report')
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="flex items-center justify-between py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
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
            {paginatedReports.length > 0 ? (
              paginatedReports.map((report) => (
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(report)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="sr-only">Download</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isLoading}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Share report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(report)}
                          >
                            Delete report
                          </DropdownMenuItem>
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

