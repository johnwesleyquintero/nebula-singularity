"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/lib/stripe-service";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function SubscriptionManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const { clientSecret, subscriptionId } = await response.json();

      // Handle payment with Stripe Elements (to be implemented)
      // Redirect to success page or show confirmation
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tighter">
          Subscription Plans
        </h2>
        <p className="text-muted-foreground">
          Choose the perfect plan for your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${currentPlan === plan.id ? "border-primary" : ""}`}
          >
            {plan.id === "professional" && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <div className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                    >
                      ✓
                    </Badge>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.id === "professional" ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading || currentPlan === plan.id}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentPlan === plan.id ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
