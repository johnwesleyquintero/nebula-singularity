import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 ">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Nebula-Singularity
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              &copy; 2023 Nebula-Singularity. All rights reserved.
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
