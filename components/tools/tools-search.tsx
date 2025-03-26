"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export function ToolsSearch({ searchQuery, onSearchChange, selectedCategory, onCategoryChange }: ToolsSearchProps) {
  // ... existing component implementation ...
}

type ToolsSearchProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

const categories = [
  { value: "all", label: "All Tools" },
  { value: "pricing", label: "Pricing & Profitability" },
  { value: "keywords", label: "Keywords & SEO" },
  { value: "listings", label: "Listings & Content" },
  { value: "analytics", label: "Analytics & Performance" },
]

export function ToolsSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ToolsSearchProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex-1">
        <Label htmlFor="search-tools" className="sr-only">
          Search tools
        </Label>
        <Input
          id="search-tools"
          type="search"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          aria-label="Search tools"
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Label htmlFor="category-select" className="sr-only">
          Filter by category
        </Label>
        <Select
          id="category-select"
          value={selectedCategory}
          onValueChange={onCategoryChange}
          aria-label="Filter tools by category"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}