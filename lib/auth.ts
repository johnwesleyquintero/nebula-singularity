import { logger } from './errorHandling';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';

export interface Session {
  userId?: string;
  role?: 'admin' | 'user';
  isLoggedIn: boolean;
}

// Define auth options for NextAuth
export const authOptions: NextAuthOptions = {
  // Your NextAuth configuration here
  providers: [],
  // Add other NextAuth options as needed
};

// Get session function
export async function getSession() {
  return await getServerSession(authOptions);
}

export const updateSession = async (data: Partial<Session>) => {
  const session = await getIronSession<Session>(cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'nebula-session',
  });

  Object.assign(session, data);
  await session.save();
};