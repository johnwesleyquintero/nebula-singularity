import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Help", href: "/help" },
      { name: "FAQ", href: "#faq" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Security", href: "/security" }
    ]
  }
]

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/sellsmartpro", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/sellsmartpro", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/sellsmartpro", icon: Github }
]

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="SellSmart Pro" className="h-8 w-8" />
              <span className="font-bold">SellSmart Pro</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering Amazon sellers with intelligent tools and analytics for business growth.
            </p>
          </div>
          {footerLinks.map((group, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SellSmart Pro. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}