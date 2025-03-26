"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useFormSubmit } from "@/hooks/use-form-submit"
import { FormToggleField } from "@/components/ui/form-toggle-field"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/ui/loading-button"
import { MarketplaceToggle } from "@/components/ui/marketplace-toggle"
import { marketplaces } from "@/config/marketplaces"

import { accountFormSchema, type AccountFormValues, accountFormDefaults } from "@/config/forms"

export function AccountForm() {
  const { isLoading, handleSubmit } = useFormSubmit({
    successMessage: "Account settings updated successfully!",
    simulateDelay: true
  })

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: accountFormDefaults,
    mode: "onChange",
  })

  const onSubmit = handleSubmit(async (data: AccountFormValues) => {
    console.log(data)
  })

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
                {marketplaces.map((marketplace) => (
                  <MarketplaceToggle
                    key={marketplace.id}
                    control={form.control}
                    marketplaceId={marketplace.id}
                    marketplaceName={marketplace.name}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormToggleField
          control={form.control}
          name="twoFactorAuth"
          label="Two-factor Authentication"
          description="Add an extra layer of security to your account."
        />
        <FormToggleField
          control={form.control}
          name="dataSharing"
          label="Data Sharing"
          description="Allow us to collect anonymous usage data to improve our services."
        />
        <LoadingButton type="submit" isLoading={isLoading}>
          Update account
        </LoadingButton>
      </form>
    </Form>
  )
}

