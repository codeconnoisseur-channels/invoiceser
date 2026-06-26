import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getCurrentUser, requirePlatformAdmin } from "./lib/auth";

export const getAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("announcements")
      .withIndex("by_active", (q) => q.eq("active", true))
      .order("desc")
      .take(5);
  },
});

export const getAllAnnouncements = query({
  args: {},
  handler: async (ctx) => {
    await requirePlatformAdmin(ctx);
    return ctx.db.query("announcements").order("desc").take(50);
  },
});

export const createAnnouncement = mutation({
  args: {
    message: v.string(),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("maintenance")),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    return ctx.db.insert("announcements", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateAnnouncement = mutation({
  args: {
    id: v.id("announcements"),
    message: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const getFeatureFlags = query({
  args: {},
  handler: async (ctx) => {
    await requirePlatformAdmin(ctx);
    return ctx.db.query("featureFlags").take(100);
  },
});

export const upsertFeatureFlag = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    const existing = await ctx.db
      .query("featureFlags")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("featureFlags", {
        key: args.key, value: args.value, description: args.description, updatedAt: Date.now(),
      });
    }
  },
});

export const getAuditLog = query({
  args: {},
  handler: async (ctx) => {
    await requirePlatformAdmin(ctx);
    const entries = await ctx.db
      .query("auditLog")
      .withIndex("by_created_at")
      .order("desc")
      .take(200);
    return entries.map((e) => ({
      ...e,
      action: e.eventType,
      resource: e.targetId ?? "—",
      userId: e.actorEmail ?? e.actorId ?? "system",
    }));
  },
});

export const getPlatformStats = query({
  args: {},
  handler: async (ctx) => {
    await requirePlatformAdmin(ctx);
    const [users, openTickets] = await Promise.all([
      ctx.db.query("users").take(10000),
      ctx.db.query("supportTickets").withIndex("by_status", (q) => q.eq("status", "open")).take(10000),
    ]);
    const [invoices, clients, payments] = await Promise.all([
      ctx.db.query("invoices").take(10000),
      ctx.db.query("clients").take(10000),
      ctx.db.query("payments").take(10000),
    ]);
    return {
      totalUsers: users.length,
      proUsers: users.filter((u) => u.plan === "pro").length,
      freeUsers: users.filter((u) => u.plan === "free").length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((i) => i.status === "paid").length,
      totalClients: clients.filter((c) => !c.deletedAt).length,
      totalRevenue: payments.reduce((s, p) => s + p.amount, 0),
      openTickets: openTickets.length,
    };
  },
});

export const getUserDetail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    const [invoices, clients] = await Promise.all([
      ctx.db.query("invoices").withIndex("by_user", (q) => q.eq("userId", args.userId)).order("desc").take(50),
      ctx.db.query("clients").withIndex("by_user", (q) => q.eq("userId", args.userId)).take(200),
    ]);
    return { user, invoices, clients };
  },
});

export const writeAuditLog = mutation({
  args: {
    eventType: v.string(),
    targetId: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.insert("auditLog", {
      actorId: user._id,
      actorEmail: user.email,
      eventType: args.eventType,
      targetId: args.targetId,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});

export const deleteUserData = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = args.userId;

    // Settings
    const settings = await ctx.db.query("settings").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const s of settings) await ctx.db.delete(s._id);

    // Invoices → payments → activityLog → notifications
    const invoices = await ctx.db.query("invoices").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const inv of invoices) {
      const payments = await ctx.db.query("payments").withIndex("by_invoice", (q) => q.eq("invoiceId", inv._id)).collect();
      for (const p of payments) await ctx.db.delete(p._id);
      const log = await ctx.db.query("activityLog").withIndex("by_invoice", (q) => q.eq("invoiceId", inv._id)).collect();
      for (const l of log) await ctx.db.delete(l._id);
      await ctx.db.delete(inv._id);
    }

    // Notifications
    const notifications = await ctx.db.query("notifications").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const n of notifications) await ctx.db.delete(n._id);

    // Clients
    const clients = await ctx.db.query("clients").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const c of clients) await ctx.db.delete(c._id);

    // Line item templates
    const templates = await ctx.db.query("lineItemTemplates").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const t of templates) await ctx.db.delete(t._id);

    // Support tickets → messages
    const tickets = await ctx.db.query("supportTickets").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    for (const ticket of tickets) {
      const msgs = await ctx.db.query("supportMessages").withIndex("by_ticket", (q) => q.eq("ticketId", ticket._id)).collect();
      for (const m of msgs) await ctx.db.delete(m._id);
      await ctx.db.delete(ticket._id);
    }

    // User
    await ctx.db.delete(userId);
  },
});
