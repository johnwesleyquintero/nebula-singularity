import { securityHeaders } from './securityHeaders';

export const metadata = {
  ...securityHeaders().headers,
  title: 'Next Nebula SaaS',
  description: 'Enterprise-grade SaaS platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}