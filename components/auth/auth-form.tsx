'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

type AuthMode = 'signin' | 'signup';

interface AuthFormProps {
  defaultMode?: AuthMode;
  redirectUrl?: string;
  showSocial?: boolean;
}

export function AuthForm({ 
  defaultMode = 'signin', 
  redirectUrl = '/dashboard',
  showSocial = true
}: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSessionChecking, setIsSessionChecking] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { session, error } = await authService.getSession();
      
      if (session?.user) {
        // Only redirect if the user's email is verified
        if (session.user.email_verified) {
          router.push(redirectUrl);
        }
      }
      
      setIsSessionChecking(false);
    };
    
    checkSession();
  }, [router, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear password error when user types in password field
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError(null);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const validateForm = (): boolean => {
    // For sign up, check if passwords match
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    // Validate password complexity
    const passwordValidation = authService.validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || 'Invalid password');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          isSignUp: true,
          name: formData.name,
          role: formData.role,
          callbackUrl: `${window.location.origin}/auth/verify-email`
        });
    if (result?.error) {
      throw new Error(result.error);
    }
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success('Registration successful! Please check your email to verify your account.');
        
        // Automatically switch to sign in mode after successful registration
        setMode('signin');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        // Sign in
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
          callbackUrl: redirectUrl
        });
    if (result?.error) {
      throw new Error(result.error);
    }
        
        if (error) {
          // Special handling for email verification error
          if (error.status === 403 && error.message.includes('verify')) {
            toast.error(error.message);
            // Offer to resend verification email
            const resendResult = await authService.sendVerificationEmail(formData.email);
            if (!resendResult.error) {
              toast.info('A new verification email has been sent to your email address.');
            }
            return;
          }
          
          throw new Error(error.message);
        }
        
        if (!user || !session) {
          throw new Error('Sign in failed');
        }
        
        toast.success('Sign in successful!');
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github' | 'google' | 'facebook') => {
    setIsLoading(true);
    
    try {
      const { error } = await authService.signInWithProvider(provider);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // The redirect will happen automatically by Supabase
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (isSessionChecking) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {mode === 'signin' ? 'Sign in' : 'Create an account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'signin' 
            ? 'Enter your email and password to sign in' 
            : 'Enter your information to create your account'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          {showSocial && (
            <div className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSocialSignIn('github')} 
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Github
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
                {passwordError && (
                  <span className="text-red-500 text-xs ml-2">{passwordError}</span>
                )}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground text-center">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => setMode('signup')} 
                className="font-medium text-primary underline-offset-4 hover:underline"
                type="button"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button 
                onClick={() => setMode('signin')} 
                className="font-medium text-primary underline-offset-4 hover:underline"
                type="button"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}