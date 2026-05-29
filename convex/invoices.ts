import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull } from "./lib/auth";

const lineItemValidator = v.object({
  description: v.string(),
  quantity: v.number(),
  rate: v.number(),
  amount: v.number(),
});

export const listInvoices = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("paid"),
        v.literal("overdue"),
        v.literal("voided")
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    if (args.status) {
      return ctx.db
        .query("invoices")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status!)
        )
        .order("desc")
        .take(200);
    }
    return ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(200);
  },
});

export const getInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) return null;
    return invoice;
  },
});

export const getInvoiceByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("invoices")
      .withIndex("by_token", (q) => q.eq("publicToken", args.token))
      .unique();
  },
});

// Used by API routes that don't have a user context (PDF generation)
export const getInvoiceByPublicId = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.invoiceId);
  },
});

export const createInvoice = mutation({
  args: {
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
    lineItems: v.array(lineItemValidator),
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
    asDraft: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Get & atomically increment counter
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");

    const nextCounter = settings.invoiceCounter + 1;
    await ctx.db.patch(settings._id, {
      invoiceCounter: nextCounter,
      updatedAt: Date.now(),
    });

    const year = new Date().getUTCFullYear();
    const seq = String(nextCounter).padStart(4, "0");
    const invoiceNumber = `${settings.invoicePrefix}-${year}-${seq}`;

    // Generate public token (fallback since nanoid is ESM)
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);

    const invoiceId = await ctx.db.insert("invoices", {
      userId: user._id,
      invoiceNumber,
      status: args.asDraft ? "draft" : "sent",
      clientId: args.clientId,
      clientSnapshot: args.clientSnapshot,
      currency: args.currency,
      issueDate: args.issueDate,
      dueDate: args.dueDate,
      lineItems: args.lineItems,
      subtotal: args.subtotal,
      salesTaxEnabled: args.salesTaxEnabled,
      salesTaxLabel: args.salesTaxLabel,
      salesTaxRate: args.salesTaxRate,
      salesTaxAmount: args.salesTaxAmount,
      vatEnabled: args.vatEnabled,
      vatLabel: args.vatLabel,
      vatRate: args.vatRate,
      vatAmount: args.vatAmount,
      total: args.total,
      notes: args.notes,
      paymentInstructions: args.paymentInstructions,
      publicToken: token,
      sentAt: args.asDraft ? undefined : Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("activityLog", {
      invoiceId,
      userId: user._id,
      eventType: "created",
      createdAt: Date.now(),
    });

    return { invoiceId, invoiceNumber };
  },
});

export const updateDraftInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
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
    lineItems: v.array(lineItemValidator),
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
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const { invoiceId, ...fields } = args;
    const invoice = await ctx.db.get(invoiceId);
    if (!invoice || invoice.userId !== user._id) throw new Error("Not found");
    if (invoice.status !== "draft") throw new Error("Only drafts can be edited");
    await ctx.db.patch(invoiceId, { ...fields, updatedAt: Date.now() });
  },
});

export const markInvoiceSent = mutation({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) throw new Error("Not found");
    if (invoice.status !== "draft") throw new Error("Only drafts can be sent");
    await ctx.db.patch(args.invoiceId, {
      status: "sent",
      sentAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("activityLog", {
      invoiceId: args.invoiceId,
      userId: user._id,
      eventType: "sent",
      createdAt: Date.now(),
    });
  },
});

export const markEmailDelivery = mutation({
  args: {
    invoiceId: v.id("invoices"),
    status: v.union(v.literal("delivered"), v.literal("failed")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.invoiceId, {
      emailDeliveryStatus: args.status,
      emailDeliveryError: args.error,
      updatedAt: Date.now(),
    });
    if (args.status === "failed") {
      await ctx.db.insert("activityLog", {
        invoiceId: args.invoiceId,
        userId: invoice.userId,
        eventType: "email_failed",
        metadata: args.error,
        createdAt: Date.now(),
      });
    }
  },
});

export const voidInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
    voidReason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) throw new Error("Not found");
    if (!["sent", "overdue"].includes(invoice.status))
      throw new Error("Only sent or overdue invoices can be voided");
    await ctx.db.patch(args.invoiceId, {
      status: "voided",
      voidedAt: Date.now(),
      voidReason: args.voidReason,
      updatedAt: Date.now(),
    });
    await ctx.db.insert("activityLog", {
      invoiceId: args.invoiceId,
      userId: user._id,
      eventType: "voided",
      metadata: args.voidReason,
      createdAt: Date.now(),
    });
  },
});

export const reissueInvoice = mutation({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const original = await ctx.db.get(args.invoiceId);
    if (!original || original.userId !== user._id) throw new Error("Not found");
    if (original.status !== "voided") throw new Error("Only voided invoices can be reissued");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!settings) throw new Error("Settings not found");

    const nextCounter = settings.invoiceCounter + 1;
    await ctx.db.patch(settings._id, {
      invoiceCounter: nextCounter,
      updatedAt: Date.now(),
    });

    const year = new Date().getUTCFullYear();
    const seq = String(nextCounter).padStart(4, "0");
    const invoiceNumber = `${settings.invoicePrefix}-${year}-${seq}`;
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 8);

    const newId = await ctx.db.insert("invoices", {
      userId: user._id,
      invoiceNumber,
      status: "draft",
      clientId: original.clientId,
      clientSnapshot: original.clientSnapshot,
      currency: original.currency,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: original.dueDate,
      lineItems: original.lineItems,
      subtotal: original.subtotal,
      salesTaxEnabled: original.salesTaxEnabled,
      salesTaxLabel: original.salesTaxLabel,
      salesTaxRate: original.salesTaxRate,
      salesTaxAmount: original.salesTaxAmount,
      vatEnabled: original.vatEnabled,
      vatLabel: original.vatLabel,
      vatRate: original.vatRate,
      vatAmount: original.vatAmount,
      total: original.total,
      notes: original.notes,
      paymentInstructions: original.paymentInstructions,
      publicToken: token,
      reissuedFromId: args.invoiceId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.invoiceId, { reissuedAsId: newId });

    await ctx.db.insert("activityLog", {
      invoiceId: newId,
      userId: user._id,
      eventType: "reissued",
      metadata: original.invoiceNumber,
      createdAt: Date.now(),
    });

    return { invoiceId: newId, invoiceNumber };
  },
});

export const markInvoiceViewed = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_token", (q) => q.eq("publicToken", args.token))
      .unique();
    if (!invoice || invoice.status === "draft") return;

    // Dedup: skip if a "viewed" event was already recorded in the last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentView = await ctx.db
      .query("activityLog")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", invoice._id))
      .order("desc")
      .filter((q) => q.eq(q.field("eventType"), "viewed"))
      .first();
    if (recentView && recentView.createdAt >= oneHourAgo) return;

    await ctx.db.insert("activityLog", {
      invoiceId: invoice._id,
      userId: invoice.userId,
      eventType: "viewed",
      createdAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      userId: invoice.userId,
      invoiceId: invoice._id,
      type: "invoice_viewed",
      message: `${invoice.clientSnapshot.fullName} viewed invoice ${invoice.invoiceNumber}`,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const markOverdueInvoices = internalMutation({
  args: {},
  handler: async (ctx) => {
    const todayUTC = new Date().toISOString().split("T")[0];
    // Use by_status_due_date index: finds all "sent" invoices with dueDate before today
    // without scanning every user's invoices
    const overdue = await ctx.db
      .query("invoices")
      .withIndex("by_status_due_date", (q) =>
        q.eq("status", "sent").lt("dueDate", todayUTC)
      )
      .filter((q) => q.neq(q.field("dueDate"), undefined))
      .collect();

    for (const invoice of overdue) {
      await ctx.db.patch(invoice._id, {
        status: "overdue",
        updatedAt: Date.now(),
      });
      await ctx.db.insert("activityLog", {
        invoiceId: invoice._id,
        userId: invoice.userId,
        eventType: "overdue",
        createdAt: Date.now(),
      });
      await ctx.db.insert("notifications", {
        userId: invoice.userId,
        invoiceId: invoice._id,
        type: "invoice_overdue",
        message: `Invoice ${invoice.invoiceNumber} for ${invoice.clientSnapshot.fullName} is now overdue`,
        read: false,
        createdAt: Date.now(),
      });
    }

    return overdue.length;
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return { totalCount: 0, totalPending: 0, totalPaid: 0, overdueCount: 0, defaultCurrency: "free" };

    const byStatus = (status: "sent" | "paid" | "overdue") =>
      ctx.db.query("invoices")
        .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", status))
        .collect();

    const [sent, paid, overdue] = await Promise.all([byStatus("sent"), byStatus("paid"), byStatus("overdue")]);

    const pending = [...sent, ...overdue];
    return {
      totalCount:   sent.length + paid.length + overdue.length,
      totalPending: pending.reduce((s, i) => s + i.total, 0),
      pendingCount: pending.length,
      totalPaid:    paid.reduce((s, i) => s + i.total, 0),
      overdueCount: overdue.length,
    };
  },
});

export const getAttentionList = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [overdue, dueSoonCandidates] = await Promise.all([
      ctx.db.query("invoices")
        .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", "overdue"))
        .take(50),
      // Use the due-date index to find invoices due within the next 7 days without loading all sent invoices
      ctx.db.query("invoices")
        .withIndex("by_user_due_date", (q) =>
          q.eq("userId", user._id).gte("dueDate", today).lte("dueDate", sevenDaysLater)
        )
        .collect(),
    ]);

    const dueSoon = dueSoonCandidates.filter((i) => i.status === "sent");

    return [...overdue, ...dueSoon].sort((a, b) =>
      (a.dueDate ?? "").localeCompare(b.dueDate ?? "")
    );
  },
});

export const getRecentInvoices = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    return ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);
  },
});

export const getWalletSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];

    const byStatus = (status: "sent" | "paid" | "overdue") =>
      ctx.db.query("invoices")
        .withIndex("by_user_status", (q) => q.eq("userId", user._id).eq("status", status))
        .collect();

    const [paid, sent, overdue] = await Promise.all([byStatus("paid"), byStatus("sent"), byStatus("overdue")]);

    const byCurrency: Record<string, { collected: number; pending: number; pendingCount: number }> = {};
    for (const inv of paid) {
      if (!byCurrency[inv.currency]) byCurrency[inv.currency] = { collected: 0, pending: 0, pendingCount: 0 };
      byCurrency[inv.currency].collected += inv.total;
    }
    for (const inv of [...sent, ...overdue]) {
      if (!byCurrency[inv.currency]) byCurrency[inv.currency] = { collected: 0, pending: 0, pendingCount: 0 };
      byCurrency[inv.currency].pending += inv.total;
      byCurrency[inv.currency].pendingCount++;
    }

    return Object.entries(byCurrency).map(([currency, d]) => ({
      currency, collected: d.collected, pending: d.pending, pendingCount: d.pendingCount,
    }));
  },
});

export const getAnalyticsData = query({
  args: { range: v.union(v.literal("30d"), v.literal("90d"), v.literal("365d"), v.literal("all")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;
    const cutoff =
      args.range === "30d"  ? now - 30  * msPerDay :
      args.range === "90d"  ? now - 90  * msPerDay :
      args.range === "365d" ? now - 365 * msPerDay : 0;

    if (cutoff === 0) {
      return ctx.db.query("invoices")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
    }

    // Use the createdAt index to avoid loading invoices outside the range
    return ctx.db.query("invoices")
      .withIndex("by_user_created_at", (q) => q.eq("userId", user._id).gte("createdAt", cutoff))
      .collect();
  },
});
