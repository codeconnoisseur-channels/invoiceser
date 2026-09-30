import Link from "next/link";
import { Newsreader } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleCheck,
  Clock3,
  FileCheck2,
  Globe2,
  Receipt,
  RefreshCcw,
  Send,
  ShieldCheck,
} from "lucide-react";

import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";
import { Pricing } from "@/components/home/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

const editorial = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
});

const workflow = [
  {
    number: "01",
    title: "Add the essentials",
    description: "Client, service, amount, and due date. Start simple and add detail only when it helps.",
  },
  {
    number: "02",
    title: "Send it professionally",
    description: "Your PDF, email, and secure client link are prepared together—ready in one click.",
  },
  {
    number: "03",
    title: "Let reminders follow up",
    description: "Invoiceser keeps an eye on due dates and nudges clients while you focus on the work.",
  },
];

const features = [
  {
    icon: FileCheck2,
    title: "Invoices that look like you",
    description: "Use your logo, colours, payment details, and tax labels without wrestling with a template.",
  },
  {
    icon: Send,
    title: "Send once, track clearly",
    description: "Email the PDF, share a secure link, and see invoice status from one reliable record.",
  },
  {
    icon: RefreshCcw,
    title: "Follow-ups on autopilot",
    description: "Friendly reminders go out when an invoice is due, so chasing payment stops taking your week.",
  },
  {
    icon: Globe2,
    title: "Built for global work",
    description: "Invoice in 15+ currencies and add Sales Tax, VAT, GST, WHT, or your own tax label.",
  },
  {
    icon: BarChart3,
    title: "A clear view of cash flow",
    description: "See paid, outstanding, and overdue totals without turning your business into a spreadsheet.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "Account data stays protected and every client invoice is shared through its own secure link.",
  },
];

const trustPoints = [
  "Unlimited invoices on the free plan",
  "No credit card required",
  "Set up in under two minutes",
];

function InvoicePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:mr-0">
      <div aria-hidden="true" className="absolute -bottom-5 -right-5 hidden size-full border border-border bg-secondary lg:block" />
      <Card className="relative overflow-hidden rounded-none border-foreground/15 shadow-[0_24px_70px_rgba(54,45,34,0.12)]">
        <CardHeader className="gap-8 border-b border-border p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Receipt className="size-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base">Northline Studio</CardTitle>
                <CardDescription>Design &amp; strategy</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Invoice</p>
              <p className="mt-1 font-mono text-sm font-semibold">#INV-0248</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Billed to</p>
              <p className="mt-1 font-medium">Aperture &amp; Co.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Issued</p>
              <p className="mt-1 font-medium">30 Sep 2026</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="paid" className="mt-1 gap-1.5">
                <CircleCheck className="size-3" aria-hidden="true" /> Paid
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-4 text-sm">
            <div className="border-b border-border pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Description</div>
            <div className="border-b border-border pb-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Amount</div>
            <div>
              <p className="font-medium">Brand identity direction</p>
              <p className="mt-1 text-xs text-muted-foreground">Strategy, concepts, and final system</p>
            </div>
            <p className="font-mono font-medium">$2,400</p>
            <div>
              <p className="font-medium">Launch support</p>
              <p className="mt-1 text-xs text-muted-foreground">Asset handoff and rollout</p>
            </div>
            <p className="font-mono font-medium">$600</p>
          </div>

          <Separator className="my-7" />

          <div className="ml-auto flex max-w-52 flex-col gap-3 text-sm">
            <div className="flex justify-between gap-6 text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">$3,000</span>
            </div>
            <div className="flex justify-between gap-6 text-muted-foreground">
              <span>Tax</span>
              <span className="font-mono text-foreground">$225</span>
            </div>
            <div className="flex justify-between gap-6 border-t border-foreground pt-3 text-base font-semibold">
              <span>Total</span>
              <span className="font-mono">$3,225</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-4 border-t border-border bg-secondary/60 px-6 py-4 sm:px-8">
          <p className="text-xs text-muted-foreground">Payment received 28 Sep</p>
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Check className="size-4" aria-hidden="true" /> Settled in full
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={`landing-shell min-h-screen bg-background text-foreground ${editorial.variable}`}>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="touch" className="hidden sm:inline-flex"><Link href="/sign-in">Log in</Link></Button>
            <Button asChild size="touch"><Link href="/sign-up">Start free</Link></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Invoicing for independent work</div>
              <h1 className="max-w-xl text-[clamp(3rem,7vw,5.9rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                Invoice today.
                <span className={`${editorial.className} mt-2 block font-normal italic text-primary`}>Get back to work.</span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Create a polished invoice, send it, and know exactly what happens next. Invoiceser keeps the admin tidy so your real work gets the attention.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">Create your first invoice<ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg"><a href="#how-it-works">See how it works</a></Button>
              </div>
              <ul className="mt-7 flex flex-col gap-2 text-sm text-muted-foreground" role="list">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2"><Check className="size-4 text-primary" aria-hidden="true" />{point}</li>
                ))}
              </ul>
            </div>
            <InvoicePreview />
          </div>
        </section>

        <section aria-label="Product benefits" className="border-b border-border bg-card">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:grid-cols-3 sm:px-8 lg:px-10">
            <div className="border-b border-border py-6 sm:border-b-0 sm:border-r sm:pr-8"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Create</dt><dd className="mt-2 text-base font-medium">Four fields to a finished invoice</dd></div>
            <div className="border-b border-border py-6 sm:border-b-0 sm:border-r sm:px-8"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Send</dt><dd className="mt-2 text-base font-medium">PDF, email, and secure link together</dd></div>
            <div className="py-6 sm:pl-8"><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Track</dt><dd className="mt-2 text-base font-medium">Clear status and automatic reminders</dd></div>
          </dl>
        </section>

        <section id="how-it-works" className="scroll-mt-16 border-b border-border py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">A shorter billing day</p>
                <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">From finished work to sent invoice in minutes.</h2>
              </div>
              <ol className="border-t border-foreground" role="list">
                {workflow.map((step) => (
                  <li key={step.number} className="grid gap-3 border-b border-border py-7 sm:grid-cols-[64px_180px_1fr] sm:items-start sm:gap-5">
                    <span className="font-mono text-xs text-primary">{step.number}</span>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="max-w-md text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-b border-border bg-card py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-6 border-b border-foreground pb-8 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">What you need, quietly handled</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Less invoice admin. More useful work.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">Every feature earns its place by helping you send faster, look professional, or get paid sooner.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <article key={feature.title} className={`border-b border-border py-8 sm:px-7 ${index % 2 === 0 ? "sm:border-r" : ""} ${index % 3 !== 2 ? "lg:border-r" : "lg:border-r-0"}`}>
                  <feature.icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="mt-7 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Built for the way you work</p>
              <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><Clock3 className="size-5" aria-hidden="true" /><span>Fewer follow-ups. A clearer week.</span></div>
            </div>
            <blockquote>
              <p className={`${editorial.className} max-w-4xl text-3xl font-normal italic leading-tight tracking-[-0.025em] sm:text-5xl`}>“I send the invoice while the project is still fresh, and the reminders take care of themselves. It feels like one less job to manage.”</p>
              <footer className="mt-8 text-sm"><p className="font-semibold">Adaeze Okonkwo</p><p className="mt-1 text-muted-foreground">Independent brand designer, Lagos</p></footer>
            </blockquote>
          </div>
        </section>

        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
