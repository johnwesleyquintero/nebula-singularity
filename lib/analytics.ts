import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

type AnalyticsEvent = {
  event: "page_view" | "auth_event" | "api_call";
  pathname: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  properties?: Record<string, unknown>;
};

export function trackAnalytics(req: NextRequest) {
  const sessionId = req.cookies.get("session_id")?.value || uuidv4();

  return {
    track: (
      event: AnalyticsEvent["event"],
      properties?: AnalyticsEvent["properties"],
    ) => {
      const payload: AnalyticsEvent = {
        event,
        pathname: req.nextUrl.pathname,
        sessionId,
        timestamp: Date.now(),
        properties,
      };

      // TODO: Implement actual tracking endpoint
      console.log("[Analytics]", payload);
    },
    setCookie: () => {
      return new Response(null, {
        headers: {
          "Set-Cookie": `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    },
  };
}
