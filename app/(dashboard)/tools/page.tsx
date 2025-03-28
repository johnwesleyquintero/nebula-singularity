"use client";

import { useState } from "react";
import { ToolsGrid } from "@/components/tools/tools-grid";
import { ToolsSearch } from "@/components/tools/tools-search";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Tools</h1>
          <p className="text-muted-foreground">
            Interactive tools to help you optimize your Amazon business
          </p>
        </div>
        <ToolsSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <ToolsGrid
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
