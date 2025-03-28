"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useSupabase } from "@/hooks/use-supabase";

import {
  profileFormSchema,
  type ProfileFormValues,
  profileFormDefaults,
} from "@/config/forms";

export function ProfileForm() {
  const { isLoading, handleSubmit } = useFormSubmit({
    successMessage: "Profile updated successfully!",
    errorMessage: "Failed to update profile",
  });
  const { updateRecord } = useSupabase({ tableName: "users" });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profileFormDefaults,
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (data: ProfileFormValues) => {
    await updateRecord(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormDescription>
                This is the email address associated with your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
              </FormControl>
              <FormDescription>Your company or business name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 160 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" isLoading={isLoading}>
          Update profile
        </LoadingButton>
      </form>
    </Form>
  );
}
