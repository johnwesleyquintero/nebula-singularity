import { supabase } from './supabaseClient';
import { toast } from 'sonner';

// Define types for authentication
export interface AuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  role?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt?: number;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Password validation
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_AUTH_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const isRateLimited = (email: string): boolean => {
  const now = Date.now();
  const attempt = authAttempts.get(email);
  
  if (!attempt) {
    authAttempts.set(email, { count: 1, timestamp: now });
    return false;
  }
  
  // Reset attempts if lockout period has passed
  if (now - attempt.timestamp > LOCKOUT_DURATION) {
    authAttempts.set(email, { count: 1, timestamp: now });
    return false;
  }
  
  // Check if max attempts reached
  if (attempt.count >= MAX_AUTH_ATTEMPTS) {
    return true;
  }
  
  // Increment attempt count
  authAttempts.set(email, { count: attempt.count + 1, timestamp: attempt.timestamp });
  return false;
};

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  metadata?: { name?: string; role?: string }
): Promise<{ user: AuthUser | null; error: AuthError | null }> => {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return {
        user: null,
        error: { message: passwordValidation.message || 'Invalid password' }
      };
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    if (!data.user) {
      return { user: null, error: { message: 'Sign up failed' } };
    }

    // Transform user data to our AuthUser format
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      email_verified: data.user.email_confirmed_at !== null,
      role: data.user.user_metadata?.role
    };

    return { user: authUser, error: null };
  } catch (err: any) {
    return { user: null, error: { message: err.message || 'Sign up failed' } };
  }
};

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: AuthUser | null; session: AuthSession | null; error: AuthError | null }> => {
  try {
    // Check account lock status
    const { data: existingUser } = await supabase
      .from('users')
      .select('failed_attempts, last_failed_at')
      .eq('email', email)
      .single();

    if (existingUser?.failed_attempts >= 5) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      const timeSinceLock = Date.now() - new Date(existingUser.last_failed_at).getTime();
      
      if (timeSinceLock < lockDuration) {
        return {
          user: null,
          session: null,
          error: { message: 'Account locked. Try again later.', status: 429 }
        };
      }
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Update failed attempts
      await supabase
        .from('users')
        .update({
          failed_attempts: (existingUser?.failed_attempts || 0) + 1,
          last_failed_at: new Date().toISOString()
        })
        .eq('email', email);

      if ((existingUser?.failed_attempts || 0) + 1 >= 5) {
        return {
          user: null,
          session: null,
          error: { message: 'Too many failed attempts. Account locked for 15 minutes.', status: 429 }
        };
      }

      return { 
        user: null, 
        session: null, 
        error: { message: error.message } 
      };
    }

    if (!data.user || !data.session) {
      return { 
        user: null, 
        session: null, 
        error: { message: 'Sign in failed' } 
      };
    }

    // Check if email is verified
    if (!data.user.email_confirmed_at) {
      return {
        user: null,
        session: null,
        error: { 
          message: 'Please verify your email before signing in',
          status: 403
        }
      };
    }

    // Transform user data to our AuthUser format
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      email_verified: data.user.email_confirmed_at !== null,
      role: data.user.user_metadata?.role
    };

    // Transform session data
    const authSession: AuthSession = {
      user: authUser,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at
    };

    // Reset failed attempts on success
    await supabase
      .from('users')
      .update({ failed_attempts: 0 })
      .eq('email', email);

    return { user: authUser, session: authSession, error: null };
  } catch (err: any) {
    return { 
      user: null, 
      session: null, 
      error: { message: err.message || 'Sign in failed' } 
    };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err: any) {
    return { error: { message: err.message || 'Sign out failed' } };
  }
};

// Get current session
export const getSession = async (): Promise<{ session: AuthSession | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { session: null, error: { message: error.message } };
    }
    
    if (!data.session || !data.session.user) {
      return { session: null, error: null };
    }
    
    const user = data.session.user;
    
    // Transform to our AuthUser format
    const authUser: AuthUser = {
      id: user.id,
      email: user.email || '',
      email_verified: user.email_confirmed_at !== null,
      role: user.user_metadata?.role
    };
    
    // Transform to our AuthSession format
    const authSession: AuthSession = {
      user: authUser,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at
    };
    
    return { session: authSession, error: null };
  } catch (err: any) {
    return { session: null, error: { message: err.message || 'Failed to get session' } };
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err: any) {
    return { error: { message: err.message || 'Failed to send password reset email' } };
  }
};

// Update user password
export const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { error: { message: passwordValidation.message || 'Invalid password' } };
    }
    
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err: any) {
    return { error: { message: err.message || 'Failed to update password' } };
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    if (error) {
      return { error: { message: error.message } };
    }
    return { error: null };
  } catch (err: any) {
    return { error: { message: err.message || 'Failed to send verification email' } };
  }
};

// OAuth sign in
export const signInWithProvider = async (provider: 'github' | 'google' | 'facebook'): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (err: any) {
    return { error: { message: err.message || `Failed to sign in with ${provider}` } };
  }
};

// Set up auth state change listener
export const onAuthStateChange = (callback: (session: AuthSession | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const user = session.user;
      
      // Transform to our AuthUser format
      const authUser: AuthUser = {
        id: user.id,
        email: user.email || '',
        email_verified: user.email_confirmed_at !== null,
        role: user.user_metadata?.role
      };
      
      // Transform to our AuthSession format
      const authSession: AuthSession = {
        user: authUser,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at
      };
      
      callback(authSession);
    } else {
      callback(null);
    }
  });
  
  return data.subscription;
};