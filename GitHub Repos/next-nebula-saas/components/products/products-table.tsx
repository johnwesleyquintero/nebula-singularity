"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

type Product = {
  id: string
  asin: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  stock: number
  status: "active" | "inactive" | "suppressed"
}

const data: Product[] = [
  {
    id: "1",
    asin: "B07X1KS9D3",
    name: "Wireless Bluetooth Earbuds",
    category: "Electronics",
    price: 49.99,
    rating: 4.5,
    reviews: 1250,
    stock: 85,
    status: "active",
  },
  {
    id: "2",
    asin: "B08F2YD2L4",
    name: "Stainless Steel Water Bottle",
    category: "Kitchen",
    price: 24.95,
    rating: 4.7,
    reviews: 875,
    stock: 120,
    status: "active",
  },
  {
    id: "3",
    asin: "B09H5G9TQZ",
    name: "Yoga Mat with Carrying Strap",
    category: "Sports",
    price: 34.99,
    rating: 4.3,
    reviews: 430,
    stock: 45,
    status: "active",
  },
  {
    id: "4",
    asin: "B07ZTLM8B3",
    name: "LED Desk Lamp with USB Port",
    category: "Home",
    price: 29.99,
    rating: 4.2,
    reviews: 680,
    stock: 0,
    status: "inactive",
  },
  {
    id: "5",
    asin: "B08KGVZN4S",
    name: "Bamboo Cutting Board Set",
    category: "Kitchen",
    price: 39.95,
    rating: 4.6,
    reviews: 520,
    stock: 65,
    status: "active",
  },
  {
    id: "6",
    asin: "B09QFZN8R2",
    name: "Wireless Phone Charger Stand",
    category: "Electronics",
    price: 19.99,
    rating: 3.9,
    reviews: 310,
    stock: 95,
    status: "suppressed",
  },
  {
    id: "7",
    asin: "B07X5KSBFM",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    rating: 4.4,
    reviews: 950,
    stock: 70,
    status: "active",
  },
  {
    id: "8",
    asin: "B08LMVGDM7",
    name: "Resistance Bands Set",
    category: "Sports",
    price: 21.95,
    rating: 4.5,
    reviews: 780,
    stock: 110,
    status: "active",
  },
  {
    id: "9",
    asin: "B09DKXSXPZ",
    name: "Smart WiFi Light Bulbs",
    category: "Home",
    price: 15.99,
    rating: 4.1,
    reviews: 420,
    stock: 0,
    status: "inactive",
  },
  {
    id: "10",
    asin: "B08QVZM6MS",
    name: "Reusable Silicone Food Storage Bags",
    category: "Kitchen",
    price: 18.95,
    rating: 4.3,
    reviews: 340,
    stock: 55,
    status: "active",
  },
]

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "asin",
    header: "ASIN",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("asin")}</div>,
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = Number.parseFloat(row.getValue("rating"))
      return <div className="text-right">{rating.toFixed(1)} ★</div>
    },
  },
  {
    accessorKey: "reviews",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reviews
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const reviews = Number.parseInt(row.getValue("reviews"))
      return <div className="text-right">{reviews.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = Number.parseInt(row.getValue("stock"))
      return (
        <div className="text-right">
          <span className={stock === 0 ? "text-destructive" : ""}>{stock}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="capitalize">
          <span
            className={
              status === "active" ? "text-green-500" : status === "inactive" ? "text-amber-500" : "text-destructive"
            }
          >
            {status}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View product details</DropdownMenuItem>
            <DropdownMenuItem>Edit product</DropdownMenuItem>
            <DropdownMenuItem>View analytics</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete product</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ProductsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter products..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

