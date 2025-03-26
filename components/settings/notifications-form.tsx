"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useFormSubmit } from "@/hooks/use-form-submit"
import { FormToggleField } from "@/components/ui/form-toggle-field"
import { FormRadioGroup } from "@/components/ui/form-radio-group"
import { Form } from "@/components/ui/form"
import { LoadingButton } from "@/components/ui/loading-button"

import { notificationsFormSchema, type NotificationsFormValues, notificationsFormDefaults } from "@/config/forms"

export function NotificationsForm() {
  const { isLoading, handleSubmit } = useFormSubmit({
    successMessage: "Notification preferences updated successfully!",
    simulateDelay: true
  })

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: notificationsFormDefaults,
    mode: "onChange",
  })

  const onSubmit = handleSubmit(async (data: NotificationsFormValues) => {
    console.log(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormToggleField
            control={form.control}
            name="emailNotifications"
            label="Email Notifications"
            description="Receive notifications via email."
          />
          <FormToggleField
            control={form.control}
            name="pushNotifications"
            label="Push Notifications"
            description="Receive notifications via browser push notifications."
          />
          <FormToggleField
            control={form.control}
            name="marketingEmails"
            label="Marketing Emails"
            description="Receive emails about new features and promotions."
          />
        </div>

        <FormRadioGroup
          control={form.control}
          name="notificationFrequency"
          label="Notification Frequency"
          description="Choose how often you want to receive notification digests."
          options={[
            { value: "immediate", label: "Immediate" },
            { value: "daily", label: "Daily Digest" },
            { value: "weekly", label: "Weekly Digest" }
          ]}
        />

        <LoadingButton type="submit" isLoading={isLoading}>
          Update preferences
        </LoadingButton>
      </form>
    </Form>
  )
}

