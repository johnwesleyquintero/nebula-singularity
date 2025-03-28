import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = (await headersList).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Webhook signature verification failed", {
        status: 400,
      });
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        await db.subscription.upsert({
          where: {
            stripe_subscription_id: subscription.id,
          },
          create: {
            stripe_subscription_id: subscription.id,
            userId: subscription.metadata.userId,
            stripe_customer_id: subscription.customer as string,
            plan_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ),
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000)
              : null,
          },
          update: {
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000,
            ),
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ),
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000)
              : null,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000)
              : null,
          },
        });
        break;

      case "invoice.paid":
        const invoice = event.data.object as Stripe.Invoice;
        await db.payment.create({
          data: {
            userId: invoice.metadata?.userId || "",
            subscription_id: invoice.subscription
              ? (invoice.subscription as string)
              : null,
            stripe_payment_intent_id: invoice.payment_intent as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "succeeded",
          },
        });
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await db.subscription.update({
          where: {
            stripe_subscription_id: deletedSubscription.id,
          },
          data: {
            status: "canceled",
            canceled_at: new Date(),
          },
        });
        break;
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
