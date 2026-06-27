import Link from "next/link";
import Image from "next/image";
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
  Receipt,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  MoreHorizontal,
  Instagram,
  Lock,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Star
} from "lucide-react";

import { Pricing } from "@/components/home/pricing";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";

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
      "See what you've earned, what's outstanding, and who owes you, all at a glance.",
    bg: "bg-violet-50",
    iconClass: "text-violet-600",
  },
  {
    icon: Sparkles,
    title: "AI Chatbot",
    description:
      "Ask questions about your cash flow in plain English, like \"Who owes me the most?\" or \"What was my best month?\", and get instant answers.",
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
      "AI chatbot (10 queries/month)",
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
      "Analytics & revenue forecasts",
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
  { value: "2,400+", label: "Active freelancers", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { value: "$4.2M", label: "Invoiced this month", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-100" },
  { value: "98%", label: "On-time payments", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-100" },
  { value: "< 2 min", label: "To create an invoice", icon: Zap, color: "text-violet-600", bg: "bg-violet-100" },
  { value: "150+", label: "Countries supported", icon: Globe, color: "text-rose-600", bg: "bg-rose-100" },
  { value: "4.9 / 5", label: "Average rating", icon: Star, color: "text-orange-500", bg: "bg-orange-100" },
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
      "Email the PDF directly to your client or share a secure public link. One click, done.",
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
    <div className="min-h-screen bg-white text-gray-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm shadow-primary-600/20 group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Invoice<span className="text-primary-600">ser</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {["How It Works", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 hover:bg-gray-800"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden text-sm font-bold text-gray-600 transition-colors hover:text-gray-900 md:block"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary-600/20 transition-transform hover:scale-105 hover:bg-primary-700"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero — Modern layout */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 bg-white">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/60 via-white to-white opacity-80" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <h1 className="max-w-4xl mx-auto text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl xl:text-7xl mb-8 animate-fade-in [animation-delay:100ms] opacity-0 fill-mode-forwards">
            Invoicing that gets you paid{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">faster</span>
              {/* decorative swoosh */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-violet-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg font-medium text-gray-500 mb-10 animate-fade-in [animation-delay:200ms] opacity-0 fill-mode-forwards leading-relaxed">
            Create, send, and track professional invoices in minutes. Automatic reminders, predictive analytics, and an AI assistant in one premium platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms] opacity-0 fill-mode-forwards">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-gray-900/20 transition-all hover:bg-gray-800 hover:scale-105"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 hover:scale-105"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-xs font-semibold text-gray-400 animate-fade-in [animation-delay:400ms] opacity-0 fill-mode-forwards">
            No credit card required. Cancel anytime.
          </p>

          {/* Dashboard Preview Image/Mockup */}
          <div className="mt-16 lg:mt-20 mx-auto max-w-6xl relative animate-fade-in [animation-delay:500ms] opacity-0 fill-mode-forwards">
            <div className="relative rounded-2xl border border-gray-200/60 bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200/60 bg-white px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="w-64 flex items-center justify-center gap-2 rounded-md bg-gray-100/80 px-3 py-1 font-mono text-[10px] text-gray-400 text-center">
                    <Lock className="w-3 h-3 text-gray-400" />
                    invoiceser.com
                  </div>
                </div>
                <div className="w-12" /> {/* Spacer */}
              </div>
              
              <div className="p-4 bg-gray-50/80 flex gap-6 h-[560px]">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-56 rounded-xl border border-gray-200/60 bg-white shadow-sm p-4 shrink-0">
                  <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 shadow-sm">
                      <Receipt className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-gray-900 tracking-tight">Invoice<span className="text-primary-600">ser</span></span>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: "Overview", active: true },
                      { icon: Banknote, label: "Invoices", active: false },
                      { icon: Users, label: "Clients", active: false },
                      { icon: BarChart2, label: "Analytics", active: false },
                      { icon: Sparkles, label: "AI Insights", active: false },
                      { icon: Settings, label: "Settings", active: false },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${item.active ? 'bg-primary-50 border border-primary-100 text-primary-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <item.icon className={`w-4 h-4 ${item.active ? 'text-primary-600' : 'text-gray-400'}`} />
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Good morning, Sarah 👋</h2>
                      <p className="text-sm font-medium text-gray-500 mt-1">Here is your invoice summary for today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm">
                        Last 30 Days
                      </div>
                      <button className="px-4 py-1.5 text-xs font-bold text-white bg-gray-900 rounded-lg shadow-sm hover:bg-gray-800">
                        New Invoice
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Invoices Paid", icon: CheckCircle2, val: "$24,800", count: "47 invoices", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100", trend: "+12.5%", trendIcon: TrendingUp, trendColor: "text-emerald-600", trendBg: "bg-emerald-100/50" },
                      { label: "Awaiting Payment", icon: Clock, val: "$3,200", count: "3 unpaid", color: "text-amber-500", bg: "bg-amber-50 border-amber-100", trend: "+2.1%", trendIcon: TrendingUp, trendColor: "text-amber-600", trendBg: "bg-amber-100/50" },
                      { label: "Overdue Invoices", icon: AlertCircle, val: "$950", count: "2 overdue", color: "text-rose-500", bg: "bg-rose-50 border-rose-100", trend: "-5.2%", trendIcon: TrendingDown, trendColor: "text-emerald-600", trendBg: "bg-emerald-100/50" }
                    ].map(s => (
                      <div key={s.label} className="rounded-xl border border-gray-200/80 bg-white shadow-sm p-4 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${s.bg}`}>
                              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
                          </div>
                        </div>
                        <div className="flex items-end gap-3 mb-1.5">
                          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.val}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold text-gray-500`}>{s.count} <span className="text-gray-400 font-medium">this month</span></p>
                          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${s.trendBg} ${s.trendColor}`}>
                            <s.trendIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{s.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gray-200/80 bg-white shadow-sm flex-1 p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-sm font-bold text-gray-900">Recent Invoices</h3>
                      <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View All</button>
                    </div>
                    <div className="space-y-3 flex-1 overflow-hidden">
                      {[
                        { client: "Acme Corp", amount: "$1,800.00", status: "Paid", color: "text-emerald-700 bg-emerald-50 border-emerald-200/50" },
                        { client: "Studio Blue", amount: "$950.00", status: "Sent", color: "text-blue-700 bg-blue-50 border-blue-200/50" },
                        { client: "Horizon Ltd", amount: "$2,400.00", status: "Overdue", color: "text-rose-700 bg-rose-50 border-rose-200/50" },
                      ].map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-extrabold text-gray-700 border border-gray-200">
                              {i.client.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{i.client}</p>
                              <p className="text-xs font-medium text-gray-500">INV-2026-{1047 + idx}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm font-extrabold text-gray-900">{i.amount}</p>
                            <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${i.color}`}>
                              {i.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats ticker */}
      <section
        className="overflow-hidden border-y-2 border-gray-200 bg-gray-50/80 py-10"
        aria-label="Platform statistics"
      >
        <div
          className="flex animate-marquee gap-6 whitespace-nowrap px-6"
          aria-hidden="true"
          style={{ width: "max-content" }}
        >
          {[...stats, ...stats].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-xl ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</span>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
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
      <section id="how-it-works" className="py-16 lg:py-24 bg-gray-900 text-white border-y border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              From invoice to payment in minutes
            </h2>
          </div>
          <ol className="relative grid grid-cols-1 gap-12 lg:grid-cols-3" role="list">
            {steps.map((step, index) => (
              <li key={step.number} className="relative flex flex-col items-center text-center group">
                {/* Arrow pointing to next step */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] pointer-events-none text-gray-700">
                    <svg className="w-full h-4" viewBox="0 0 100 24" fill="none" preserveAspectRatio="none">
                      <line x1="0" y1="12" x2="95" y2="12" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <path d="M 90 7 L 97 12 L 90 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gray-800 shadow-xl border border-gray-700 group-hover:-translate-y-2 group-hover:border-primary-500 transition-all duration-300 z-10">
                  <div className="absolute inset-0 rounded-3xl bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <step.icon className="relative h-10 w-10 text-primary-400" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-[11px] font-bold text-white shadow-sm ring-4 ring-gray-900">
                    {step.number.slice(-1)}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white z-10">{step.title}</h3>
                <p className="text-base font-medium leading-relaxed text-gray-400 max-w-sm z-10">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-16 lg:py-24 relative overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <p className="mb-4 text-sm font-bold tracking-widest text-primary-600 uppercase">Features</p>
            <h2 className="mb-6 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Everything you need to get paid
            </h2>
            <p className="text-lg leading-relaxed text-slate-500 font-medium">
              From first invoice to final payment, Invoiceser handles the entire billing workflow so you can focus on your work.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card group"
              >
                <div
                  aria-hidden="true"
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <f.icon className={`h-6 w-6 ${f.iconClass} transition-colors duration-300`} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Trusted by freelancers worldwide</h2>
            <p className="text-lg leading-relaxed text-gray-500 font-medium">Real feedback from people who invoice every day.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                color: "bg-primary-100 text-primary-700",
                rating: 5,
                quote: "The AI chatbot actually surfaced a client who had been slipping on payments every quarter. I renegotiated terms. That alone paid for the Pro plan.",
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
              <div key={t.name} className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-full opacity-60" />
                <div className="relative z-10 flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="relative z-10 text-gray-700 text-base font-medium leading-relaxed mb-8">&ldquo;{t.quote}&rdquo;</p>
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      <CTA />
      <Footer />
    </div>
  );
}
