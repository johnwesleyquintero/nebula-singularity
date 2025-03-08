import type { NextMiddleware, MiddlewareResult } from 'next/server';

type ComposedMiddleware = (req: NextRequest, res?: MiddlewareResult) => Promise<MiddlewareResult>;

export function compose(
  ...middlewares: NextMiddleware[]
): NextMiddleware {
  return async function composedMiddleware(req: NextRequest, event) {
    let result: MiddlewareResult | undefined;
    
    for (const middleware of middlewares) {
      const currentResult = await middleware(req, event);
      if (currentResult) {
        result = currentResult;
        if (currentResult instanceof Response) break;
      }
    }
    
    return result || NextResponse.next();
  };
}