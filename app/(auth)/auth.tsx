import React, { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signUp, signIn, signOut } from '../../lib/auth';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { supabase } from '../../lib/supabaseClient';

// Removed unused Session import

interface AuthError {
  message: string;
}

const AuthPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  // Effect to check for existing session and redirect to dashboard
  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('User is logged in:', session.user);
        router.push('/dashboard'); // Redirect to dashboard if user is already logged in
      }
    });

    // Set up a listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('User signed in:', session.user);
        router.push('/dashboard'); // Redirect to dashboard on sign-in
      } else {
        console.log('User signed out');
      }
    });

    // Clean up the subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Handles form submission for sign-up and sign-in
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up the user
        const { error } = await signUp({ email, password });
        if (error) {
          throw error;
        } else {
          // Show success toast and redirect to dashboard
          toast({
            title: 'Sign up successful!',
            description: 'Please check your email to verify.',
          });
          router.push('/dashboard');
        }
      } else {
        // Sign in the user
        const { error } = await signIn({ email, password });
        if (error) {
          throw error;
        } else {
          // Show success toast and redirect to dashboard
          toast({
            title: 'Sign in successful!',
            description: 'Welcome back!',
          });
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      // Handle authentication errors
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
        <button
          className="mt-4 text-sm text-blue-500 hover:text-blue-700"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
