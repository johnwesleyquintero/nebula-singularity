console.log('Test file is being executed');
import { signUp, signIn, signOut } from './auth';
import { supabase } from './supabaseClient.ts';

const mockUser = { id: '123', email: 'test@example.com' };

jest.mock('./supabaseClient.ts', () => ({
  supabase: {
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null, user_metadata: {} }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser, user_metadata: {} }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }
}));

describe('Auth functions', () => {
  it('should sign up a user', async () => {
    const user = await signUp('test@example.com', 'password');
    expect(user).toEqual(mockUser);
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign in a user', async () => {
    const user = await signIn('test@example.com', 'password');
    expect(user).toEqual(mockUser);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign out a user', async () => {
    await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});

describe('Auth functions - Error Handling', () => {
  it('should handle sign up error', async () => {
    supabase.auth.signUp.mockRejectedValueOnce(new Error('Sign up failed'));
    await expect(signUp('test@example.com', 'password')).rejects.toThrow('Sign up failed');
  });

  it('should handle sign in error', async () => {
    supabase.auth.signInWithPassword.mockRejectedValueOnce(new Error('Sign in failed'));
    await expect(signIn('test@example.com', 'password')).rejects.toThrow('Sign in failed');
  });

  it('should handle sign out error', async () => {
    supabase.auth.signOut.mockRejectedValueOnce(new Error('Sign out failed'));
    await expect(signOut()).rejects.toThrow('Sign out failed');
  });
});

describe('Auth functions - Success Cases', () => {
  it('should sign up a user successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    supabase.auth.signUp.mockResolvedValueOnce({ data: { user: mockUser }, error: null });
    const user = await signUp('test@example.com', 'password');
    expect(user).toEqual(mockUser);
  });

  it('should sign in a user successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: mockUser }, error: null });
    const user = await signIn('test@example.com', 'password');
    expect(user).toEqual(mockUser);
  });

  it('should sign out a user successfully', async () => {
    supabase.auth.signOut.mockResolvedValueOnce({ error: null });
    await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});

describe('Auth functions - Edge Cases', () => {
  it('should reject empty email in sign up', async () => {
    await expect(signUp('', 'password')).rejects.toThrow('Email and password are required');
  });

  it('should reject empty password in sign in', async () => {
    await expect(signIn('test@example.com', '')).rejects.toThrow('Email and password are required');
  });
});