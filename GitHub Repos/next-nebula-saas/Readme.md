# Nebula-Suite

## Project Overview
 A comprehensive Next.js 14 SaaS platform for Amazon sellers, emphasizing clean design, security, and performance. The application will serve as a powerful analytics and management tool for Amazon seller businesses.

## Technical Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Component Library**: Shadcn/UI
- **Authentication**: NextAuth.js
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)

## Key Components to Generate

### 1. Authentication Layout
  - Robust authentication system with:
  - Login page with Google and GitHub OAuth
  - Registration flow with role selection
  - Protected routes based on user roles
- Implement NextAuth.js configuration with JWT sessions

### 2. Dashboard Structure
- Main dashboard with responsive layout
- Sidebar navigation with role-based access
- Top navbar with user profile, theme toggle, and notifications
- Placeholder widgets for:
  - Sales Performance
  - PPC Metrics
  - Product Analytics
  - Recent Activity

### 3. Core Pages to Implement
- `/dashboard`: Primary analytics overview
- `/analytics/ppc`: Pay-Per-Click performance tracking
- `/products`: Product management and insights
- `/reports`: Data export and custom reporting
- `/settings`: User and account management

### 4. Reusable Components
- Data visualization components using Recharts
- Role-based access control components
- Error boundary and loading state components
- Toast notification system using Sonner

### 5. Styling and Theme
- Implement dark/light mode with next-themes
- Use Shadcn/UI for consistent, minimalist design
-  a color palette reflecting a professional, tech-forward brand

### 6. Performance Optimizations
- Implement code splitting
- Use dynamic imports for heavy components
- Optimize images and assets
- Implement caching strategies

## Design Principles
- Mobile-first responsive design
- Atomic design methodology
- Accessibility-first approach
- Intuitive user experience

## Security Considerations
- Implement Content Security Policy
- Role-based access control
- Secure handling of API tokens
- GDPR and CCPA compliance considerations

## Development Notes
- Use strict TypeScript configurations
- Implement comprehensive error handling
-  modular, reusable component structure
- Follow atomic design principles (atoms, molecules, organisms)

## Deployment Preparation
- Configuration for Vercel deployment
- Environment variable management
- Supabase database schema preparation

## Additional Features to Consider
- Google Sheets/Drive integration
- Amazon SP-API data fetching mechanism
- Advanced filtering and data export capabilities

## Branding
- Project Name: Nebula-Suite
- Intended Audience: Amazon Sellers
- Core Value Proposition: Comprehensive, actionable analytics platform

