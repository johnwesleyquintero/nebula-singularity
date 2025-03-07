import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { getSession } from '../../../lib/auth';
import { logger } from '../../../lib/errorHandling';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
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
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(sessionId)) {
    return res.status(400).json({
      error: 'INVALID_SESSION_ID',
      message: 'Malformed session ID format'
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
    const session = await getSession(req.cookies.sessionId);
    
    if (!session) {
      return res.status(401).json({ 
        error: 'SESSION_NOT_FOUND',
        message: 'No valid session found'
      });
    }

    // Cache the session in Redis with 5 minute TTL
    logger.debug(`Caching session in Redis: ${cacheKey}`);
    await redis.setex(cacheKey, 300, JSON.stringify(session));

    // Set cache headers for client-side caching
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    res.setHeader('ETag', `W/"${Date.now()}"`);

    return res.status(200).json(session);
  } catch (error) {
    logger.error('Session endpoint error:', error);
    const errorResponse = {
  error: 'SERVER_ERROR',
  message: 'Failed to retrieve session',
  ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
};

return res.status(500).json(errorResponse);
  }
}
