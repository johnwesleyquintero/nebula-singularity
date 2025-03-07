export const validateEnv = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing Supabase configuration in environment variables');
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('Missing NextAuth secret in environment variables');
  }
};