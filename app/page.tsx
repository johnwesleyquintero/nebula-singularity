'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input";
import { BarChart2, Lock, ShieldCheck, Menu } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { NewsletterForm } from '@/components/landing/NewsletterForm';
import dynamic from 'next/dynamic';

// Lazy load components
const HeroSection = dynamic(() => import('@/components/landing/HeroSection').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-[500px] w-full animate-pulse bg-muted" />
});

const FeatureCard = dynamic(() => import('@/components/landing/FeatureCard').then(mod => ({ default: mod.FeatureCard })), {
  ssr: true
});

const PricingSection = dynamic(() => import('@/components/landing/PricingSection').then(mod => ({ default: mod.PricingSection })), {
  loading: () => <div className="h-[400px] w-full animate-pulse bg-muted" />
});

const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection').then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="h-[300px] w-full animate-pulse bg-muted" />
});

const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => ({ default: mod.Footer })));
const NewsletterForm = dynamic(() => import('@/components/landing/NewsletterForm').then(mod => ({ default: mod.NewsletterForm })));

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
    const handleClick = (e: Event) => handleSmoothScroll(e, e.currentTarget as HTMLAnchorElement);

    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:block focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="Nebula-Suite Home">
            <div className="relative h-8 w-8">
              <Image
                src="/android-chrome-192x192.png"
                alt=""
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
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <nav className="flex flex-col items-center gap-4 p-4" aria-label="Mobile navigation">
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
      <main id="main-content" className="flex-1" role="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nebula-Suite",
              "url": "https://nebula-suite.com",
              "logo": "https://nebula-suite.com/android-chrome-192x192.png",
              "sameAs": [
                "https://twitter.com/nebula_suite",
                "https://linkedin.com/company/nebula-suite"
              ],
              "description": "Comprehensive SaaS platform for Amazon sellers offering analytics, PPC optimization, and inventory management tools."
            })
          }}
        />
        <Suspense fallback={<div className="h-[500px] w-full animate-pulse bg-muted" />}>
          <HeroSection />
        </Suspense>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" aria-labelledby="features-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 id="features-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nebula-Suite provides a comprehensive set of tools to help Amazon sellers optimize their business and increase profitability.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard icon={<BarChart2 className="h-6 w-6" aria-hidden="true" />} title="Advanced Analytics" description="Gain deep insights into your sales performance, inventory levels, and customer behavior." />
              <FeatureCard icon={<Lock className="h-6 w-6" aria-hidden="true" />} title="Secure Integration" description="Connect securely to Amazon SP-API with encrypted credential storage and secure data handling." />
              <FeatureCard icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />} title="PPC Optimization" description="Optimize your advertising campaigns with data-driven insights and recommendations." />
            </div>
          </div>
        </section>
        <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-muted" />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted" />}>
          <TestimonialsSection />
        </Suspense>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background" aria-labelledby="faq-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 id="faq-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" aria-label="Trusted brands">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Leading Brands
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                <Image src="/logos/brand1.svg" alt="Brand 1 logo" width={120} height={80} priority />
                <Image src="/logos/brand2.svg" alt="Brand 2 logo" width={120} height={80} priority />
                <Image src="/logos/brand3.svg" alt="Brand 3 logo" width={120} height={80} priority />
                <Image src="/logos/brand4.svg" alt="Brand 4 logo" width={120} height={80} priority />
                <Image src="/logos/brand5.svg" alt="Brand 5 logo" width={120} height={80} priority />
                <Image src="/logos/enhanced-brand.svg" alt="Enhanced Security Certified" width={120} height={80} priority className="hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background" aria-labelledby="newsletter-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 id="newsletter-heading" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join 10,000+ Amazon Sellers
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get exclusive tips and updates to grow your Amazon business
                </p>
              </div>
              <Suspense fallback={<div className="h-[100px] w-full max-w-md animate-pulse bg-muted" />}>
                <NewsletterForm />
              </Suspense>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
<Image
  src="/dashboard-preview.svg"
  alt="Product dashboard preview"
  width={1200}
  height={800}
  loading="lazy"
  className="rounded-lg border shadow-xl"
/>
