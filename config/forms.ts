import * as z from "zod";

// Common validation patterns
export const emailSchema = z
  .string()
  .min(1, { message: "This field is required." })
  .email("This is not a valid email.");
export const requiredString = (field: string) =>
  z.string().min(1, { message: `${field} is required.` });
export const optionalString = (maxLength: number) =>
  z.string().max(maxLength).optional();

// Profile form schema and defaults
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  email: emailSchema,
  bio: optionalString(160),
  company: optionalString(50),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const profileFormDefaults: Partial<ProfileFormValues> = {
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Amazon seller specializing in home goods and kitchen products.",
  company: "Home Essentials LLC",
};

// Notifications form schema and defaults
export const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(true),
  notificationFrequency: z.enum(["immediate", "daily", "weekly"], {
    required_error: "You need to select a notification frequency.",
  }),
});

export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export const notificationsFormDefaults: Partial<NotificationsFormValues> = {
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: true,
  notificationFrequency: "daily",
};

// Account form schema and defaults
export const accountFormSchema = z.object({
  marketplaces: z.array(z.string()).min(1, {
    message: "You must select at least one marketplace.",
  }),
  twoFactorAuth: z.boolean().default(false),
  dataSharing: z.boolean().default(true),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const accountFormDefaults: Partial<AccountFormValues> = {
  marketplaces: ["us"],
  twoFactorAuth: false,
  dataSharing: true,
};
