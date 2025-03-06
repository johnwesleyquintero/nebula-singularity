import * as React from "react"
import { cn } from "@/lib/utils"
import PropTypes from 'prop-types';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

Table.defaultProps = {
  className: "",
}

Table.propTypes = {
  className: PropTypes.string,
};

interface TableHeaderProps extends React.ComponentProps<"thead"> {
  className?: string;
}

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

TableHeader.defaultProps = {
  className: "",
}

TableHeader.propTypes = {
  className: PropTypes.string,
};

interface TableBodyProps extends React.ComponentProps<"tbody"> {
  className?: string;
}

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

TableBody.defaultProps = {
  className: "",
}

TableBody.propTypes = {
  className: PropTypes.string,
};

interface TableFooterProps extends React.ComponentProps<"tfoot"> {
  className?: string;
}

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
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

TableFooter.defaultProps = {
  className: "",
}

TableFooter.propTypes = {
  className: PropTypes.string,
};

interface TableRowProps extends React.ComponentProps<"tr"> {
  className?: string;
}

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  TableRowProps
>(({ className, ...props }, ref) => (
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

TableRow.defaultProps = {
  className: "",
}

TableRow.propTypes = {
  className: PropTypes.string,
};

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, ...props }, ref) => (
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

TableHead.defaultProps = {
  className: "",
}

TableHead.propTypes = {
  className: PropTypes.string,
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  TableCellProps
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

TableCell.defaultProps = {
  className: "",
}

TableCell.propTypes = {
  className: PropTypes.string,
};

interface TableCaptionProps extends React.ComponentProps<"caption"> {
  className?: string;
}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

TableCaption.defaultProps = {
  className: "",
}

TableCaption.propTypes = {
  className: PropTypes.string,
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
