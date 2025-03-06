/* global global */
/* global beforeEach */
import { describe, it, expect, jest } from '@jest/globals';
import { 
  signUp, 
  signIn, 
  signOut,
  requestPasswordReset,
  resetPassword,
  verifyMFA,
  generateMFARecoveryCodes,
  AuthenticationError,
  PasswordTooWeakError,
  InvalidResetTokenError,
  InvalidMFACodeError,
  MFARequiredError
} from './auth';
import supabase from './supabase';

// Mock console
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Enhanced Supabase mock
jest.mock('./supabase', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    mfa: {
      verify: jest.fn(),
      generateRecoveryCodes: jest.fn()
    }
  }
}));

const mockUser = { id: '123', email: 'test@example.com' };
const mockToken = 'valid-reset-token';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth functions', () => {
  describe('Successful operations', () => {
    it('should sign up a user with valid credentials', async () => {
      supabase.auth.signUp.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });
      
      const user = await signUp('test@example.com', 'password');
      expect(user).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should sign in a user with valid credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });
      
      const user = await signIn('test@example.com', 'password');
      expect(user).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should successfully sign out a user', async () => {
      supabase.auth.signOut.mockResolvedValueOnce({ error: null });
      await signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle sign up error with specific message', async () => {
      const errorMessage = 'Email already in use';
      supabase.auth.signUp.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signUp('test@example.com', 'password'))
        .rejects
        .toThrow(errorMessage);
    });

    it('should handle sign in error with specific message', async () => {
      const errorMessage = 'Invalid login credentials';
      supabase.auth.signInWithPassword.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signIn('test@example.com', 'password'))
        .rejects
        .toThrow(errorMessage);
    });

    it('should handle sign out error with specific message', async () => {
      const errorMessage = 'Network error during sign out';
      supabase.auth.signOut.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(signOut())
        .rejects
        .toThrow(errorMessage);
    });
  });

  describe('Input validation', () => {
    it('should reject sign up with empty email', async () => {
      await expect(signUp('', 'password'))
        .rejects
        .toThrow('Email and password are required');
    });

    it('should reject sign up with empty password', async () => {
      await expect(signUp('test@example.com', ''))
        .rejects
        .toThrow('Email and password are required');
    });

    it('should reject sign in with invalid email format', async () => {
      await expect(signIn('invalid-email', 'password'))
        .rejects
        .toThrow('Invalid email format');
    });
  });
});

describe('Password Reset', () => {
  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ 
        data: { success: true }, 
        error: null 
      });

      const result = await requestPasswordReset('test@example.com');
      expect(result.success).toBe(true);
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw AuthenticationError for invalid email', async () => {
      await expect(requestPasswordReset('invalid-email'))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for Supabase errors', async () => {
      supabase.auth.resetPasswordForEmail.mockRejectedValueOnce(new Error('Reset failed'));
      await expect(requestPasswordReset('test@example.com'))
        .rejects
        .toThrow(AuthenticationError);
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      supabase.auth.updateUser.mockResolvedValueOnce({ 
        data: { user: mockUser }, 
        error: null 
      });

      const user = await resetPassword(mockToken, 'NewPassword123!');
      expect(user).toEqual(mockUser);
    });

    it('should throw InvalidResetTokenError for invalid token', async () => {
      supabase.auth.updateUser.mockRejectedValueOnce(new Error('Invalid token'));
      await expect(resetPassword('invalid-token', 'NewPassword123!'))
        .rejects
        .toThrow(InvalidResetTokenError);
    });

    it('should throw PasswordTooWeakError for invalid password', async () => {
      await expect(resetPassword(mockToken, 'weak'))
        .rejects
        .toThrow(PasswordTooWeakError);
    });
  });
});

describe('MFA functionality', () => {
  describe('verifyMFA', () => {
    it('should successfully verify MFA code', async () => {
      supabase.auth.mfa.verify.mockResolvedValueOnce({ data: { success: true }, error: null });
      const result = await verifyMFA('user123', '123456');
      expect(result.success).toBe(true);
    });

    it('should throw InvalidMFACodeError for invalid code', async () => {
      supabase.auth.mfa.verify.mockRejectedValueOnce(new Error('Invalid code'));
      await expect(verifyMFA('user123', 'invalid'))
        .rejects
        .toThrow(InvalidMFACodeError);
    });
  });

  describe('generateMFARecoveryCodes', () => {
    it('should generate recovery codes successfully', async () => {
      const mockCodes = ['code1', 'code2', 'code3'];
      supabase.auth.mfa.generateRecoveryCodes.mockResolvedValueOnce({ data: mockCodes, error: null });
      const codes = await generateMFARecoveryCodes('user123');
      expect(codes).toEqual(mockCodes);
    });

    it('should throw AuthenticationError for generation failure', async () => {
      supabase.auth.mfa.generateRecoveryCodes.mockRejectedValueOnce(new Error('Generation failed'));
      await expect(generateMFARecoveryCodes('user123'))
        .rejects
        .toThrow(AuthenticationError);
    });
  });

  describe('Sign in with MFA', () => {
    it('should require MFA code for enabled users', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: { ...mockUser, mfa_enabled: true } }, 
        error: null 
      });
      await expect(signIn('test@example.com', 'Password123!'))
        .rejects
        .toThrow(MFARequiredError);
    });

    it('should successfully sign in with valid MFA code', async () => {
      supabase.auth.signInWithPassword.mockResolvedValueOnce({ 
        data: { user: { ...mockUser, mfa_enabled: true } }, 
        error: null 
      });
      supabase.auth.mfa.verify.mockResolvedValueOnce({ data: { success: true }, error: null });
      const user = await signIn('test@example.com', 'Password123!', '123456');
      expect(user).toEqual({ ...mockUser, mfa_enabled: true });
    });
  });
});

describe('Rate Limiting', () => {
  let mockSuccessResponse;

  beforeEach(() => {
    mockSuccessResponse = { success: true };
  });

  it('should allow requests within rate limit', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ 
      data: { user: mockUser }, 
      error: null 
    });

    // Test multiple requests within limit
    for (let i = 0; i < 5; i++) {
      await expect(signIn('test@example.com', 'Password123!'))
        .resolves
        .toBeDefined();
    }
  });

  it('should throw AuthenticationError when rate limit is exceeded', async () => {
    // Exceed rate limit
    for (let i = 0; i < 6; i++) {
      if (i < 5) {
        await signIn('test@example.com', 'Password123!');
      } else {
        await expect(signIn('test@example.com', 'Password123!'))
          .rejects
          .toThrow(AuthenticationError);
      }
    }
  });
});

describe('Edge Cases', () => {
  it('should handle network errors during email validation', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    await expect(signUp('test@example.com', 'ValidPassword123!'))
      .resolves
      .toBeDefined();
  });

  it('should handle invalid MFA code format', async () => {
    await expect(verifyMFA('user123', 'invalid-code'))
      .rejects
      .toThrow(InvalidMFACodeError);
  });

  it('should handle expired password reset tokens', async () => {
    supabase.auth.updateUser.mockRejectedValueOnce(new Error('Token expired'));
    await expect(resetPassword('expired-token', 'NewPassword123!'))
      .rejects
      .toThrow(InvalidResetTokenError);
  });
});
