import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const PricingSection = () => {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 ">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your business'. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col rounded-lg border p-6 ">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-muted-foreground">Perfect for new Amazon sellers.</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$29</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>1 marketplace</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>30-day data history</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Email support</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border border-vibrant-teal p-6 shadow-lg ">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Professional</h3>
              <p className="text-muted-foreground">For growing Amazon businesses.</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$79</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>3 marketplaces</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>90-day data history</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>PPC optimization</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/register">
                <Button className="w-full bg-vibrant-teal hover:bg-vibrant-teal/90">Get Started</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border p-6 ">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-muted-foreground">For large Amazon sellers and agencies.</p>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$199</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Enterprise analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Unlimited marketplaces</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Full data history</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>24/7 priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-vibrant-teal" />
                <span>Custom reporting</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
