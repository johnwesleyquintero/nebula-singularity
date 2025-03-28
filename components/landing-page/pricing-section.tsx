import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description:
      "Perfect for new Amazon sellers looking to grow their business",
    features: [
      "Basic Analytics Dashboard",
      "PPC Campaign Management",
      "Keyword Research Tool",
      "5 Product Listings",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    price: "$99",
    description:
      "Ideal for established sellers wanting to scale their operations",
    features: [
      "Advanced Analytics & Reporting",
      "Automated PPC Optimization",
      "Advanced Keyword Research",
      "Unlimited Product Listings",
      "Competitor Analysis",
      "Inventory Management",
      "Priority Support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description:
      "For large-scale sellers needing maximum power and customization",
    features: [
      "Custom Analytics & API Access",
      "AI-Powered PPC Optimization",
      "Advanced Competitor Tracking",
      "Unlimited Everything",
      "Dedicated Account Manager",
      "Custom Integration Support",
      "24/7 Priority Support",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Choose the perfect plan for your business. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 bg-background rounded-xl border ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-3 text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
