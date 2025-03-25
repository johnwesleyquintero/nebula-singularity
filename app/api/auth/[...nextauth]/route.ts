import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api/auth/callback/google'
            : 'https://SellSmart-Pro.vercel.app/api/auth/callback/google'
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Sign in with Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !data.user) {
            return null
          }

          // Get user profile data from the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (userError || !userData) {
            console.error("Error fetching user data:", userError)
            return null
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            role: userData.role,
            image: userData.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

async function handler(req: Request, ctx: { params: { nextauth: string[] } }) {
  try {
    return await NextAuth(authOptions)(req, ctx)
  } catch (error) {
    console.error('Auth API Error:', error)
    return new Response(JSON.stringify({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {'Content-Type': 'application/json'}
    })
  }
}

export { handler as GET, handler as POST }

