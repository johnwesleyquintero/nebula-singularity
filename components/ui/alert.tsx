import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Alert component variants
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Alert component props
 */
interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /**
   * The content of the alert
   */
  children: React.ReactNode
  /**
   * The variant of the alert
   */
  variant?: 'default' | 'destructive'
  /**
   * Custom class name
   */
  className?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, children, ...props }, ref) => {
  if (!children) {
    throw new Error('Alert component requires children')
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
Alert.displayName = "Alert"

Alert.defaultProps = {
  variant: 'default',
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertTitle = React.forwardRef<HTMLParagraphElement, AlertTitleProps>(({ className, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
})
AlertTitle.displayName = "AlertTitle"

AlertTitle.defaultProps = {
  className: "default-title-class",
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
})
AlertDescription.displayName = "AlertDescription"

AlertDescription.defaultProps = {
  className: "default-description-class",
}

export { Alert, AlertTitle, AlertDescription }
