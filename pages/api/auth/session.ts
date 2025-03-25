import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { getSession } from '@/lib/auth'
import { logger } from '../../../lib/errorHandling';
import rateLimit from 'express-rate-limit';
import { redis } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { getSession } from '@/lib/auth';
import { logger } from '../../../lib/errorHandling';
import rateLimit from 'express-rate-limit';
import { redis } from '../../../lib/db';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'RATE_LIMIT_ERROR'
    });
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate session ID format
  if (!req.cookies.sessionId) {
    return res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'Session ID is required in cookies'
    });
  }

  const sessionId = req.cookies.sessionId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
    logger.warn('Invalid session ID format detected', { sessionId, ip: req.socket.remoteAddress });
    return res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'Invalid authentication credentials'
    });
  }

  // Apply rate limiting first
  await new Promise((resolve, reject) => {
    limiter(req as any, res as any, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  try {
    // Check Redis cache first
    const cacheKey = `session:${req.cookies.sessionId}`;
    logger.debug(`Checking Redis cache for session: ${cacheKey}`);
    const cachedSession = await redis.get(cacheKey);

    if (cachedSession) {
      logger.info(`Cache hit for session: ${cacheKey}`);
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      res.setHeader('ETag', `W/"${Date.now()}"`);
      return res.status(200).json(JSON.parse(cachedSession));
    }
    logger.debug(`Cache miss for session: ${cacheKey}`);

    // Cache miss - fetch from database
    logger.info(`Fetching session from database: ${req.cookies.sessionId}`);
    const session = await getSession();
    
    if (!session) {
      res.setHeader('Content-Type', 'application/json');
return res.status(401).json({ 
  error: 'SESSION_NOT_FOUND',
  message: 'No valid session found',
  code: 'AUTHENTICATION_ERROR'
});
    }

    // Cache the session in Redis with 5 minute TTL
    logger.debug(`Caching session in Redis: ${cacheKey}`);
    await redis.setex(cacheKey, 900, JSON.stringify(session)); // 15 minute TTL

    // Set cache headers for client-side caching
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=150');
    res.setHeader('ETag', `W/"${createContentHash(session)}"`);

    return res.status(200).json(session);
  } catch (error) {
    logger.error('Session endpoint error:', error);
    const errorResponse = {
  error: 'SERVER_ERROR',
  message: 'Failed to retrieve session',
  code: 'SESSION_FETCH_FAILURE',
  ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
};

res.setHeader('Content-Type', 'application/json');
return res.status(500).json(errorResponse);
  }
}
