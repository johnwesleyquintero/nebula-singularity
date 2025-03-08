import * as React from "react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

// Pagination component for navigation
interface PaginationProps extends React.ComponentProps<"nav"> {
  className?: string;
}

const Pagination = React.forwardRef<
  HTMLElement,
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
Pagination.displayName = "Pagination";
Pagination.defaultProps = {
  className: "",
};

// PaginationContent component for wrapping pagination items
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
PaginationContent.displayName = "PaginationContent";
PaginationContent.defaultProps = {
  className: "",
};

// PaginationItem component for individual pagination items
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem";
PaginationItem.defaultProps = {
  className: "",
};

// Combined PaginationLinkProps interface
interface PaginationLinkProps extends React.ComponentProps<"a"> {
  size?: "default" | "sm" | "lg" | "icon" | null;
  isActive?: boolean;
}

// PaginationLink component for pagination links
const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ isActive, size = "icon", ...props }, ref) => {
  return (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      props.className
    )}
    ref={ref}
    {...props}
  />
  )
})
PaginationLink.displayName = "PaginationLink";
PaginationLink.defaultProps = {
  size: "icon"
};

// PaginationPrevious component for previous page link
const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({  ...props }, ref) => {
  return (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5")}
    ref={ref}
    {...props}
  />
  )
})
PaginationPrevious.displayName = "PaginationPrevious";
PaginationPrevious.defaultProps = {
}; // Add a semicolon here

// PaginationNext component for next page link
const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({  ...props }, ref) => {
  return (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5")}
    ref={ref}
    {...props}
  />
  )
})
PaginationNext.displayName = "PaginationNext";
PaginationNext.defaultProps = {
};

// PaginationEllipsis component for ellipsis in pagination
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    ref={ref}
    {...props}
  />
))
PaginationEllipsis.displayName = "PaginationEllipsis";
PaginationEllipsis.defaultProps = {
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
