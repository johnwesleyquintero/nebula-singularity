'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as authService from '@/lib/auth-service';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    throw new Error('Missing verification token');
                }

                const { error } = await authService.verifyEmail(token);

                if (error) {
                    throw new Error(error.message);
                }

                toast.success('Email verified successfully! Redirecting to dashboard...');
                router.push('/dashboard');
            } catch (error: any) {
                toast.error(error.message || 'Email verification failed');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, router]);

    const handleResendEmail = async () => {
        try {
            const email = searchParams.get('email');

            if (!email) {
                throw new Error('No email found for verification');
            }

            const { error } = await authService.sendVerificationEmail(email);

            if (error) {
                throw new Error(error.message);
            }

            toast.success('Verification email resent successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend verification email');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <h1 className="text-lg font-semibold">Verifying Email...</h1>
                <p className="text-muted-foreground">
                    {!token && (
                        <Button
                            variant="link"
                            onClick={handleResendEmail}
                            className="text-blue-600"
                        >
                            Click here to resend verification email
                        </Button>
                    )}
                </p>
            </div>
        </div>
    );
}