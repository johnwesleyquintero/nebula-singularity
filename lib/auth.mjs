import fetch from 'node-fetch';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import supabase from './supabase';

/* global console */
/* global process */

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class EmailAlreadyInUseError extends AuthenticationError {}
class InvalidCredentialsError extends AuthenticationError {}
class PasswordTooWeakError extends AuthenticationError {}
class InvalidResetTokenError extends AuthenticationError {}
class MFARequiredError extends AuthenticationError {}
class InvalidMFACodeError extends AuthenticationError {}

const emailSchema = z.string()
  .email({ message: "Invalid email format" })
  .min(5, { message: "Email must be at least 5 characters" })
  .max(254, { message: "Email must be at most 254 characters" })
  .refine(async (email) => {
    try {
      const response = await fetch(`https://disposable.debounce.io/?email=${email}`);
      if (!response.ok) {
        return true; // Allow email if API fails
      }
      const data = await response.json();
      return data.disposable === 'false';
    } catch (error) {
      console.error("Error checking disposable email:", error);
      return true; // Allow email if API fails
    }
  }, {
    message: 'Disposable email addresses are not allowed'
  });

const passwordSchema = z.string()
  .min(8)
  .max(50)
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character');

const mfaCodeSchema = z.string()
  .length(6, { message: 'MFA code must be exactly 6 digits' })
  .regex(/^[0-9]+$/, { message: 'MFA code must contain only numbers' });

const ratelimit = new Ratelimit({
  redis: process.env.REDIS_URL,
  limiter: Ratelimit.slidingWindow(5, '1 m')
});

async function verifyMFA(userId, code) {
  try {
    await mfaCodeSchema.parseAsync(code);
    const { data, error } = await supabase.auth.mfa.verify(userId, code);

    if (error) {
      throw new InvalidMFACodeError(`MFA verification failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw new InvalidMFACodeError(error.message);
  }
}


export async function signUp(email, password) {
  try {
    await ratelimit.limit('signUp');
    await emailSchema.parseAsync(email);
    await passwordSchema.parseAsync(password);
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      if (error.message.includes('already exists')) {
        throw new EmailAlreadyInUseError('Email already in use');
      } else {
        throw new AuthenticationError(`Sign up failed: ${error.message}`);
      }
    }

    return data.user;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new PasswordTooWeakError(error.message);
    } else {
      throw new AuthenticationError(error.message);
    }
  }
}

export async function signIn(email, password, mfaCode) {
  try {
    await ratelimit.limit('signIn');
    await emailSchema.parseAsync(email);
    await passwordSchema.parseAsync(password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new InvalidCredentialsError(`Sign in failed: ${error.message}`);
    }

    if (data.user.mfa_enabled && !mfaCode) {
      throw new MFARequiredError('MFA code required');
    }

    if (mfaCode) {
      await verifyMFA(data.user.id, mfaCode);
    }

    return data.user;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new PasswordTooWeakError(error.message);
    } else {
      throw new AuthenticationError(error.message);
    }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new AuthenticationError(`Sign out failed: ${error.message}`);
  }
}

export async function requestPasswordReset(email) {
  try {
    await ratelimit.limit('requestPasswordReset');
    await emailSchema.parseAsync(email);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new AuthenticationError(`Password reset failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
}

export async function resetPassword(token, newPassword) {
  try {
    await ratelimit.limit('resetPassword');
    await passwordSchema.parseAsync(newPassword);
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    }, {
      auth: {
        refreshToken: token
      }
    });

    if (error) {
      if (error.message.includes('expired')) {
        throw new InvalidResetTokenError('Password reset token has expired');
      }
      throw new InvalidResetTokenError(`Password reset failed: ${error.message}`);
    }

    return data.user;
  } catch (error) {
    throw new InvalidResetTokenError(error.message);
  }
}
