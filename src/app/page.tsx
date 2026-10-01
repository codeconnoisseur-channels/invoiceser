import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Banknote, BarChart2, Check, FileText, Globe, Send, Shield, Sparkles, Star, Zap } from "lucide-react";
import { Pricing } from "@/components/home/pricing";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { Logo } from "@/components/ui/logo";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import styles from "./(public)/landing.module.css";

const features = [
  { icon: FileText, title: "Professional Invoices", description: "Create branded invoices in seconds. Add your logo, set custom colours, and include payment instructions. Built for freelancers who care about their brand." },
  { icon: Zap, title: "Instant PDF & Email", description: "Generate a PDF and send it to your client in one click. No attachments necessary." },
  { icon: Globe, title: "Multi-Currency", description: "Bill clients globally in USD, GBP, EUR and 12 other currencies effortlessly." },
  { icon: Sparkles, title: "AI Chatbot Assistant", description: "Ask questions about your cash flow in plain English, and get instant, actionable insights on your business health." },
  { icon: Shield, title: "Secure by Default", description: "Every invoice is private to your account. Secure links ensure only clients see it." },
  { icon: BarChart2, title: "Revenue Analytics", description: "See what you've earned, what's outstanding, and who owes you at a glance." },
];

const stats = [
  { value: "2,400+", label: "Active freelancers" }, { value: "$4.2M", label: "Invoiced this month" },
  { value: "98%", label: "On-time payments" }, { value: "< 2 min", label: "To create an invoice" },
  { value: "150+", label: "Countries supported" }, { value: "4.9 / 5", label: "Average rating" },
];

const steps = [
  { number: "01", icon: FileText, title: "Create invoice", description: "Fill in client details and branding." },
  { number: "02", icon: Send, title: "Send instantly", description: "Share via secure link or email." },
  { number: "03", icon: Banknote, title: "Get paid", description: "Reminders follow up automatically." },
];

const testimonials = [
  { name: "Adaeze Okonkwo", role: "Brand Designer · Lagos", initials: "AO", quote: "I used to spend an hour every week chasing payments. Invoiceser automated the reminders and now I barely think about it. My clients pay faster too." },
  { name: "James Harrington", role: "Freelance Developer · London", initials: "JH", quote: "The AI chatbot actually surfaced a client who had been slipping on payments every quarter. I renegotiated terms. That alone paid for the Pro plan." },
  { name: "Priya Mehta", role: "Content Strategist · Toronto", initials: "PM", quote: "Beautiful invoices, zero fuss. My international clients actually comment on how professional the emails look. Worth every penny." },
];

function Brand() {
  return <Logo className={styles.brand} textClassName={styles.brandText} />;
}

function Heading({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return <div className={styles.sectionHeading}>{eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}<h2>{title}</h2><p>{children}</p></div>;
}

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}><div className={styles.navShell}><Brand /><nav className={styles.navLinks} aria-label="Main navigation"><a href="#how-it-works">How It Works</a><a href="#features">Features</a><a href="#pricing">Pricing</a></nav><div className={styles.navActions}><SignedIn><Link href="/dashboard" className={styles.navPrimary}>Dashboard</Link></SignedIn><SignedOut><Link href="/sign-in" className={styles.signIn}>Log in</Link><Link href="/sign-up" className={styles.navPrimary}>Get Started</Link></SignedOut></div></div></header>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroCopy}><h1>Invoicing that gets<br />you paid <em>faster</em></h1><p className={styles.heroDescription}>Create, send, and track professional invoices in minutes. Automatic reminders, predictive analytics, and an AI assistant in one premium platform.</p><div className={styles.heroActions}><Link href="/sign-up" className={styles.primaryButton}>Start for free <ArrowRight aria-hidden="true" /></Link><a href="#how-it-works" className={styles.secondaryButton}>See how it works</a></div><p className={styles.heroNote}><Check aria-hidden="true" />No credit card required. Cancel anytime.</p></div>
          <div className={styles.productStage} aria-label="Invoiceser dashboard preview"><div className={styles.browserBar} aria-hidden="true"><span /><span /><span /><div>invoiceser.com</div></div><div className={styles.productViewport}><DashboardPreview /></div></div>
        </section>
        <section className={styles.stats} aria-label="Platform statistics"><p>Trusted by independent businesses worldwide</p><div className={styles.statsGrid}>{stats.map((stat)=><div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>
        <section id="how-it-works" className={styles.stepsSection}><Heading title="From invoice to payment in minutes">We've streamlined the entire billing process so you can spend less time chasing payments and more time doing what you love.</Heading><ol className={styles.steps}>{steps.map((step,index)=><li key={step.number}><div className={styles.stepVisual}><span className={styles.stepNumber}>{step.number.slice(-1)}</span><step.icon aria-hidden="true" /></div>{index<steps.length-1?<span className={styles.stepLine} aria-hidden="true" />:null}<h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></section>
        <section id="features" className={styles.featuresSection}><Heading eyebrow="Features" title="Everything you need to get paid">From first invoice to final payment, Invoiceser handles the entire billing workflow with premium tools designed for modern freelancers.</Heading><ul className={styles.featureList} role="list">{features.map((feature)=><li key={feature.title}><span className={styles.iconBox}><feature.icon aria-hidden="true" /></span><div><h3>{feature.title}</h3><p>{feature.description}</p></div></li>)}</ul></section>
        <section className={styles.testimonialsSection}><Heading title="Trusted by global freelancers">Real feedback from professionals who rely on Invoiceser every day.</Heading><div className={styles.testimonials}>{testimonials.map((testimonial,index)=><article key={testimonial.name} className={index===1?styles.featuredTestimonial:undefined}><div className={styles.stars} aria-label="5 out of 5 stars">{Array.from({length:5}).map((_,star)=><Star key={star} aria-hidden="true" />)}</div><blockquote>“{testimonial.quote}”</blockquote><footer><span className={styles.avatar}>{testimonial.initials}</span><div><strong>{testimonial.name}</strong><p>{testimonial.role}</p></div></footer></article>)}</div></section>
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
