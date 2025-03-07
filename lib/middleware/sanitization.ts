import { NextApiRequest, NextApiResponse } from 'next';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function sanitizeRequest(
  handler: NextApiHandler
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (req.body) {
        req.body = sanitizeData(req.body);
      }
      if (req.query) {
        req.query = sanitizeData(req.query);
      }
      return handler(req, res);
    } catch (error) {
      console.error('Sanitization error:', error);
      return res.status(400).json({
        error: 'Invalid input data'
      });
    }
  };
}

function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data.trim());
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitizedData: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitizedData[key] = sanitizeData(value);
    }
    return sanitizedData;
  }
  
  return data;
}