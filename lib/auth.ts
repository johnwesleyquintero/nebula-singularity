import { logger } from './errorHandling';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface Session {
  userId?: string;
  role?: 'admin' | 'user';
  isLoggedIn: boolean;
}

export const getSession = async (): Promise<Session> => {
  try {
    const session = await getIronSession<Session>(cookies(), {
      password: process.env.SESSION_SECRET!,
      cookieName: 'nebula-session',
    });

    return {
      userId: session.userId,
      role: session.role,
      isLoggedIn: !!session.userId,
    };
  } catch (error) {
    logger.error('Failed to get session', error as Error);
    return { isLoggedIn: false };
  }
};

export const updateSession = async (data: Partial<Session>) => {
  const session = await getIronSession<Session>(cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'nebula-session',
  });

  Object.assign(session, data);
  await session.save();
};