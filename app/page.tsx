'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link"
import Image from "next/image"
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input";
import { BarChart2, Lock, ShieldCheck, Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { NewsletterForm } from '@/components/landing/NewsletterForm';

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSmoothScroll = (e: Event, anchor: HTMLAnchorElement) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
          setIsOpen(false);
        }
      }
    };

    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => handleSmoothScroll(e, anchor));
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', (e) => handleSmoothScroll(e, anchor));
      });
    };
  }, []);

  const navigationLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
  ];

  const renderNavigationLinks = () => (
    navigationLinks.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`${label} section`}
      >
        {label}
      </Link>
    ))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="Home">
            <div className="relative h-8 w-8">
              <Image
                src="/android-chrome-192x192.png"
                alt="Nebula-Suite Logo"
                fill
                priority
                className="rounded-md object-contain"
                aria-hidden="true"
              />
            </div>
            <span className="font-bold">Nebula-Suite</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {renderNavigationLinks()}
          </nav>
          <div className="flex items-center gap-2">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <nav className="flex flex-col items-center gap-4 p-4">
                  {renderNavigationLinks()}
                </nav>
              </DrawerContent>
            </Drawer>
            <ModeToggle aria-label="Toggle theme" />
            <Link href="/login">
              <Button variant="outline" size="sm" aria-label="Log in">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" aria-label="Sign up">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        <HeroSection />
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nebula-Suite provides a comprehensive set of tools to help Amazon sellers optimize their business and increase profitability.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard icon={<BarChart2 className="h-6 w-6" />} title="Advanced Analytics" description="Gain deep insights into your sales performance, inventory levels, and customer behavior." />
              <FeatureCard icon={<Lock className="h-6 w-6" />} title="Secure Integration" description="Connect securely to Amazon SP-API with encrypted credential storage and secure data handling." />
              <FeatureCard icon={<ShieldCheck className="h-6 w-6" />} title="PPC Optimization" description="Optimize your advertising campaigns with data-driven insights and recommendations." />
            </div>
          </div>
        </section>
        <PricingSection />
        <TestimonialsSection />
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="text-left space-y-4">
                  <h3 className="text-xl font-bold">How does Nebula-Suite work?</h3>
                  <p className="text-muted-foreground">
                    Nebula-Suite connects to your Amazon Seller Central account through secure APIs to provide real-time analytics and insights.
                  </p>
                </div>
                <div className="text-left space-y-4">
                  <h3 className="text-xl font-bold">Is my data secure?</h3>
                  <p className="text-muted-foreground">
                    Yes, we use industry-standard encryption and security practices to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Leading Brands
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                <Image src="/logos/brand1.svg" alt="Brand 1" width={120} height={80} priority />
                <Image src="/logos/brand2.svg" alt="Brand 2" width={120} height={80} priority />
                <Image src="/logos/brand3.svg" alt="Brand 3" width={120} height={80} priority />
                <Image src="/logos/brand4.svg" alt="Brand 4" width={120} height={80} priority />
                <Image src="/logos/brand5.svg" alt="Brand 5" width={120} height={80} priority />
                <Image src="/logos/brand6.svg" alt="Brand 6" width={120} height={80} priority />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join 10,000+ Amazon Sellers
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get exclusive tips and updates to grow your Amazon business
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
