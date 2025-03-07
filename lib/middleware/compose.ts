import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sanitizeRequest } from './sanitization';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function validateAndSanitize<T extends z.ZodType>(
  schema: T,
  handler: NextApiHandler
): NextApiHandler {
  return sanitizeRequest(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Validate the request body against the schema
      if (req.body) {
        await schema.parseAsync(req.body);
      }
      
      // If validation passes, proceed to the handler
      return handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      
      console.error('Validation error:', error);
      return res.status(500).json({
        error: 'Internal server error'
      });
    }
  });
}