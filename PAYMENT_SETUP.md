# Payment System Setup Guide

This guide explains how to set up and configure the payment system for SellSmart Pro.

## Prerequisites

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Set up your products and pricing plans in Stripe

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Product Price IDs
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

The payment system requires two new tables in the database:
- `subscriptions`: Stores subscription information
- `payments`: Stores payment history

Run the migration script to create these tables:

```bash
pnpm supabase migration up
```

## Stripe Product Setup

1. Create three products in Stripe:
   - Starter Plan ($49/month)
   - Professional Plan ($99/month)
   - Enterprise Plan ($199/month)

2. Note down the price IDs for each plan and add them to your environment variables.

## Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add a new webhook endpoint: `{YOUR_APP_URL}/api/webhooks/stripe`
3. Select the following events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. Copy the webhook signing secret and add it to your environment variables

## Testing

1. Use Stripe's test mode for development
2. Test credit card numbers:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002

## Implementation Details

The payment system includes:
- Subscription management UI (`/components/settings/subscription-management.tsx`)
- Stripe service integration (`/lib/stripe-service.ts`)
- Webhook handling (`/app/api/webhooks/stripe/route.ts`)
- Subscription API routes (`/app/api/subscriptions/route.ts`)

## Security Considerations

1. Never expose your Stripe secret key
2. Always use environment variables for sensitive data
3. Implement proper authentication checks
4. Use Stripe's webhook signature verification
5. Follow security best practices for handling payment data