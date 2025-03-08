const envSchema = z.object({
  SUPABASE_URL: z.string().min(1),
  SUPABASE_KEY: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().length(32),
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
}).refine(data => data.ENCRYPTION_KEY.length === 32, {
  message: 'ENCRYPTION_KEY must be exactly 32 characters long',
  path: ['ENCRYPTION_KEY']
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorMessages = parsed.error.errors
    .map(err => `- ${err.path.join('.')}: ${err.message}`)
    .join('\n');
  console.error('❌ Invalid environment variables:\n', errorMessages);
  process.exit(1);
}

export const env = Object.freeze(parsed.data);