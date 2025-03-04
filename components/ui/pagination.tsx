import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

interface PaginationProps extends React.ComponentProps<"nav"> {
  className?: string;
}

const Pagination = React.forwardRef<
  HTMLNavElement,
  PaginationProps
>(({ className, ...props }, ref) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    ref={ref}
    {...props}
  />
))
Pagination.displayName = "Pagination"
Pagination.defaultProps = {
  className: "",
}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"
PaginationContent.defaultProps = {
  className: "",
}

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"
PaginationItem.defaultProps = {
  className: "",
}

interface PaginationLinkProps extends Pick<ButtonProps, "size"> {
  isActive?: boolean;
} & React.ComponentProps<"a">

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ className, isActive, size = "icon", ...props }, ref) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    ref={ref}
    {...props}
  />
))
PaginationLink.displayName = "PaginationLink"
PaginationLink.defaultProps = {
  className: "",
  size: "icon",
}

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    ref={ref}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
))
PaginationPrevious.displayName = "PaginationPrevious"
PaginationPrevious.defaultProps = {
  className: "",
}

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof PaginationLink>
>(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    ref={ref}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
))
PaginationNext.displayName = "PaginationNext"
PaginationNext.defaultProps = {
  className: "",
}

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    ref={ref}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
))
PaginationEllipsis.displayName = "PaginationEllipsis"
PaginationEllipsis.defaultProps = {
  className: "",
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
