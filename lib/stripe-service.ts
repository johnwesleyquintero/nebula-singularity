import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'month',
    features: [
      'Basic Analytics Dashboard',
      'PPC Campaign Management',
      'Keyword Research Tool',
      '5 Product Listings',
      'Email Support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    interval: 'month',
    features: [
      'Advanced Analytics & Reporting',
      'Automated PPC Optimization',
      'Advanced Keyword Research',
      'Unlimited Product Listings',
      'Competitor Analysis',
      'Inventory Management',
      'Priority Support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Custom Analytics & API Access',
      'AI-Powered PPC Optimization',
      'Advanced Competitor Tracking',
      'Unlimited Everything',
      'Dedicated Account Manager',
      'Custom Integration Support',
      '24/7 Priority Support'
    ]
  }
];

export const stripeService = {
  async createCustomer(email: string, name?: string) {
    return stripe.customers.create({
      email,
      name,
    });
  },

  async createSubscription(customerId: string, priceId: string) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  },

  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.cancel(subscriptionId);
  },

  async getSubscription(subscriptionId: string) {
    return stripe.subscriptions.retrieve(subscriptionId);
  },

  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
    });
  },

  async createSetupIntent(customerId: string) {
    return stripe.setupIntents.create({
      customer: customerId,
    });
  },

  async listInvoices(customerId: string) {
    return stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });
  },
};