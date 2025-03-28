import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";
import { FAQSection } from "@/components/landing-page/faq-section";
import { CTASection } from "@/components/landing-page/cta-section";
import { Footer } from "@/components/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
