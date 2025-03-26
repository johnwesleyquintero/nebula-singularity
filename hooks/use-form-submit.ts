import { useState } from "react"
import { toast } from "sonner"

export interface FormSubmitOptions {
  successMessage?: string
  errorMessage?: string
  simulateDelay?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useFormSubmit(options: FormSubmitOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (callback: (data: any) => Promise<any>) => {
    return async (data: any) => {
      setIsLoading(true)
      try {
        if (options.simulateDelay) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        await callback(data)
        
        if (options.successMessage) {
          toast.success(options.successMessage)
        }
        
        options.onSuccess?.(data)
      } catch (error) {
        console.error(error)
        toast.error(options.errorMessage || "An error occurred")
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return {
    isLoading,
    handleSubmit
  }
}