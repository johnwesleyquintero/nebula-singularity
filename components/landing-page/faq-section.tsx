import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Start with a 14-day free trial to explore all features of SellSmart Pro. No credit card required. You'll have full access to analytics, PPC optimization, and all seller tools.",
  },
  {
    question: "Can I connect multiple Amazon marketplaces?",
    answer:
      "Yes! SellSmart Pro supports all major Amazon marketplaces worldwide. Connect and manage multiple marketplace accounts from a single dashboard.",
  },
  {
    question: "How does PPC optimization work?",
    answer:
      "Our AI-powered PPC optimization analyzes your campaign performance, adjusts bids, and targets keywords automatically to reduce ACoS and improve ROI. The system learns and adapts to your specific market conditions.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide email support for all plans, with priority support for Professional plans and dedicated account managers for Enterprise customers. Our support team is available 24/7.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to additional features. When downgrading, changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security practices to protect your data. Our systems are regularly audited and comply with Amazon's data security requirements.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Everything you need to know about SellSmart Pro
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
