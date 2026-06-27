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
- Conversational chat powered by Llama 3 70B (via Groq).
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
