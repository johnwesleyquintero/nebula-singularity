# SellSmart-Pro User Guide

## 🛠 Getting Started
1. **Account Setup**
   - Role-based access configuration
   - Multi-account linking for agencies
2. **Dashboard Overview**
   - Real-time metrics interpretation
   - Custom report generation

## 🔒 Authentication Flow
```ts
// auth.config.ts
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    }
  }
}
```

**Implementation Guide**
1. Configure environment variables:
```bash
# .env.local
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

2. Session management:
- Signed cookies with HS512 algorithm
- Automatic JWT rotation every 24h

**Troubleshooting**
- 🔍 `AUTH_ERROR`: Verify OAuth credentials match provider dashboard
- ⚠️ `SESSION_EXPIRED`: Check server time synchronization
- 🔗 `CORS_ORIGIN`: Ensure VITE_APP_URL matches deployment URL

## ⚡ Performance Testing
```bash
# Install load testing tools
npm install -g k6

# Run authentication load test
k6 run scripts/load-test-auth.js
```

## 📈 Analytics Implementation
```ts
// lib/analytics.ts - Core tracking implementation
import { Analytics } from '@segment/analytics-node'

export function trackAnalytics(req: NextRequest) {
  const analytics = new Analytics({ writeKey: process.env.SEGMENT_KEY })
  return {
    track: (event: string, properties?: Record<string, unknown>) => {
      analytics.track({
        userId: req.session?.user?.id,
        event,
        properties
      })
    }
  }
}
```

**Implementation Steps**
1. Add Segment write key:
```bash
# .env.local
SEGMENT_KEY=your_write_key
```

2. Add middleware handler:
```ts
// app/middleware.ts
export function middleware(req: NextRequest) {
  const { track } = trackAnalytics(req)
  track('page_view', { path: req.nextUrl.pathname })
}
```

**Troubleshooting**
- 🔍 `MISSING_EVENTS`: Verify Segment key and network connectivity
- ⚠️ `USER_ID_UNDEFINED`: Check session initialization flow
- 📊 `DATA_DELAY`: Allow 2-5 minutes for Segment pipeline processing