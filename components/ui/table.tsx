import * as React from "react"
import {
  HTMLTableElement,
  HTMLTableSectionElement,
  HTMLTableRowElement,
  HTMLTableCellElement,
  HTMLTableCaptionElement
} from 'react';
import { cn } from "@/lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className = "", ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

interface TableHeaderProps extends React.ComponentProps<"thead"> {
  className?: string;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className = "", ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

interface TableBodyProps extends React.ComponentProps<"tbody"> {
  className?: string;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

interface TableFooterProps extends React.ComponentProps<"tfoot"> {
  className?: string;
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className = "", ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

interface TableRowProps extends React.ComponentProps<"tr"> {
  className?: string;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className = "", ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

interface TableCaptionProps extends React.ComponentProps<"caption"> {
  className?: string;
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className = "", ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
