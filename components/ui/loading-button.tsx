import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ButtonProps } from "@radix-ui/react-button"

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = "Updating...",
  ...props 
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}