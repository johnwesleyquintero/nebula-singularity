import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Entrepreneur",
    content:
      "SellSmart Pro transformed our Amazon business. The PPC optimization alone increased our ROI by 40% while reducing ACoS. The analytics dashboard gives us insights we never had before.",
    image: "/testimonials/sarah.svg",
  },
  {
    name: "Michael Chen",
    role: "Amazon FBA Seller",
    content:
      "The keyword research and competitor analysis tools are game-changers. We've seen a 25% increase in organic rankings and our conversion rates have never been better.",
    image: "/testimonials/michael.svg",
  },
  {
    name: "Emma Davis",
    role: "Digital Marketing Manager",
    content:
      "The automation features save us countless hours every week. From inventory management to price optimization, SellSmart Pro has streamlined our entire operation.",
    image: "/testimonials/emma.svg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by Amazon Sellers Worldwide
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            See how SellSmart Pro helps sellers achieve their business goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <img
                    alt={testimonial.name}
                    src={testimonial.image}
                    className="aspect-square h-full w-full"
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <blockquote className="mt-4">
                <p className="text-muted-foreground">{testimonial.content}</p>
              </blockquote>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
