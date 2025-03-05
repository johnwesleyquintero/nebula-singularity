import * as React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { initializeTheme } from './theme';
import './styles/404.css';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nebula-Suite | Analytics for Amazon Sellers",
  description: "Comprehensive analytics and management tool for Amazon seller businesses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  React.useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/globals.css" as="style" />
        <link rel="preload" href="/theme.js" as="script" />
        <link rel="icon" href="/favicon.ico" />
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
