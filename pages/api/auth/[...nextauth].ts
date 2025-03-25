/* global process */
/** @eslint-env browser, node */
/* eslint-disable no-console */
import NextAuth from 'next-auth'
import type { NextAuthOptions, Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

const getEnvVar = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const authOptions: NextAuthOptions = {
  providers: [
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    process.env.GITHUB_ID && process.env.GITHUB_SECRET &&
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
  ].filter(Boolean),
  secret: getEnvVar('NEXTAUTH_SECRET'),
  callbacks: {
    async session({ session, token, user }: { session: Session; token: any; user: User }) {
      console.time("Session callback");
      try {
        // Add session modification logic here
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      } finally {
        console.timeEnd("Session callback");
      }
      return session;
    }
  },
}

export default NextAuth(authOptions)
