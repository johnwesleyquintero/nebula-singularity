/* global console */
import { supabase } from './supabaseClient.ts';

// Sign Up
export const signUp = async (email, password) => {
  if (!email || !password) {
    console.error('Email and password are required');
    throw new Error('Email and password are required');
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user; // Return the user data
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user; // Return the user data
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
