"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const apiKeysFormSchema = z.object({
  clientId: z.string().min(1, {
    message: "Client ID is required.",
  }),
  clientSecret: z.string().min(1, {
    message: "Client Secret is required.",
  }),
  refreshToken: z.string().min(1, {
    message: "Refresh Token is required.",
  }),
})

type ApiKeysFormValues = z.infer<typeof apiKeysFormSchema>

const defaultValues: Partial<ApiKeysFormValues> = {
  clientId: "",
  clientSecret: "",
  refreshToken: "",
}

export function ApiKeysForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [hasKeys, setHasKeys] = useState(false)

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ApiKeysFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setHasKeys(true)
      toast.success("API keys saved successfully!")
      console.log(data)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {hasKeys ? (
        <Card>
          <CardHeader>
            <CardTitle>Amazon SP-API Credentials</CardTitle>
            <CardDescription>Your Amazon Selling Partner API credentials are securely stored.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-medium">Client ID:</div>
                <div className="col-span-2 font-mono text-sm">
                  {showSecrets
                    ? "AMZN.OAuth.12345678-1234-1234-1234-123456789012"
                    : "••••••••••••••••••••••••••••••••••••••••••"}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-medium">Client Secret:</div>
                <div className="col-span-2 font-mono text-sm">
                  {showSecrets
                    ? "amzn.1.12345678-1234-1234-1234-123456789012"
                    : "••••••••••••••••••••••••••••••••••••••••••"}
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="font-medium">Refresh Token:</div>
                <div className="col-span-2 font-mono text-sm">
                  {showSecrets ? "Atzr|IwEBIFVf..." : "••••••••••••••••••••••••••••••••••••••••••"}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowSecrets(!showSecrets)}>
              {showSecrets ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide Credentials
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show Credentials
                </>
              )}
            </Button>
            <Button variant="default" onClick={() => setHasKeys(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Update Credentials
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="AMZN.OAuth.12345678-1234-1234-1234-123456789012" {...field} />
                  </FormControl>
                  <FormDescription>Your Amazon SP-API Client ID.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input
                      type={showSecrets ? "text" : "password"}
                      placeholder="amzn.1.12345678-1234-1234-1234-123456789012"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your Amazon SP-API Client Secret.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="refreshToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refresh Token</FormLabel>
                  <FormControl>
                    <Input type={showSecrets ? "text" : "password"} placeholder="Atzr|IwEBIFVf..." {...field} />
                  </FormControl>
                  <FormDescription>Your Amazon SP-API Refresh Token.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={() => setShowSecrets(!showSecrets)}>
                {showSecrets ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save API Keys"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      <div className="rounded-md bg-muted p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-muted-foreground">
              Your API credentials are encrypted and securely stored. We never share your credentials with third
              parties.
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a href="#" className="text-primary hover:underline">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

