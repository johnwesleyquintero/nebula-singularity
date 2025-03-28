import { z } from "zod";

// Common validation patterns
export const validationPatterns = {
  // Basic patterns
  required: (field: string) =>
    z.string().min(1, { message: `${field} is required.` }),
  optional: (maxLength: number) => z.string().max(maxLength).optional(),
  email: z.string().email("Please enter a valid email address."),
  url: z.string().url("Please enter a valid URL."),

  // Number validations
  positiveNumber: z.number().min(0, "Value must be positive."),
  integerOnly: z.number().int("Value must be an integer."),
  percentage: z
    .number()
    .min(0)
    .max(100, "Percentage must be between 0 and 100."),

  // Phone number validation
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."),

  // Currency validation
  currency: z
    .number()
    .min(0, "Amount must be positive.")
    .transform((val) => Number(val.toFixed(2))),

  // Date validations
  pastDate: z.date().max(new Date(), "Date must be in the past."),
  futureDate: z.date().min(new Date(), "Date must be in the future."),

  // Array validations
  nonEmptyArray: <T>(schema: z.ZodType<T>) =>
    z.array(schema).min(1, "At least one item is required."),
  uniqueArray: <T>(schema: z.ZodType<T>) =>
    z.array(schema).refine((items) => new Set(items).size === items.length, {
      message: "All items must be unique.",
    }),

  // Custom validations
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
};

// Validation helper functions
export const validationHelpers = {
  isValidEmail: (email: string) =>
    validationPatterns.email.safeParse(email).success,
  isValidPhone: (phone: string) =>
    validationPatterns.phoneNumber.safeParse(phone).success,
  isValidUrl: (url: string) => validationPatterns.url.safeParse(url).success,
  isValidCurrency: (amount: number) =>
    validationPatterns.currency.safeParse(amount).success,
  isValidPassword: (password: string) =>
    validationPatterns.password.safeParse(password).success,
};
