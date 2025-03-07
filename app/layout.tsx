'use client';
import * as React from "react"
// Remove metadata export from here
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { initializeTheme } from './theme';
import './styles/404.css';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  React.useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/globals.css" as="style" />
        <link rel="preload" href="/theme.js" as="script" />
        <link rel="icon" href="/favicon.ico" />
         <style>{`
           /* 404.css */
           .error-container {
             display: flex;
             justify-content: center;
             align-items: center;
             height: 100vh;
             background-color: var(--background-color);
           }
           .error-message {
             font-size: 1.5rem;
             color: var(--text-color);
           }
         `}</style>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        <script src="/theme.js" defer></script>
      </body>
    </html>
  )
}
