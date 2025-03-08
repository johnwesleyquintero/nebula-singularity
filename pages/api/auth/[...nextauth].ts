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
    GoogleProvider({
      clientId: getEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    }),
    GitHubProvider({
      clientId: getEnvVar('GITHUB_ID'),
      clientSecret: getEnvVar('GITHUB_SECRET'),
    }),
  ],
  secret: getEnvVar('NEXTAUTH_SECRET'),
  callbacks: {
    async session({ session, token, user }: { session: Session; token: any; user: User }) {
      console.time("Session callback");
      console.log("Session callback called", { session, token, user });
      console.timeEnd("Session callback");
      return session;
    }
  },
}

export default NextAuth(authOptions)
