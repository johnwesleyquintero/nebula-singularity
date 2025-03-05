import { signUp, signIn, signOut } from './auth';
import * as supabaseClient from './supabaseClient';

jest.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('Auth functions', () => {
  it('should sign up a user', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ user: { id: '123' }, error: null });
    supabaseClient.supabase.auth.signUp = mockSignUp;

    const user = await signUp('test@example.com', 'password');
    expect(user).toEqual({ id: '123' });
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign in a user', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ user: { id: '123' }, error: null });
    supabaseClient.supabase.auth.signIn = mockSignIn;

    const user = await signIn('test@example.com', 'password');
    expect(user).toEqual({ id: '123' });
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should sign out a user', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    supabaseClient.supabase.auth.signOut = mockSignOut;

    await signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });
});