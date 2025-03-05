import { supabase } from './supabaseClient';

// Sign Up
export const signUp = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required');
    throw new Error('Email and password are required');
  }

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Supabase sign up error:', error.message);
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('Error during sign up:', error.message);
    throw error;
  }
};

// Sign In
export const signIn = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required');
    throw new Error('Email and password are required');
  }

  try {
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      console.error('Supabase sign in error:', error.message);
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('Error during sign in:', error.message);
    throw error;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign out error:', error.message);
      throw error;
    }
    
  } catch (error) {
    console.error('Error during sign out:', error.message);
    throw error;
  }
};
