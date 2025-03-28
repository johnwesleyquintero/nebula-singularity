import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Optimize Your Amazon Business with
              <span className="text-primary"> SellSmart Pro</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Powerful analytics, automated PPC optimization, and intelligent
              tools to boost your Amazon sales and profitability.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/help">Learn More</Link>
            </Button>
          </div>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-lg border bg-background/40 p-4 shadow-xl">
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <img
                src="/dashboard-preview.svg"
                alt="Dashboard Preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
