import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Users ──────────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro")),
    suspended: v.optional(v.boolean()),
    notifyEmailOnViewed: v.boolean(),
    notifyEmailOnOverdue: v.boolean(),
    aiInsights: v.optional(v.string()),
    aiInsightsGeneratedAt: v.optional(v.number()),
    aiQueriesThisMonth: v.optional(v.number()),
    aiMonthKey: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // ─── Settings (one document per user) ───────────────────────────────────────
  settings: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    brandColor: v.optional(v.string()),
    defaultCurrency: v.string(),
    invoicePrefix: v.string(),
    defaultPaymentTerms: v.optional(v.string()),
    paymentInstructions: v.optional(v.string()),
    paymentBankName: v.optional(v.string()),
    paymentAccountName: v.optional(v.string()),
    paymentAccountNumber: v.optional(v.string()),
    paymentSortCode: v.optional(v.string()),
    paymentIban: v.optional(v.string()),
    paymentSwiftBic: v.optional(v.string()),
    paymentLink: v.optional(v.string()),
    paymentLinkLabel: v.optional(v.string()),
    displayName: v.optional(v.string()),
    businessAddress: v.optional(v.string()),
    businessCity: v.optional(v.string()),
    businessCountry: v.optional(v.string()),
    businessPhone: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    businessWebsite: v.optional(v.string()),
    showBusinessAddress: v.optional(v.boolean()),
    showBusinessPhone: v.optional(v.boolean()),
    showBusinessEmail: v.optional(v.boolean()),
    showBusinessWebsite: v.optional(v.boolean()),
    hideBranding: v.optional(v.boolean()),
    invoiceFont: v.optional(v.string()),
    customEmailDomain: v.optional(v.string()),
    emailTemplate: v.optional(v.string()),
    paymentAccounts: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      currency: v.optional(v.string()),
      bankName: v.optional(v.string()),
      accountHolder: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      sortCode: v.optional(v.string()),
      iban: v.optional(v.string()),
      swift: v.optional(v.string()),
      paymentLink: v.optional(v.string()),
      paymentLinkLabel: v.optional(v.string()),
    }))),
    salesTaxLabel: v.optional(v.string()),
    salesTaxRate: v.optional(v.number()),
    salesTaxActive: v.boolean(),
    vatLabel: v.optional(v.string()),
    vatRate: v.optional(v.number()),
    vatActive: v.boolean(),
    invoiceCounter: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ─── Clients ─────────────────────────────────────────────────────────────────
  clients: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    email: v.string(),
    companyName: v.optional(v.string()),
    clientType: v.optional(v.union(v.literal("individual"), v.literal("business"))),
    address: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ─── Invoices ────────────────────────────────────────────────────────────────
  // Note: by_user_created_at supports date-ranged analytics; by_status_due_date supports the overdue cron
  invoices: defineTable({
    userId: v.id("users"),
    invoiceNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("voided")
    ),
    clientId: v.optional(v.id("clients")),
    clientSnapshot: v.object({
      fullName: v.string(),
      email: v.string(),
      companyName: v.optional(v.string()),
      address: v.optional(v.string()),
    }),
    currency: v.string(),
    issueDate: v.string(),
    dueDate: v.optional(v.string()),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
        amount: v.number(),
      })
    ),
    subtotal: v.number(),
    salesTaxEnabled: v.boolean(),
    salesTaxLabel: v.optional(v.string()),
    salesTaxRate: v.optional(v.number()),
    salesTaxAmount: v.optional(v.number()),
    vatEnabled: v.boolean(),
    vatLabel: v.optional(v.string()),
    vatRate: v.optional(v.number()),
    vatAmount: v.optional(v.number()),
    total: v.number(),
    notes: v.optional(v.string()),
    paymentInstructions: v.optional(v.string()),
    publicToken: v.string(),
    pdfStorageId: v.optional(v.id("_storage")),
    pdfGeneratedAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    voidedAt: v.optional(v.number()),
    voidReason: v.optional(v.string()),
    reissuedFromId: v.optional(v.id("invoices")),
    reissuedAsId: v.optional(v.id("invoices")),
    emailDeliveryStatus: v.optional(
      v.union(v.literal("delivered"), v.literal("failed"))
    ),
    emailDeliveryError: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_token", ["publicToken"])
    .index("by_user_due_date", ["userId", "dueDate"])
    .index("by_user_created_at", ["userId", "createdAt"])
    .index("by_status_due_date", ["status", "dueDate"]),

  // ─── Payments ─────────────────────────────────────────────────────────────────
  payments: defineTable({
    invoiceId: v.id("invoices"),
    userId: v.id("users"),
    amount: v.number(),
    dateReceived: v.string(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_invoice", ["invoiceId"])
    .index("by_user", ["userId"]),

  // ─── Activity Log ─────────────────────────────────────────────────────────────
  activityLog: defineTable({
    invoiceId: v.id("invoices"),
    userId: v.id("users"),
    eventType: v.union(
      v.literal("created"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("payment_recorded"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("voided"),
      v.literal("reissued"),
      v.literal("reminder_sent"),
      v.literal("email_failed")
    ),
    metadata: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_invoice", ["invoiceId"]),

  // ─── In-App Notifications ─────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    invoiceId: v.optional(v.id("invoices")),
    type: v.union(
      v.literal("invoice_viewed"),
      v.literal("invoice_overdue"),
      v.literal("payment_recorded"),
      v.literal("invoice_paid")
    ),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_unread", ["userId", "read"]),

  // ─── Line Item Templates ──────────────────────────────────────────────────────
  lineItemTemplates: defineTable({
    userId: v.id("users"),
    name: v.string(),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ─── Support Tickets ──────────────────────────────────────────────────────────
  supportTickets: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    category: v.optional(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    screenshotStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_status_created", ["status", "createdAt"]),

  // ─── Support Messages ─────────────────────────────────────────────────────────
  supportMessages: defineTable({
    ticketId: v.id("supportTickets"),
    authorId: v.id("users"),
    isAdmin: v.boolean(),
    isInternalNote: v.boolean(),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_ticket", ["ticketId"]),

  // ─── System Announcements ─────────────────────────────────────────────────────
  announcements: defineTable({
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("maintenance")
    ),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active", ["active"]),

  // ─── Feature Flags ────────────────────────────────────────────────────────────
  featureFlags: defineTable({
    key: v.string(),
    value: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // ─── Per-User Plan Overrides ──────────────────────────────────────────────────
  userPlanOverrides: defineTable({
    userId: v.id("users"),
    feature: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_feature", ["userId", "feature"]),

  // ─── Audit Log ───────────────────────────────────────────────────────────────
  auditLog: defineTable({
    actorId: v.optional(v.id("users")),
    actorEmail: v.optional(v.string()),
    eventType: v.string(),
    targetId: v.optional(v.string()),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_event_type", ["eventType"])
    .index("by_created_at", ["createdAt"]),
});
