import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const registerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['seller', 'agency', 'consultant'])
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const newsletterFormSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const reportFilterSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(z.string()).min(1, 'Please select at least one metric')
}).refine((data) => data.startDate <= data.endDate, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate']
});

export const apiKeyFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  expiresAt: z.date().optional(),
  permissions: z.array(z.string()).min(1, 'Please select at least one permission')
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;
export type ReportFilterData = z.infer<typeof reportFilterSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeyFormSchema>;