import { db } from '@/lib/db';
import { stripeService } from '@/lib/stripe-service';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 });
    }

    // Get or create Stripe customer
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer(
        session.user.email!,
        session.user.name || undefined
      );
      customerId = customer.id;

      // Save Stripe customer ID
      await db.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create subscription
    const subscription = await stripeService.createSubscription(customerId, priceId);

    return new NextResponse(JSON.stringify({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    }));
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { subscriptionId, priceId } = await req.json();
    if (!subscriptionId || !priceId) {
      return new NextResponse('Subscription ID and Price ID are required', { status: 400 });
    }

    const subscription = await stripeService.updateSubscription(subscriptionId, priceId);

    return new NextResponse(JSON.stringify(subscription));
  } catch (error) {
    console.error('Error updating subscription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return new NextResponse('Subscription ID is required', { status: 400 });
    }

    await stripeService.cancelSubscription(subscriptionId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}