"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const accountFormSchema = z.object({
  marketplaces: z.array(z.string()).min(1, {
    message: "You must select at least one marketplace.",
  }),
  twoFactorAuth: z.boolean().default(false),
  dataSharing: z.boolean().default(true),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
  marketplaces: ["us"],
  twoFactorAuth: false,
  dataSharing: true,
}

export function AccountForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: AccountFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Account settings updated successfully!")
      console.log(data)
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="marketplaces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Marketplaces</FormLabel>
              <FormDescription>Select the Amazon marketplaces where you sell products.</FormDescription>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("us")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "us"])
                              : field.onChange(field.value?.filter((value) => value !== "us"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">United States (US)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("ca")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "ca"])
                              : field.onChange(field.value?.filter((value) => value !== "ca"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Canada (CA)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("uk")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "uk"])
                              : field.onChange(field.value?.filter((value) => value !== "uk"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">United Kingdom (UK)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("de")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "de"])
                              : field.onChange(field.value?.filter((value) => value !== "de"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Germany (DE)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("fr")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "fr"])
                              : field.onChange(field.value?.filter((value) => value !== "fr"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">France (FR)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplaces"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value?.includes("it")}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, "it"])
                              : field.onChange(field.value?.filter((value) => value !== "it"))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Italy (IT)</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twoFactorAuth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Two-factor Authentication</FormLabel>
                <FormDescription>Add an extra layer of security to your account.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataSharing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Data Sharing</FormLabel>
                <FormDescription>Allow us to collect anonymous usage data to improve our services.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update account"
          )}
        </Button>
      </form>
    </Form>
  )
}

