/* global process */
/** @eslint-env browser, node */
/* eslint-disable no-console */
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

const getEnvVar = (name) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export default NextAuth({
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
    async session({ session, token, user }) {
      console.time("Session callback");
      console.log("Session callback called", { session, token, user });
      console.timeEnd("Session callback");
      return session;
    }
  }
})
