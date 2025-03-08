'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';
import * as authService from '../../lib/auth-service';
import { useState, useEffect } from 'react';

const AuthPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { session, error } = await authService.getSession();
      
      if (session?.user) {
        // Only redirect if the user's email is verified
        if (session.user.email_verified) {
          router.push('/dashboard');
        } else {
          toast({
            title: 'Email verification required',
            description: 'Please verify your email before accessing the dashboard.',
            variant: 'destructive',
          });
        }
      }
    };
    
    checkSession();
    
    const subscription = authService.onAuthStateChange((session) => {
      if (session?.user) {
        // Only redirect if the user's email is verified
        if (session.user.email_verified) {
          router.push('/dashboard');
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { user, error } = await authService.signUp(email, password);
        if (error) {
          throw new Error(error.message);
        }
        if (!user) {
          throw new Error('Sign up failed');
        }
        toast({
          title: 'Sign up successful!',
          description: 'Please check your email to verify.',
        });
        // Don't redirect to dashboard until email is verified
      } else {
        const { user, session, error } = await authService.signIn(email, password);
        
        if (error) {
          // Special handling for email verification error
          if (error.status === 403 && error.message.includes('verify')) {
            toast({
              title: 'Email verification required',
              description: error.message,
              variant: 'destructive',
            });
            // Offer to resend verification email
            const resendResult = await authService.sendVerificationEmail(email);
            if (!resendResult.error) {
              toast({
                title: 'Verification email sent',
                description: 'A new verification email has been sent to your email address.',
              });
            }
            setIsLoading(false);
            return;
          }
          
          throw new Error(error.message);
        }
        
        if (!user || !session) {
          throw new Error('Sign in failed');
        }
        
        // Only redirect if email is verified
        if (user.email_verified) {
          toast({
            title: 'Sign in successful!',
            description: 'Welcome back!',
          });
          router.push('/dashboard');
        } else {
          toast({
            title: 'Email verification required',
            description: 'Please verify your email before accessing the dashboard.',
            variant: 'destructive',
          });
          // Offer to resend verification email
          const resendResult = await authService.sendVerificationEmail(email);
          if (!resendResult.error) {
            toast({
              title: 'Verification email sent',
              description: 'A new verification email has been sent to your email address.',
            });
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      toast({
        title: 'Authentication Failed',
        description: message,
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
