# Architecture & System Design

This document outlines the technical architecture, user flows, and data relationships powering the Invoiceser application.

## 1. System Architecture

Invoiceser is built on a modern, serverless stack designed for real-time reactivity and high performance.

```mermaid
graph TD
    %% Define Nodes
    Client[Next.js Client App Router]
    Convex[(Convex Backend DB & Functions)]
    Clerk[Clerk Auth]
    SMTP[SMTP / Nodemailer]
    Groq[Groq AI / Llama 3]
    KoraPay[KoraPay Payments]
    PostHog[PostHog Analytics]
    
    %% Relationships
    Client <-->|Live Queries & Mutations| Convex
    Client -->|Auth Tokens| Clerk
    Client -->|Analytics Events| PostHog
    Clerk -->|Webhooks: User Created/Updated| Convex
    Convex -->|Send PDF & Reminders| SMTP
    Convex <-->|AI Prompts & Completions| Groq
    Client -->|Checkout Redirect| KoraPay
    KoraPay -->|Webhook: Payment Success| Convex
```

### Core Components
- **Client**: Next.js 14 App Router, styled with Tailwind CSS and shadcn/ui.
- **Backend/DB**: Convex provides real-time WebSockets. When a client views an invoice, the DB updates, and Convex pushes the new state instantly to the user's dashboard.
- **AI Integration**: Groq provides ultra-fast LLM inference, using system prompts injected with the user's Convex invoice data to answer questions.
- **Analytics**: PostHog is integrated on the client-side to track feature usage, interactions, and user journeys to drive data-informed product decisions.
- **Email Delivery**: Standard SMTP via Nodemailer (supporting Gmail and other providers) for reliable delivery of PDFs and scheduled reminders.

---

## 2. Entity Relationship Diagram (Data Schema)

The database consists of the following primary tables in Convex.

```mermaid
erDiagram
    USERS {
        string clerkId
        string email
        string name
        string plan "free | pro"
        number aiQueriesThisMonth
    }
    
    SETTINGS {
        id userId
        string companyName
        string defaultCurrency
        string invoicePrefix
    }

    CLIENTS {
        id userId
        string type "individual | business"
        string fullName
        string email
        string currency
    }

    INVOICES {
        id userId
        id clientId
        string invoiceNumber
        string status "draft | sent | paid | overdue | void"
        number total
        number subtotal
        number balanceDue
    }

    PAYMENTS {
        id invoiceId
        id userId
        number amount
        string method
        number date
    }

    %% Relationships
    USERS ||--o| SETTINGS : has
    USERS ||--o{ CLIENTS : creates
    USERS ||--o{ INVOICES : creates
    CLIENTS ||--o{ INVOICES : receives
    INVOICES ||--o{ PAYMENTS : records
```

---

## 3. Core User Flows

### 3.1 Invoice Creation & Payment Flow

This flow illustrates how a freelancer creates an invoice, how the client interacts with it, and how the system reacts in real-time.

```mermaid
sequenceDiagram
    actor User as Freelancer
    participant App as Invoiceser App
    participant DB as Convex DB
    participant Email as SMTP / Nodemailer
    actor Client as End Client

    User->>App: Creates New Invoice
    App->>DB: Mutation: insert("invoices")
    DB-->>App: Returns invoice ID
    User->>App: Clicks "Send via Email"
    App->>DB: Action: generate PDF & trigger email
    DB->>Email: Send email with PDF attachment
    Email->>Client: Delivers Invoice Email
    
    Note over Client, DB: Client views the public link
    Client->>App: Opens public invoice link
    App->>DB: Mutation: update invoice (viewed=true)
    DB-->>User: Live Query Push: Notification "Client viewed invoice"
    
    Note over User, DB: User receives payment outside app
    User->>App: Logs manual payment
    App->>DB: Mutation: insert("payments")
    DB-->>App: Live Query Push: Dashboard Wallet Updated instantly
```

### 3.2 Automated Payment Reminders Flow

Invoiceser uses Convex Cron Jobs to automatically remind clients of due payments without manual intervention.

```mermaid
graph TD
    Cron((Daily Cron Job)) --> Fetch[Fetch all 'sent' or 'overdue' invoices]
    Fetch --> CheckDate{Is it 3 days before<br/>or after Due Date?}
    CheckDate -- Yes --> CheckSettings{Are auto-reminders<br/>enabled for User?}
    CheckDate -- No --> Skip[Skip Invoice]
    CheckSettings -- Yes --> FireAction[Trigger Nodemailer SMTP]
    CheckSettings -- No --> Skip
    FireAction --> EmailClient[Client Receives Reminder Email]
```
