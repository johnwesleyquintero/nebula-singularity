import React from 'react';
import Image from 'next/image';

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 ">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Trusted by Amazon Sellers
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers have to say about Nebula-Singularity.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border p-6 ">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div>
                <h3 className="font-bold">Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Amazon Seller</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              "Nebula-Singularity has transformed how I manage my Amazon business. The analytics are incredibly detailed
              and have helped me optimize my PPC campaigns."
            </p>
          </div>
          <div className="flex flex-col rounded-lg border p-6">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div>
                <h3 className="font-bold">Michael Chen</h3>
                <p className="text-sm text-muted-foreground">E-commerce Agency</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              "As an agency managing multiple Amazon accounts, Nebula-Singularity has been a game-changer. The reporting
              features save us hours of work each week."
            </p>
          </div>
          <div className="container mx-auto mt-12">
            <Image
              src="/Nebula-Singularity-dashboard.svg"
              alt="Nebula Suite Dashboard"
              width={1200}
              height={800}
              className="rounded-lg shadow-lg"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
