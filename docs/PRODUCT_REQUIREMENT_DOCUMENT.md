# Product Overview & Requirements (PRD)

## 1. Executive Summary
**Invoiceser** is an AI-powered invoicing and payments application designed for freelancers, creators, and small agencies. It streamlines the entire billing workflow from invoice creation to payment collection, augmented by real-time notifications and conversational AI.

## 2. Problem Statement
Freelancers and small agencies often face the following pain points when managing their business:
- **Fragmented Tools**: Juggling between Word/Excel for invoices, a separate payment gateway, and spreadsheets for tracking outstanding payments.
- **Delayed Payments**: Chasing clients for payments is awkward and time-consuming.
- **Lack of Visibility**: Difficulty answering simple business questions (e.g., "How much did I make last month?", "Who owes me the most?").
- **Unprofessional Presentation**: Poorly formatted, generic invoices can make a business look amateurish.

## 3. The Solution
Invoiceser centralizes and automates the invoicing process:
- **Beautiful, customizable invoices** that build trust and brand identity.
- **Automated payment reminders** so users never have to manually chase a client.
- **Real-time dashboard and wallet** that instantly reflects collected and pending payments.
- **Groq-powered AI Assistant** that can instantly answer plain-English questions about cash flow, revenue, and clients.

## 4. Core Features

### 4.1 Invoicing Engine
- **Live Preview Builder**: WYSIWYG editor where users see the invoice exactly as the client will see it.
- **Draft & Published States**: Ability to save work in progress and publish when ready.
- **Multi-currency Support**: Bill in USD, GBP, EUR, and 12 other currencies.
- **Tax Options**: Built-in support for Sales Tax and VAT.
- **PDF Generation & Email**: Instant PDF creation and one-click emailing via SMTP / Nodemailer.

### 4.2 Client Management
- Contact directory for individual and business clients.
- Historical view of all invoices per client.

### 4.3 Payments & Tracking
- **Wallet Overview**: Dashboard strictly separating "Collected" and "Awaiting Payment" amounts per currency.
- **Manual Payment Recording**: Mark invoices as fully or partially paid.
- **KoraPay Integration (Pro Plan)**: Seamless upgrades handled via KoraPay checkouts.

### 4.4 Automation & Real-time Sync
- **Live Notifications**: Powered by Convex real-time subscriptions, users get instant alerts when a client views an invoice, or when it goes overdue.
- **Scheduled Reminders**: Convex cron jobs automatically evaluate invoice due dates and send pre/post-due email reminders via Nodemailer.

### 4.5 AI Assistant
- Conversational chat powered by GPT OSS 120B (via Groq).
- Capable of deeply querying the user's invoice history and providing strategic business insights.

### 4.6 Product Analytics & Data-Driven Insights
- **PostHog Integration**: Client-side and server-side event tracking to monitor feature adoption and user drop-off.
- **Behavioral Funnels**: Tracking the user journey from signup to first invoice creation to conversion on the Pro tier.

## 5. Target Audience
- Independent freelancers (designers, developers, writers).
- Small creative agencies.
- Consultants tracking hourly or project-based billing.

## 6. Product Roadmap & Phased Execution

To ensure we deliver immediate value while building a scalable foundation, Invoiceser is planned and executed in distinct, strategic product phases.

### Phase 1: The MVP (Status: ✅ Fully Implemented)
*Goal: Solve the core problem of fragmented invoice creation and basic cash flow visibility to achieve initial product-market fit.*
- **Core Invoicing Engine**: WYSIWYG editor, draft/published states, and multi-currency support.
- **Client Directory**: Basic CRM for storing individual and business client details.
- **Manual Payment Tracking**: Ability to log full/partial payments to update the dashboard Wallet in real-time.
- **AI Assistant V1**: Introduction of the Groq-powered chat to query invoice data instantly.

### Phase 2: Automation, Analytics & Monetization (Status: 🔄 In Progress)
*Goal: Remove manual friction for the user (chasing payments), introduce a sustainable revenue model, and implement data-driven tracking.*
- ✅ **Pro Plan Tier**: KoraPay integration for subscription upgrades.
- ✅ **Automated Reminders**: Convex cron jobs handling pre/post due date email chasing via Nodemailer / SMTP.
- ✅ **Custom Branding**: Pro users can use custom fonts, hide branding, and set custom invoice prefixes.
- ✅ **Product Analytics**: Integrated PostHog to capture user behavior and funnel conversions.

### Phase 3: End-Client Experience & Frictionless Payments (Status: 📅 Upcoming)
*Goal: Improve the experience for the end-client paying the invoice, drastically reducing Time-To-Paid (TTP) metrics.*
- **Direct Payment Links**: Allow the end-client to pay the invoice directly online via credit card/bank transfer right from the public invoice link.
- **Auto-Reconciliation**: Automatically mark invoices as paid in the database upon successful KoraPay checkout.
- **Client Portal**: A secure portal where clients can log in to view all historical invoices, outstanding balances, and payment receipts.
- **Custom Domains**: Allow Pro users to host their invoices on branded subdomains (e.g., `billing.theiragency.com`).

### Phase 4: Ecosystem Integration & Accounting (Status: 📅 Future)
*Goal: Position Invoiceser as the central financial hub by integrating with the broader software ecosystem.*
- **Accounting Sync**: Seamless one-way or two-way sync to Xero, QuickBooks, and FreshBooks.
- **Expense Tracking**: Logging business expenses, attaching receipts, and calculating net profit margins directly alongside revenue.
- **Bank Feeds**: Connect via Plaid or Open Banking to automatically pull in bank transactions and match them against invoices and expenses.

### Phase 5: The Agency Operating System (Status: 📅 Future)
*Goal: Evolve from a single-player invoicing tool into a multiplayer operating system for scaling agencies.*
- **Team Collaboration**: Multi-user workspaces with Role-Based Access Control (RBAC) so founders can invite accountants, sales reps, or project managers.
- **Recurring Retainer Billing**: Automated subscription billing generation and auto-charging for retainer clients.
- **Mobile App**: Native iOS and Android applications (React Native) for on-the-go invoice generation and push notifications.

---

## Analytics & Event Tracking

This project utilizes PostHog for product analytics to understand user behavior, onboarding funnels, and feature adoption.

### Tracking Specification

| Event Name | Properties | Rationale |
| :--- | :--- | :--- |
| `$pageview` | *(Default URL props)* | To map out user journeys, identify high-traffic pages, and see where users spend the most time. |
| `$pageleave` | *(Default session props)* | Crucial for calculating true session duration and accurate bounce rates per page. |
| `onboarding_step_1_completed` | `company_name_length` | To measure drop-off at the very first step of the funnel and see if name length correlates with completion. |
| `onboarding_completed` | `skipped_create_invoice` | To track successful onboarding conversions and understand how many users skip the core action. |
| `invoice_draft_created` | `invoice_id`, `total` | To monitor the velocity of invoice creation and the financial volume currently sitting in drafts. |
| `invoice_sent` | `invoice_id`, `total`, `currency`, `is_first` | The primary 'Aha!' moment metric. `is_first` helps measure time-to-first-value (TTFV) for new users. |
| `payment_recorded` | `invoice_id`, `amount` | To track the total revenue flowing through the platform and measure the collection success rate. |
| `pro_attempted` | *(None)* | To measure intent to upgrade and calculate the conversion rate of the pricing modal. |
| `pro_upgraded` | `reference` | The core revenue metric for Invoiceser. Tracks successful conversions to paid subscriptions. |
| `ai_query` | `question_length`, `isPro` | To analyze AI usage frequency, token cost estimates, and whether the feature drives Pro upgrades. |

### Identity Management
- Users are linked to their events via `posthog.identify()` upon successful authentication (using Clerk ID, Email, and Name).
- `posthog.reset()` is invoked upon logout to clear session data.

---

## Success Metrics (KPIs)

**🌟 North Star Metric: Monthly Active Senders (MAS)**
The number of unique users who successfully send at least one invoice in a given month. This represents the core value delivered by Invoiceser; if MAS grows, the product is succeeding.

To evaluate whether Invoiceser is achieving its business goals, we monitor the following core metrics through our PostHog integration:

| Category | Metrics | KPI / How we measure | Tracked Event(s) | Target |
| :--- | :--- | :--- | :--- | :--- |
| **Activation** | Activation Rate | % of sign-ups who successfully send their first invoice within 24 hours. | `invoice_sent` | > 40% |
| **Activation** | Time-to-First-Value (TTFV) | Average time elapsed between account creation and the first sent invoice. | `invoice_sent` | < 5 mins |
| **Engagement** | DAU Retention (Day 1) | % of users who return to the app the day after signing up. | `$pageview` | > 20% D1 |
| **Engagement** | WAU Retention (Day 7) | % of users who return to the app 7 days after signing up. | `$pageview` | > 15% D7 |
| **Retention** | Retention Rate (M1) | % of users who return to send a second invoice in the month following their first invoice. | `invoice_sent` | > 30% M1 |
| **Monetization** | Pro Conversion Rate | % of active users who upgrade to the Pro tier. | `pro_upgraded` | > 5% |
| **Monetization** | Gross Merchandise Volume | Total monetary value of all invoices generated and sent. | `invoice_sent` (sum `total`) | MoM Growth |
| **Success** | Collection Success Rate | Ratio of payments recorded vs invoices sent. | `payment_recorded` | > 75% |
| **Feature Adoption** | AI Engagement Rate | % of active users utilizing the AI query tool at least once per session. | `ai_query` | > 15% |

---

## Risks & Mitigation

| Risk Area | Description | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Deliverability** | Invoice emails (via custom SMTP) land in spam folders, causing clients to miss payments. | High | Enforce strict SPF/DKIM/DMARC records, monitor bounce rates continuously, and include a direct PDF download link as a reliable fallback. |
| **Security & Privacy** | Sensitive financial data (revenue numbers, client details) is exposed due to unauthorized access. | High | Strictly enforce Row-Level Security (RLS) via Convex authorization logic. Encrypt sensitive PII at rest. |
| **LLM Hallucinations** | The AI assistant provides incorrect financial insights or misinterprets invoice data. | Medium | Scope the Groq/LLM system prompt strictly to read-only analytical queries based strictly on provided data. Add UI disclaimers regarding AI advice. |
| **Third-Party Outages** | Critical dependencies like Clerk (Auth), Convex (DB), or external SMTP providers experience downtime. | High | Implement graceful degradation with friendly error states. Utilize retry mechanisms for critical background tasks. |
