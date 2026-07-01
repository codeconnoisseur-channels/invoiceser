import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, BarChart2, CheckCircle2, FileText, Globe, LayoutDashboard, Lock, Receipt, Send, Settings, Shield, Sparkles, Star, Users, Zap, Clock, AlertCircle, TrendingUp, TrendingDown, Banknote } from "lucide-react";

import { Pricing } from "@/components/home/pricing";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: FileText,
    title: "Professional Invoices",
    description: "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions. Built for freelancers who care about their brand.",
    className: "md:col-span-1 md:row-span-1 bg-gradient-to-br from-gray-900 to-gray-800",
    iconBg: "bg-blue-500/20", iconClass: "text-blue-400",
    isDark: true
  },
  {
    icon: Zap,
    title: "Instant PDF & Email",
    description: "Generate a PDF and send it to your client in one click. No attachments necessary.",
    className: "md:col-span-1 md:row-span-1 bg-gray-900",
    iconBg: "bg-amber-500/20", iconClass: "text-amber-400",
    isDark: true
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Bill clients globally in USD, GBP, EUR and 12 other currencies effortlessly.",
    className: "md:col-span-1 md:row-span-1 bg-gray-900",
    iconBg: "bg-emerald-500/20", iconClass: "text-emerald-400",
    isDark: true
  },
  {
    icon: Sparkles,
    title: "AI Chatbot Assistant",
    description: "Ask questions about your cash flow in plain English, and get instant, actionable insights on your business health.",
    className: "md:col-span-1 md:row-span-1 bg-gray-800 text-white shadow-xl shadow-gray-900/10",
    iconBg: "bg-gray-700", iconClass: "text-primary-400",
    isDark: true
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Every invoice is private to your account. Secure links ensure only clients see it.",
    className: "md:col-span-1 md:row-span-1 bg-gray-900",
    iconBg: "bg-slate-700", iconClass: "text-slate-300",
    isDark: true
  },
  {
    icon: BarChart2,
    title: "Revenue Analytics",
    description: "See what you've earned, what's outstanding, and who owes you at a glance.",
    className: "md:col-span-1 md:row-span-1 bg-gray-900",
    iconBg: "bg-violet-500/20", iconClass: "text-violet-400",
    isDark: true
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
    title: "Create invoice",
    description: "Fill in client details and branding.",
  },
  {
    number: "02",
    icon: Send,
    title: "Send instantly",
    description: "Share via secure link or email.",
  },
  {
    number: "03",
    icon: Banknote,
    title: "Get paid",
    description: "Reminders follow up automatically.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-primary-900 selection:text-primary-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {["How It Works", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-semibold text-gray-400 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden text-sm font-semibold text-gray-300 transition-colors hover:text-white md:block"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:bg-primary-700"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950/80 to-gray-950 opacity-100" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
          <h1 className="max-w-4xl mx-auto text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl mb-8 animate-fade-in [animation-delay:100ms] opacity-0 fill-mode-forwards leading-[1.1]">
            Invoicing that gets you paid{" "}
            <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              faster
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-500/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg font-medium text-gray-400 mb-10 animate-fade-in [animation-delay:200ms] opacity-0 fill-mode-forwards leading-relaxed">
            Create, send, and track professional invoices in minutes. Automatic reminders, predictive analytics, and an AI assistant in one premium platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms] opacity-0 fill-mode-forwards">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_8px_30px_rgb(37,99,235,0.2)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(37,99,235,0.3)] hover:bg-primary-500"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-gray-800 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-800"
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-sm font-medium text-gray-400 animate-fade-in [animation-delay:400ms] opacity-0 fill-mode-forwards">
            No credit card required. Cancel anytime.
          </p>

          {/* Dashboard Preview Image/Mockup */}
          <div className="mt-20 lg:mt-24 mx-auto max-w-5xl relative animate-fade-in [animation-delay:500ms] opacity-0 fill-mode-forwards">
            
            {/* Floating Elements for Depth */}
            <div className="absolute -left-10 top-24 z-20 hidden lg:flex items-center gap-4 bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 animate-[slide-up_1s_ease-out_forwards] [animation-delay:800ms] opacity-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Payment Received</p>
                <p className="text-base font-extrabold text-white tracking-tight">$2,400.00</p>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-32 z-20 hidden lg:flex flex-col gap-2 bg-gray-900/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 animate-[slide-up_1s_ease-out_forwards] [animation-delay:1000ms] opacity-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <p className="text-xs font-bold text-white">AI Insight</p>
              </div>
              <p className="text-sm font-medium text-gray-400">Revenue is up 12% this month.</p>
            </div>

            <div className="relative rounded-2xl border border-gray-800 bg-gray-950 shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden ring-1 ring-white/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="w-64 flex items-center justify-center gap-2 rounded-md bg-gray-800 border border-gray-700 px-3 py-1 font-mono text-[10px] text-gray-300 text-center shadow-sm">
                    <Lock className="w-3 h-3 text-gray-500" />
                    invoiceser.com
                  </div>
                </div>
                <div className="w-12" />
              </div>
              <div className="p-4 bg-gray-950 flex gap-6 h-[560px]">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-56 rounded-xl border border-gray-800 bg-gray-900 shadow-sm p-4 shrink-0">
                  <Logo className="mb-8 px-2" textClassName="text-white" />
                  <nav className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: "Overview", active: true },
                      { icon: Banknote, label: "Invoices", active: false },
                      { icon: Users, label: "Clients", active: false },
                      { icon: BarChart2, label: "Analytics", active: false },
                      { icon: Sparkles, label: "AI Insights", active: false },
                      { icon: Settings, label: "Settings", active: false },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${item.active ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                        <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                        {item.label}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Good morning, Sarah</h2>
                      <p className="text-sm font-medium text-gray-500 mt-1">Here is your invoice summary for today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 text-xs font-bold text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700">
                        New Invoice
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Invoices Paid", icon: CheckCircle2, val: "$24,800", count: "47 invoices", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30", trend: "+12.5%", trendIcon: TrendingUp, trendColor: "text-emerald-400", trendBg: "bg-emerald-500/10" },
                      { label: "Awaiting Payment", icon: Clock, val: "$3,200", count: "3 unpaid", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30", trend: "+2.1%", trendIcon: TrendingUp, trendColor: "text-amber-400", trendBg: "bg-amber-500/10" },
                      { label: "Overdue Invoices", icon: AlertCircle, val: "$950", count: "2 overdue", color: "text-rose-400", bg: "bg-rose-500/20 border-rose-500/30", trend: "-5.2%", trendIcon: TrendingDown, trendColor: "text-emerald-400", trendBg: "bg-emerald-500/10" }
                    ].map(s => (
                      <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm p-4 relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`p-1.5 rounded-lg ${s.bg}`}>
                            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                        </div>
                        <div className="flex items-end gap-3 mb-2">
                          <p className="text-2xl font-bold text-white tracking-tight">{s.val}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold text-gray-400`}>{s.count}</p>
                          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${s.trendBg} ${s.trendColor}`}>
                            <s.trendIcon className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{s.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm flex-1 p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
                    </div>
                    <div className="space-y-3 flex-1 overflow-hidden">
                      {[
                        { client: "Acme Corp", amount: "$1,800.00", status: "Paid", color: "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30" },
                        { client: "Studio Blue", amount: "$950.00", status: "Sent", color: "text-blue-400 bg-blue-500/10 ring-1 ring-blue-500/30" },
                        { client: "Horizon Ltd", amount: "$2,400.00", status: "Overdue", color: "text-rose-400 bg-rose-500/10 ring-1 ring-rose-500/30" },
                      ].map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-800 bg-gray-800/50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-200 border border-gray-600 shadow-sm">
                              {i.client.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{i.client}</p>
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">INV-2026-{1047 + idx}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm font-bold text-white tracking-tight">{i.amount}</p>
                            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${i.color}`}>
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
        className="relative overflow-hidden border-y border-gray-800 bg-gray-900/30 py-6 lg:py-10"
        aria-label="Platform statistics"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10" />
        
        <div 
          className="flex animate-marquee items-center" 
          aria-hidden="true"
          style={{ width: "max-content" }}
        >
          {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
            <div key={i} className="flex items-center gap-8 px-6 lg:px-8 group transition-opacity hover:opacity-100 opacity-70">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl lg:text-2xl font-extrabold text-white tracking-tighter drop-shadow-sm">{s.value}</span>
                <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{s.label}</span>
              </div>
              {/* Optional separator */}
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700/50" />
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

      {/* How It Works - Horizontal Timeline */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold text-white tracking-tighter sm:text-5xl">
              From invoice to payment in minutes
            </h2>
            <p className="text-lg leading-relaxed text-gray-400 font-medium">
              We've streamlined the entire billing process so you can spend less time chasing payments and more time doing what you love.
            </p>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-6 right-6 hidden h-0.5 bg-gray-800 lg:block" />
            
            <ol className="relative grid grid-cols-1 gap-12 lg:grid-cols-3" role="list">
              {steps.map((step, index) => (
                <li key={step.number} className="relative flex flex-col items-start lg:items-center text-left lg:text-center group">
                  <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-800 group-hover:-translate-y-1 transition-transform duration-300 z-10 ring-4 ring-gray-950">
                    <step.icon className="relative h-8 w-8 text-primary-500" aria-hidden="true" />
                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow-sm">
                      {step.number.slice(-1)}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white tracking-tight">{step.title}</h3>
                  <p className="text-base font-medium leading-relaxed text-gray-400 max-w-xs">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="bg-gray-950 py-24 lg:py-32 border-y border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20 max-w-3xl mx-auto text-center">
            <p className="mb-4 text-xs font-bold tracking-widest text-primary-500 uppercase">Features</p>
            <h2 className="mb-6 text-4xl font-bold text-white tracking-tighter sm:text-5xl">
              Everything you need to get paid
            </h2>
            <p className="text-lg leading-relaxed text-gray-400 font-medium">
              From first invoice to final payment, Invoiceser handles the entire billing workflow with premium tools designed for modern freelancers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[2rem] border border-gray-800 shadow-sm p-6 lg:p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${f.className}`}
              >
                <div
                  aria-hidden="true"
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.iconBg}`}
                >
                  <f.icon className={`h-5 w-5 ${f.iconClass}`} />
                </div>
                <div className="mt-6">
                  <h3 className={`mb-2 text-xl font-bold tracking-tight ${f.isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${f.isDark ? 'text-gray-400' : 'text-gray-500'}`}>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Dark Section */}
      <section className="py-24 lg:py-32 bg-gray-950 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold text-white tracking-tighter sm:text-5xl">Trusted by the best freelancers</h2>
            <p className="text-lg leading-relaxed text-gray-400 font-medium">Real feedback from professionals who rely on Invoiceser every day.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Adaeze Okonkwo",
                role: "Brand Designer · Lagos",
                avatar: "AO",
                quote: "I used to spend an hour every week chasing payments. Invoiceser automated the reminders and now I barely think about it. My clients pay faster too.",
              },
              {
                name: "James Harrington",
                role: "Freelance Developer · London",
                avatar: "JH",
                quote: "The AI chatbot actually surfaced a client who had been slipping on payments every quarter. I renegotiated terms. That alone paid for the Pro plan.",
              },
              {
                name: "Priya Mehta",
                role: "Content Strategist · Toronto",
                avatar: "PM",
                quote: "Beautiful invoices, zero fuss. My international clients actually comment on how professional the emails look. Worth every penny.",
              },
            ].map((t, idx) => (
              <div key={idx} className="relative rounded-[2rem] border border-gray-800 bg-gray-900 p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-gray-800 flex flex-col justify-between">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-base font-medium leading-relaxed mb-10">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-gray-800 text-white border border-gray-700 shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{t.name}</p>
                    <p className="text-xs font-medium text-gray-400 mt-1">{t.role}</p>
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
