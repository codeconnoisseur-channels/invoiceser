import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, CheckCircle2, BarChart3, Bell, Brain, Globe, Lock, Receipt, Send, Sparkles, Twitter, Linkedin, Github, Instagram } from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "Professional invoices",
    description: "Custom branding, logo, font, and colours per invoice. Dynamic tax lines for any jurisdiction.",
  },
  {
    icon: Send,
    title: "One-click send",
    description: "Fill in 4 fields and go. PDF generation, email delivery, and a secure share link — all in one click.",
  },
  {
    icon: Globe,
    title: "Multi-currency & tax",
    description: "Bill in USD, GBP, EUR and 12+ currencies. Add per-invoice tax lines — Sales Tax, VAT, GST, WHT, or custom.",
  },
  {
    icon: Bell,
    title: "Auto reminders",
    description: "Never chase a payment again. Automatic follow-ups sent to late-paying clients on your behalf.",
  },
  {
    icon: BarChart3,
    title: "Revenue analytics",
    description: "See what you've earned, what's outstanding, and who owes you — all at a glance, in your currency.",
  },
  {
    icon: Brain,
    title: "AI insights",
    description: "Ask \"Who owes me the most?\" or \"What was my best month?\" in plain English. Instant answers from your data.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Everything you need to start invoicing",
    features: [
      "Unlimited clients & invoices",
      "PDF download & email delivery",
      "Automatic payment reminders",
      "Logo upload & brand colour",
      "Hide Invoiceser branding",
      "Custom invoice fonts",
      "AI chatbot — 50 queries/month",
    ],
    cta: "Get started free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For freelancers who want the full picture",
    features: [
      "Everything in Free",
      "Predictive analytics & forecasts",
      "Unlimited AI chatbot queries",
      "Custom email domain & templates",
      "Priority support",
    ],
    cta: "Start Pro trial",
    href: "/sign-up",
    highlighted: true,
  },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Brand Designer · Lagos",
    initials: "AO",
    gradient: "from-violet-500 to-purple-600",
    rating: 5,
    quote: "I used to spend an hour every week chasing payments. Invoiceser automated the reminders and now I barely think about it. My clients pay faster too.",
  },
  {
    name: "James Harrington",
    role: "Freelance Developer · London",
    initials: "JH",
    gradient: "from-blue-500 to-cyan-600",
    rating: 5,
    quote: "The AI chatbot surfaced a client who had been slipping on payments every quarter. I renegotiated terms — that alone paid for the Pro plan.",
  },
  {
    name: "Priya Mehta",
    role: "Content Strategist · Toronto",
    initials: "PM",
    gradient: "from-emerald-500 to-teal-600",
    rating: 5,
    quote: "Beautiful invoices, zero fuss. My international clients actually comment on how professional the emails look. Worth every penny.",
  },
];

const stats = [
  { value: "2,400+", label: "Active freelancers" },
  { value: "$4.2M", label: "Invoiced this month" },
  { value: "98%", label: "On-time payments" },
  { value: "< 2 min", label: "To create" },
  { value: "150+", label: "Countries" },
  { value: "4.9 / 5", label: "Rating" },
];

const steps = [
  {
    number: "01",
    icon: Receipt,
    title: "Create your invoice",
    description: "Client email, description, amount — done. Add branding, tax lines, and payment info only when you need them.",
  },
  {
    number: "02",
    icon: Send,
    title: "Send in one click",
    description: "PDF generated, email sent, link shared — all at once. Post-send, view, copy the link, or create another.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Get paid on time",
    description: "Automatic reminders chase late payments so you focus on work, not collections.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Receipt className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">
              Invoice<span className="text-primary">ser</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {["How it works", "Features", "Pricing"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110 active:brightness-95"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-110 active:brightness-95"
              >
                Get started
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-16 lg:grid-cols-2 lg:gap-20 lg:pb-28 lg:pt-20">
          {/* Copy */}
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for freelancers &amp; small teams
            </div>
            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Invoicing that gets
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
                you paid faster
              </span>
            </h1>
            <p className="mb-8 max-w-md text-base text-muted-foreground lg:text-lg">
              Start with 4 fields and send. Add taxes, branding, and payment info
              only when you need them. Automatic reminders, PDF generation, dynamic
              tax, and AI insights — all in one place.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:brightness-95"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-secondary"
              >
                See pricing
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free plan available &middot; No credit card required
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-4 py-2.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  invoiceser.com/dashboard
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {[
                  { label: "Total Revenue", value: "$24,800", trend: "+12% this year" },
                  { label: "Outstanding", value: "$3,200", trend: "3 invoices" },
                  { label: "Paid Invoices", value: "47", trend: "all time" },
                  { label: "Active Clients", value: "12", trend: "+2 new" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-card p-3">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] font-medium text-primary">{s.trend}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-3 pb-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Invoices
                  </span>
                  <span className="text-[10px] font-medium text-primary">View all &rarr;</span>
                </div>
                {[
                  { num: "INV-047", client: "Acme Corp", amount: "$1,800", status: "paid" },
                  { num: "INV-048", client: "Studio Blue", amount: "$950", status: "sent" },
                  { num: "INV-049", client: "Horizon Ltd", amount: "$2,400", status: "overdue" },
                ].map((row) => (
                  <div key={row.num} className="flex items-center justify-between border-t border-border px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{row.num}</span>
                      <span className="text-sm font-medium text-foreground">{row.client}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-foreground">{row.amount}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                        row.status === "paid" ? "border-success/20 bg-success/10 text-success" :
                        row.status === "overdue" ? "border-warning/20 bg-warning/10 text-warning" :
                        "border-primary/20 bg-primary/10 text-primary"
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/50 py-6" aria-label="Platform statistics">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tabular-nums text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
              From invoice to payment in minutes
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              Three simple steps — no accounting degree required.
            </p>
          </div>
          <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3" role="list">
            <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {steps.map((step) => (
              <li key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 ring-1 ring-border">
                  <step.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="border-y border-border bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
              Everything you need to get paid
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              From first invoice to final payment — Invoiceser handles the entire billing workflow.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {features.map((f) => (
              <li
                key={f.title}
                className="card-hover rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-1.5 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Customer stories</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
              Loved by freelancers worldwide
            </h2>
            <p className="text-muted-foreground">Real feedback from people who invoice every day.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover rounded-xl border border-border bg-card p-6">
                <StarRating rating={t.rating} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-border bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight lg:text-4xl">
              Free to start. Pro when you mean business.
            </h2>
            <p className="text-muted-foreground">No limits on invoices or clients — ever.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-primary/30 bg-gradient-to-br from-card to-primary/[0.03] shadow-lg ring-1 ring-primary/10"
                    : "border-border bg-card shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-primary to-violet-500 px-3 py-1 text-[10px] font-semibold text-white">
                    Most popular
                  </span>
                )}
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </p>
                <div className="mb-1 flex items-end gap-0.5">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mb-7 space-y-2.5" role="list">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className={plan.highlighted ? "text-foreground" : "text-muted-foreground"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`flex h-10 items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95 focus-visible:ring-primary"
                      : "border border-border bg-card text-foreground shadow-sm hover:bg-secondary focus-visible:ring-primary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="mx-6 mb-16 overflow-hidden rounded-xl">
        <div className="relative bg-gradient-to-br from-primary via-blue-600 to-violet-600 py-16 text-center lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Ready to get paid on time?
            </h2>
            <p className="mb-7 text-sm text-white/70">
              Join freelancers and small teams who use Invoiceser to take the stress out of billing.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-foreground shadow-sm transition-all hover:brightness-95 active:brightness-90"
            >
              Create your free account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-white/50">No credit card required</p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Receipt className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold tracking-tight">
                  Invoice<span className="text-primary">ser</span>
                </span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Professional invoicing for freelancers and small teams.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {[
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: Github, href: "https://github.com", label: "GitHub" },
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">Product</h3>
              <ul className="space-y-2.5" role="list">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">Support</h3>
              <ul className="space-y-2.5" role="list">
                {[
                  { label: "Help Centre", href: "/support" },
                  { label: "Changelog", href: "/changelog" },
                  { label: "Contact", href: "/support" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">Legal</h3>
              <ul className="space-y-2.5" role="list">
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-7 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Invoiceser. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with care for freelancers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
