# Invoiceser

**AI-powered invoicing for freelancers and small businesses.**

Create professional invoices, manage clients, track payments in real-time, and get AI-driven insights — all in one place. Invoiceser is designed to replace fragmented spreadsheets and clunky payment tools with a sleek, single source of truth.

---

## 📚 Documentation

### 🎯 [Product Overview & Requirements](./docs/PRODUCT_REQUIREMENTS.md)
*For Product Managers, Stakeholders, and Visionaries.*
Understand the core problems Invoiceser solves and the data-driven product strategy. View the complete feature breakdown, target audience personas, and a comprehensive, multi-phase future roadmap spanning from MVP to a full ecosystem.

### 🏗️ [Architecture & System Design](./docs/ARCHITECTURE.md)
*For Technical Product Managers (TPMs) and Systems Architects.*
Dive into the technical architecture that powers our real-time engine. This document includes deep-dive **Mermaid.js diagrams** visualizing:
- System Architecture (including PostHog Analytics and Groq LLMs)
- Entity Relationship Diagram (Data Schema)
- User Flows & Payment Lifecycles
- Automated Reminders Flow (via SMTP/Nodemailer)

### 💻 [Development Guide](./docs/DEVELOPMENT.md)
*For Engineers and Technical Contributors.*
Get the project running locally in minutes. This comprehensive guide covers the technology stack, environment variables, required third-party services (Clerk, Convex, KoraPay, PostHog), project structure, and Vercel deployment steps.

---

## 🚀 Quick Highlights

- **Live Invoice Preview**: See exactly how your invoice looks as you build it.
- **Groq-powered AI**: Talk to your business data in plain English for instant insights.
- **Data-Driven Analytics**: PostHog integration tracking user behaviors and feature usage to inform product decisions.
- **Real-time Engine**: Powered by Convex. Dashboards and wallets update instantly when a payment is logged or a client views an invoice.
- **Multi-currency**: Bill clients globally with built-in support for multiple currencies.
- **Automated Workflow**: Let scheduled cron jobs handle overdue notices and payment reminders via Nodemailer and SMTP.

---

*Made with care for freelancers worldwide.*
