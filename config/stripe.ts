export const stripeConfig = {
  // Stripe publishable key for client-side usage
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

  // Price IDs for subscription plans
  prices: {
    starter: process.env.STRIPE_PRICE_STARTER,
    professional: process.env.STRIPE_PRICE_PROFESSIONAL,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  },

  // Webhook configuration
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Success and cancel URLs for checkout
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,

  // Metadata keys
  metadata: {
    userId: "user_id",
    planId: "plan_id",
  },
};

// Instructions for setting up Stripe environment variables
/*
Required environment variables:

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
*/
