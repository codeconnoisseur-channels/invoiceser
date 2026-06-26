import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  FileText,
  Zap,
  Globe,
  BarChart2,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  Send,
  Banknote,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional Invoices",
    description:
      "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions.",
    bg: "bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Instant PDF & Email",
    description:
      "Generate a PDF and send it to your client in one click. Automatic reminders keep payments on track.",
    bg: "bg-amber-50",
    iconClass: "text-amber-600",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description:
      "Bill clients in USD, GBP, EUR and 12 other currencies. Tax support for sales tax and VAT.",
    bg: "bg-emerald-50",
    iconClass: "text-emerald-600",
  },
  {
    icon: BarChart2,
    title: "Revenue Analytics",
    description:
      "See what you've earned, what's outstanding, and who owes you — all at a glance.",
    bg: "bg-violet-50",
    iconClass: "text-violet-600",
  },
  {
    icon: Sparkles,
    title: "AI Chatbot",
    description:
      "Ask questions about your cash flow in plain English — \"Who owes me the most?\" or \"What was my best month?\" — and get instant answers.",
    bg: "bg-pink-50",
    iconClass: "text-pink-600",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Every invoice is private to your account. Only people you share the link with can view it.",
    bg: "bg-slate-50",
    iconClass: "text-slate-600",
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
      "No Invoiceser mention on invoices",
      "Custom invoice fonts (Modern, Classic, Typewriter)",
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
      "Predictive analytics & revenue forecasts",
      "Unlimited AI chatbot queries",
      "Custom email domain & editable templates",
      "Priority support",
    ],
    cta: "Start Pro trial",
    href: "/sign-up",
    highlighted: true,
  },
];

const stats = [
  { value: "2,400+", label: "Active freelancers" },
  { value: "$4.2M", label: "Invoiced this month" },
  { value: "98%", label: "On-time payments" },
  { value: "< 2 min", label: "To create an invoice" },
  { value: "150+", label: "Countries supported" },
  { value: "4.9 / 5", label: "Average rating" },
];

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Create your invoice",
    description:
      "Fill in your client details, line items, and branding. Invoiceser pre-fills what it already knows.",
  },
  {
    number: "02",
    icon: Send,
    title: "Send it instantly",
    description:
      "Email the PDF directly to your client or share a secure public link — one click, done.",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Get paid faster",
    description:
      "Automatic reminders follow up with late clients so you never have to chase a payment again.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            Invoice<span className="text-blue-600">ser</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a
              href="#how-it-works"
              className="rounded text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="rounded text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="rounded text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Get started
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero — split layout */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-violet-50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-0 -z-10 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-100/40 to-transparent blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-24">
          {/* Left — copy */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Built for freelancers &amp; small teams
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Invoicing that gets
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                you paid faster
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-gray-500">
              Create, send, and track professional invoices in minutes. Automatic
              reminders, PDF generation, and an AI chatbot you can ask about your
              data in plain English — all in one place.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Start for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                See pricing
              </a>
            </div>
            <p className="mt-5 text-xs text-gray-400">
              Free plan available · No credit card required
            </p>
          </div>

          {/* Right — dashboard preview */}
          <div className="w-full" aria-label="Dashboard preview">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-blue-100/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-red-400" />
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-yellow-400" />
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 rounded-md bg-gray-100 px-3 py-1 font-mono text-xs text-gray-400">
                  invoiceser.com/dashboard
                </span>
              </div>
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-2.5 p-4">
                {[
                  { label: "Total Revenue", value: "$24,800", trend: "+12% this year" },
                  { label: "Outstanding", value: "$3,200", trend: "3 invoices" },
                  { label: "Paid Invoices", value: "47", trend: "all time" },
                  { label: "Active Clients", value: "12", trend: "+2 new" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                    <p className="mb-1 text-xs text-gray-400">{s.label}</p>
                    <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="mt-0.5 text-xs font-medium text-blue-500">{s.trend}</p>
                  </div>
                ))}
              </div>
              {/* Invoice rows */}
              <div className="px-4 pb-4">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Recent Invoices
                    </span>
                    <span aria-hidden="true" className="text-xs font-medium text-blue-500">View all →</span>
                  </div>
                  {[
                    {
                      num: "INV-047",
                      client: "Acme Corp",
                      amount: "$1,800",
                      status: "paid",
                      color: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
                    },
                    {
                      num: "INV-048",
                      client: "Studio Blue",
                      amount: "$950",
                      status: "sent",
                      color: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
                    },
                    {
                      num: "INV-049",
                      client: "Horizon Ltd",
                      amount: "$2,400",
                      status: "overdue",
                      color: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
                    },
                  ].map((row) => (
                    <div
                      key={row.num}
                      className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-gray-400">{row.num}</span>
                        <span className="text-sm font-medium text-gray-700">{row.client}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-800">{row.amount}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.color}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats ticker */}
      <section
        className="overflow-hidden border-y border-gray-100 bg-white py-5"
        aria-label="Platform statistics"
      >
        <div
          className="flex animate-marquee gap-0 whitespace-nowrap"
          aria-hidden="true"
          style={{ width: "max-content" }}
        >
          {[...stats, ...stats].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-10 px-10"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">{s.value}</span>
                <span className="text-sm text-gray-400">{s.label}</span>
              </div>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
            </div>
          ))}
        </div>
        {/* Screen-reader accessible version */}
        <dl className="sr-only">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold text-blue-600">How It Works</p>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              From invoice to payment in minutes
            </h2>
            <p className="mx-auto max-w-md text-gray-500">
              Three simple steps — no accounting degree required.
            </p>
          </div>
          <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3" role="list">
            {/* Connecting line on desktop */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent md:block"
            />
            {steps.map((step) => (
              <li key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 ring-4 ring-white shadow-md">
                  <step.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {step.number.slice(-1)}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold text-blue-600">Features</p>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Everything you need to get paid
            </h2>
            <p className="mx-auto max-w-md text-gray-500">
              From first invoice to final payment — Invoiceser handles the entire
              billing workflow so you can focus on your work.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  aria-hidden="true"
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}
                >
                  <f.icon className={`h-5 w-5 ${f.iconClass}`} />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold text-blue-600">Customer Stories</p>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Loved by freelancers worldwide</h2>
            <p className="text-gray-500">Real feedback from people who invoice every day.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                name: "Adaeze Okonkwo",
                role: "Brand Designer · Lagos",
                avatar: "AO",
                color: "bg-violet-100 text-violet-700",
                rating: 5,
                quote: "I used to spend an hour every week chasing payments. Invoiceser automated the reminders and now I barely think about it. My clients pay faster too.",
              },
              {
                name: "James Harrington",
                role: "Freelance Developer · London",
                avatar: "JH",
                color: "bg-blue-100 text-blue-700",
                rating: 5,
                quote: "The AI chatbot actually surfaced a client who had been slipping on payments every quarter. I renegotiated terms — that alone paid for the Pro plan.",
              },
              {
                name: "Priya Mehta",
                role: "Content Strategist · Toronto",
                avatar: "PM",
                color: "bg-emerald-100 text-emerald-700",
                rating: 5,
                quote: "Beautiful invoices, zero fuss. My international clients actually comment on how professional the emails look. Worth every penny.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold text-blue-600">Pricing</p>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Free to start. Pro when you mean business.</h2>
            <p className="text-gray-500">No limits on invoices or clients — ever. Upgrade only for the advanced features.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <p
                  className={`mb-2 text-sm font-medium ${
                    plan.highlighted ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="mb-1 flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="mb-1.5 text-sm text-gray-400">{plan.period}</span>
                  )}
                </div>
                <p
                  className={`mb-7 text-sm ${
                    plan.highlighted ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
                <ul className="mb-8 space-y-3" role="list">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${
                          plan.highlighted ? "text-green-400" : "text-green-500"
                        }`}
                      />
                      <span className={plan.highlighted ? "text-gray-300" : "text-gray-600"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block rounded-xl py-3 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    plan.highlighted
                      ? "bg-white text-gray-900 hover:bg-gray-100 focus-visible:ring-white"
                      : "bg-gray-900 text-white hover:bg-gray-700 focus-visible:ring-gray-900"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-16 overflow-hidden rounded-3xl" aria-labelledby="cta-heading">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 py-20 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-violet-900/20"
          />
          <div className="relative mx-auto max-w-2xl px-6">
            <h2 id="cta-heading" className="mb-4 text-3xl font-bold text-white">
              Ready to get paid on time?
            </h2>
            <p className="mb-8 leading-relaxed text-gray-400">
              Join freelancers and small teams who use Invoiceser to take the stress
              out of billing.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Create your free account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-xs text-gray-500">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand + social */}
            <div className="lg:col-span-1">
              <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
                Invoice<span className="text-blue-600">ser</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Professional invoicing for freelancers and small teams who want to get paid faster.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Twitter className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View our GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900">
                Product
              </h3>
              <ul className="space-y-3" role="list">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900">
                Legal
              </h3>
              <ul className="space-y-3" role="list">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Invoiceser. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Made with care for freelancers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
