import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

import { Logo } from "@/components/ui/logo";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Changelog", href: "/changelog" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10">
        <div className="grid gap-12 border-b border-border pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Professional invoicing for freelancers and small teams who would rather be doing the work.</p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow Invoiceser on ${label}`} className="flex size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-3" role="list">
                {group.links.map((link) => <li key={link.label}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline">{link.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Invoiceser. All rights reserved.</p>
          <p>Made for independent work, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
