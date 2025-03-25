import type { Metadata } from "next"
import { ProductsTable } from "@/components/products/products-table"

export const metadata: Metadata = {
  title: "Products | Nebula-Singularity",
  description: "Product management and insights for Amazon sellers",
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      </div>
      <ProductsTable />
    </div>
  )
}

