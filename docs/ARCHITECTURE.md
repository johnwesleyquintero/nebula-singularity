# Nebula Suite Architecture

## Core Components

### Frontend Structure
```
app/
├── (auth)
├── (dashboard)
├── api/
└── layout.tsx
```

### Backend Services
- Supabase PostgreSQL
- Vercel Edge Functions
- NextAuth.js authentication

## Verified Implementation Details

### Dashboard Components
```
app/(dashboard)/
├── analytics/
├── dashboard/
│   └── page.tsx (Main dashboard layout with tabs)
├── products/
├── reports/
└── settings/
```

### Backend Integration
- Supabase connection validated through environment variables
- NextAuth.js configured with Google OAuth
- Vercel Edge Functions handling API routes

### Environment Validation
```typescript
// Actual implementation from .env.local
if (!process.env.SUPABASE_PROJECT_2_URL || !process.env.SUPABASE_PROJECT_2_ANON_PUBLIC) {
  throw new Error('Missing Supabase credentials in environment variables');
}
```

[View full architecture documentation](./ARCHITECTURE.md)