import { BarChart3, Rocket, Search, ShoppingCart, Target, Zap } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get real-time insights into your Amazon business performance with detailed metrics and trends."
  },
  {
    icon: Rocket,
    title: "PPC Optimization",
    description: "Automate and optimize your Amazon PPC campaigns for maximum ROI and reduced ACoS."
  },
  {
    icon: Search,
    title: "Keyword Research",
    description: "Discover high-performing keywords and optimize your product listings for better visibility."
  },
  {
    icon: Target,
    title: "Competitor Analysis",
    description: "Track competitor prices, rankings, and strategies to stay ahead in your market."
  },
  {
    icon: ShoppingCart,
    title: "Inventory Management",
    description: "Smart inventory forecasting and restock alerts to prevent stockouts and lost sales."
  },
  {
    icon: Zap,
    title: "Automated Tools",
    description: "Save time with our suite of automation tools for pricing, reviews, and listing optimization."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Succeed on Amazon
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            Powerful tools and insights to grow your Amazon business and maximize profitability
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}