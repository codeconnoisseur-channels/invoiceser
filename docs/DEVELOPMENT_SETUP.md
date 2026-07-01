# Development Guide

Welcome to the Invoiceser development guide! This document covers the technology stack, environment setup, and deployment process.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Backend / DB** | Convex (real-time, serverless) |
| **Authentication**| Clerk |
| **Email** | Nodemailer + React Email (SMTP) |
| **Analytics** | PostHog |
| **AI** | Groq (GPT OSS 120B) |
| **Payments** | KoraPay |
| **PDF** | `@react-pdf/renderer` |
| **UI** | Tailwind CSS + shadcn/ui + Radix UI |
| **Charts** | Recharts |
| **Notifications** | Sonner (toast) + Convex live queries |

---

## 2. Environment Variables

To run the project locally, you must configure the following variables in a `.env.local` file at the root of the project.

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
| `SMTP_HOST` | SMTP server host (e.g., smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (e.g., 587 or 465) |
| `SMTP_USER` | SMTP username / email address |
| `SMTP_PASSWORD` | SMTP password / app password |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL (e.g., https://app.posthog.com) |
| `GROQ_API_KEY` | Groq API key for AI features |
| `GROQ_MODEL_NAME` | Groq model (default: `gpt-oss-120b`) |
| `NEXT_PUBLIC_APP_URL` | Full public URL of the app (e.g. `http://localhost:3000`) |
| `KORAPAY_SECRET_KEY` | KoraPay secret key |
| `KORAPAY_ENCRYPTION_KEY` | KoraPay encryption key (for webhook HMAC verification) |
| `KORAPAY_AMOUNT` | Pro plan price (default: `12`) |
| `KORAPAY_CURRENCY` | Pro plan currency (default: `USD`) |

---

## 3. Local Setup Instructions

### 3.1 Prerequisites
- Node.js 18+
- Accounts for [Convex](https://convex.dev), [Clerk](https://clerk.com), [Groq](https://groq.com), [KoraPay](https://korapay.com), and [PostHog](https://posthog.com).
- An SMTP provider (like Gmail with App Passwords, SendGrid, or Mailgun).

### 3.2 Installation

```bash
git clone https://github.com/your-username/invoiceser.git
cd invoiceser
npm install
```

### 3.3 Set up Convex

Convex manages your database, API, and cron jobs.

```bash
npx convex dev
```
This command starts the Convex backend, applies schema migrations, and outputs your `NEXT_PUBLIC_CONVEX_URL`. Copy that value into your `.env.local` file.

### 3.4 Set up Webhooks (Clerk)

In your Clerk dashboard, create a webhook endpoint pointing to your Convex HTTP router:
```
https://your-convex-site-url/webhooks/clerk
```
Enable the `user.created`, `user.updated`, and `user.deleted` events. Copy the signing secret into `CLERK_WEBHOOK_SECRET`.

### 3.5 Run the App

With Convex running in one terminal, start the Next.js development server in another:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 4. Project Structure

```text
invoiceser/
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema definition
│   ├── invoices.ts          # Invoice queries & mutations
│   ├── crons.ts             # Scheduled jobs (overdue detection, reminders)
│   ├── webhooks.ts          # KoraPay + Clerk webhook handlers
│   ├── http.ts              # HTTP routes (/webhooks/...)
│   └── ...                  # Other backend logic (ai, payments, users)
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (app)/           # Authenticated app routes (dashboard, invoices, ai)
│   │   ├── admin/           # Internal admin panel
│   │   ├── invoice/[token]/ # Public invoice view (no auth required)
│   │   ├── api/             # Next.js Route Handlers (pdf, email, payments)
│   │   └── page.tsx         # Public landing page
│   │
│   ├── components/          # Reusable React components (UI, dashboard, layout)
│   ├── emails/              # React Email templates (invoice, reminder)
│   └── lib/                 # Utility functions (currency formatting, dates, tailwind)
```

---

## 5. Deployment

Invoiceser is built to deploy seamlessly on Vercel.

1. Connect your GitHub repository to Vercel.
2. Ensure you have configured **Production** mode in Clerk, Convex, and KoraPay.
3. Add all your production environment variables to the Vercel dashboard.
4. Set up the KoraPay webhook endpoint in your KoraPay merchant dashboard pointing to your live Convex URL (`{CONVEX_SITE_URL}/webhooks/korapay`).
5. Ensure your PostHog tracking is pointing to your production URL.

```bash
npm run build
npm run start
```
