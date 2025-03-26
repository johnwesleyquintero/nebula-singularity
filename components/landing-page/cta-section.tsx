import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center text-primary-foreground">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Grow Your Amazon Business?
            </h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
              Join thousands of successful sellers who trust SellSmart Pro. Start your 14-day free trial today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-lg bg-white text-primary hover:bg-white/90 shadow-sm"
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg bg-transparent border-white text-white hover:bg-white/20"
            >
              <Link href="/help">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}