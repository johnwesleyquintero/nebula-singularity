"use client";

import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function RegisterPage() {

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthForm defaultMode="signup" redirectUrl="/dashboard" />
    </div>
  );
}
