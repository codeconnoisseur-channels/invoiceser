# Invoiceser

AI-powered invoicing for freelancers and small businesses. Create professional invoices, manage clients, track payments, and get AI-driven insights — all in one place.

---

## Features

- **Live invoice preview** — See exactly how your invoice looks as you build it. No guessing, no back-and-forth.
- **Invoicing** — Create, send, and manage invoices with draft and published states, PDF generation, and shareable public links.
- **Client management** — Store clients (individual or business), with contact details, phone, address, and website. Click any client to see all their invoices.
- **Payment tracking** — Record full or partial payments. Dashboard stats and wallet summary update in real time to reflect collected vs outstanding amounts.
- **Automatic email reminders** — Invoiceser emails your clients on your schedule — before and after the due date — so you never have to chase a payment manually.
- **Email delivery** — Send invoices via Resend with a PDF attached. Custom reply-to uses your business email from settings.
- **Real-time notifications** — Get notified the moment a client views your invoice, when a payment is recorded, or when an invoice goes overdue. Powered by Convex's real-time subscriptions.
- **AI assistant** — Chat with your invoice data powered by Groq (Llama 3). Ask things like "Who owes me the most?" or "What was my best month?" and get instant answers.
- **Analytics** — Revenue charts and breakdowns across time ranges (30d / 90d / 365d / all time).
- **Multi-currency** — Set a default currency per account. Earnings wallet shows actual collected amounts per currency with no forced conversion.
- **Custom branding (Pro)** — Your own fonts, invoice style, and email domain. No Invoiceser mention anywhere on your invoices or emails.
- **Pro plan** — Upgrade via KoraPay to unlock unlimited AI queries, custom branding, and predictive analytics.
- **Dark mode** — Full light/dark theme support.
- **Admin panel** — Internal dashboard for managing users, announcements, support tickets, and audit logs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Backend / Database | Convex (real-time, serverless) |
| Authentication | Clerk |
| Email | Resend + React Email |
| AI | Groq (Llama 3 70B) |
| Payments | KoraPay |
| PDF | `@react-pdf/renderer` |
| UI | Tailwind CSS + shadcn/ui + Radix UI |
| Charts | Recharts |
| Notifications | Sonner (toast) + Convex real-time |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account
- A [Resend](https://resend.com) account
- A [Groq](https://groq.com) account
- A [KoraPay](https://korapay.com) merchant account (for payments)

### 1. Clone and install

```bash
git clone https://github.com/your-username/invoiceser.git
cd invoiceser
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#environment-variables) section below for details on each key.

### 3. Set up Convex

```bash
npx convex dev
```

This starts the Convex backend, runs schema migrations, and outputs your `NEXT_PUBLIC_CONVEX_URL`. Copy that value into `.env.local`.

### 4. Set up Clerk webhooks

In your Clerk dashboard, create a webhook endpoint pointing to:

```
https://your-convex-site-url/webhooks/clerk
```

Enable the `user.created`, `user.updated`, and `user.deleted` events. Copy the signing secret into `CLERK_WEBHOOK_SECRET`.

> The Convex site URL is your Convex deployment's HTTP endpoint — it looks like `https://your-project.convex.site`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path (default: `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path (default: `/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in (default: `/dashboard`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up (default: `/onboarding`) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Convex HTTP site URL (for KoraPay webhook) |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `GROQ_API_KEY` | Groq API key for AI features |
| `GROQ_MODEL_NAME` | Groq model (default: `llama3-70b-8192`) |
| `NEXT_PUBLIC_APP_URL` | Full public URL of the app (e.g. `https://invoiceser.com`) |
| `KORAPAY_SECRET_KEY` | KoraPay secret key |
| `KORAPAY_ENCRYPTION_KEY` | KoraPay encryption key (for webhook HMAC verification) |
| `KORAPAY_AMOUNT` | Pro plan price (default: `12`) |
| `KORAPAY_CURRENCY` | Pro plan currency (default: `USD`) |

> **Note:** `NEXT_PUBLIC_CONVEX_SITE_URL` is required for KoraPay to send payment webhooks back to your app. Without it, the upgrade webhook will not fire and users won't be automatically upgraded after payment.

---

## Project Structure

```
invoiceser/
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── invoices.ts          # Invoice queries & mutations
│   ├── clients.ts           # Client CRUD
│   ├── payments.ts          # Payment recording & KoraPay verification
│   ├── settings.ts          # User settings
│   ├── users.ts             # User management & plan upgrades
│   ├── webhooks.ts          # KoraPay + Clerk webhook handlers
│   ├── http.ts              # HTTP routes (/webhooks/...)
│   ├── ai.ts                # AI insights & chat
│   ├── notifications.ts     # Real-time in-app notifications
│   ├── reminders.ts         # Automatic payment reminder emails
│   └── crons.ts             # Scheduled jobs (overdue detection, reminders)
│
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated app routes
│   │   │   ├── dashboard/   # Dashboard with stats & wallet
│   │   │   ├── invoices/    # Invoice list, detail, new, edit
│   │   │   ├── clients/     # Client management
│   │   │   ├── analytics/   # Revenue analytics
│   │   │   ├── ai/          # AI assistant
│   │   │   ├── settings/    # Account, branding & payment settings
│   │   │   ├── onboarding/  # New user onboarding wizard
│   │   │   ├── upgrade/     # Pro upgrade & success page
│   │   │   └── support/     # Support tickets
│   │   ├── admin/           # Internal admin panel
│   │   ├── invoice/[token]/ # Public invoice view (no auth required)
│   │   ├── api/
│   │   │   ├── email/       # Send invoice + reminder emails
│   │   │   ├── payments/    # KoraPay checkout initiation
│   │   │   ├── pdf/         # PDF generation endpoint
│   │   │   └── webhooks/    # Clerk webhook receiver
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── invoices/        # Live invoice preview, status badge, form
│   │   ├── dashboard/       # Onboarding checklist
│   │   ├── layout/          # Sidebar, app shell, theme toggle
│   │   ├── notifications/   # Real-time notification bell
│   │   ├── phone-input.tsx  # Country selector + dial code input
│   │   └── upgrade-modal.tsx
│   │
│   ├── emails/              # React Email templates
│   │   ├── invoice-email.tsx
│   │   └── reminder-email.tsx
│   │
│   └── lib/
│       ├── currency.ts      # Supported currencies & formatting
│       ├── dates.ts         # Date formatting helpers
│       └── utils.ts         # Tailwind class utilities
```

---

## Key Flows

### Invoice lifecycle

```
Draft → Sent → (Overdue) → Paid
              ↘ Voided → Reissued (new draft)
```

Invoices move to **Overdue** automatically via a Convex cron job that runs daily. Payments can be recorded in full or as partial amounts — partial payments update the dashboard stats immediately.

### Real-time notifications

When a client opens their invoice link, a notification appears in the app in real time — no refresh needed. Notifications are also triggered when a payment is recorded and when an invoice becomes overdue. All powered by Convex's live query subscriptions.

### Automatic reminders

A cron job checks daily for invoices approaching or past their due date. If automatic reminders are enabled in settings, Resend sends a reminder email to the client — on the schedule the user configures (e.g. 3 days before and 3 days after the due date).

### Payment / Pro upgrade flow

1. User clicks "Upgrade to Pro" → `/api/payments/initiate` creates a KoraPay checkout session
2. User completes payment on KoraPay's hosted page
3. KoraPay redirects to `/upgrade/success` with a `?reference=` param
4. The success page calls the `verifyKorapayAndUpgrade` Convex action, which confirms the payment directly with KoraPay's API and upgrades the user's plan
5. KoraPay also sends a webhook to `{CONVEX_SITE_URL}/webhooks/korapay` as a secondary confirmation path

### Email delivery

Invoices are sent via Resend from `onboarding@resend.dev` (or your custom domain on Pro) with the business name as the sender display name. A PDF is generated and attached automatically. Custom reply-to uses the business email from settings.

---

## Deployment

The app deploys to any platform that supports Next.js (Vercel recommended).

```bash
npm run build
npm run start
```

In production:
- Set `NEXT_PUBLIC_APP_URL` to your live domain
- Set `NEXT_PUBLIC_CONVEX_SITE_URL` to your Convex deployment's HTTP site URL
- Configure Clerk for **Production** mode (removes the `[Development]` prefix from auth emails)
- Set up KoraPay webhook endpoint in your KoraPay merchant dashboard pointing to `{CONVEX_SITE_URL}/webhooks/korapay`
- Verify your sending domain in Resend and update the `from` address in `send-invoice/route.ts`

---

## Plans

| Feature | Free | Pro |
|---|---|---|
| Invoices | Unlimited | Unlimited |
| Clients | Unlimited | Unlimited |
| Live invoice preview | ✓ | ✓ |
| PDF download & email delivery | ✓ | ✓ |
| Automatic payment reminders | ✓ | ✓ |
| Real-time notifications | ✓ | ✓ |
| AI queries / month | 10 | Unlimited |
| Analytics | Basic | Predictive |
| Custom branding (fonts, invoice style, email domain) | — | ✓ |
| Your brand only — no Invoiceser mention | — | ✓ |
