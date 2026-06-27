import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull, requirePlatformAdmin } from "./lib/auth";

export const getCurrentUserQuery = query({
  args: {},
  handler: async (ctx) => {
    return getCurrentUserOrNull(ctx);
  },
});

export const syncUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      plan: "free",
      notifyEmailOnViewed: true,
      notifyEmailOnOverdue: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert("settings", {
      userId,
      companyName: "",
      defaultCurrency: "GBP",
      invoicePrefix: "INV",
      salesTaxActive: false,
      vatActive: false,
      invoiceCounter: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) await ctx.db.delete(user._id);
  },
});

export const updateNotificationPrefs = mutation({
  args: {
    notifyEmailOnViewed: v.boolean(),
    notifyEmailOnOverdue: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, {
      notifyEmailOnViewed: args.notifyEmailOnViewed,
      notifyEmailOnOverdue: args.notifyEmailOnOverdue,
    });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requirePlatformAdmin(ctx);
    return ctx.db.query("users").take(500);
  },
});

export const selfUpgradeToPro = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, { plan: "pro" });
  },
});

export const upgradeUserByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user && user.plan !== "pro") {
      await ctx.db.patch(user._id, { plan: "pro" });
    }
  },
});

export const updateUserPlan = mutation({
  args: {
    targetUserId: v.id("users"),
    plan: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    await ctx.db.patch(args.targetUserId, { plan: args.plan });
  },
});

export const suspendUser = mutation({
  args: {
    targetUserId: v.id("users"),
    suspended: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    await ctx.db.patch(args.targetUserId, { suspended: args.suspended });
  },
});

export const storeAiInsights = mutation({
  args: {
    insights: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.patch(user._id, {
      aiInsights: args.insights,
      aiInsightsGeneratedAt: Date.now(),
    });
  },
});

export const getAiUsage = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;
    const FREE_MONTHLY_LIMIT = 10;
    if (user.plan === "pro") return { used: 0, limit: -1, isPro: true };
    const monthKey = new Date().toISOString().slice(0, 7);
    const sameMonth = user.aiMonthKey === monthKey;
    const used = sameMonth ? (user.aiQueriesThisMonth ?? 0) : 0;
    return { used, limit: FREE_MONTHLY_LIMIT, isPro: false };
  },
});

export const touchUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return;
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    if (user.lastActiveAt && user.lastActiveAt > fiveMinAgo) return;
    await ctx.db.patch(user._id, { lastActiveAt: Date.now() });
  },
});

export const updateInvoiceStats = mutation({
  args: {
    totalCount: v.optional(v.number()),
    pendingAmount: v.optional(v.number()),
    collectedAmount: v.optional(v.number()),
    pendingCount: v.optional(v.number()),
    overdueCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const patch: Record<string, number> = {};
    if (args.totalCount !== undefined) patch.invoiceTotalCount = (user.invoiceTotalCount ?? 0) + args.totalCount;
    if (args.pendingAmount !== undefined) patch.invoicePendingAmount = (user.invoicePendingAmount ?? 0) + args.pendingAmount;
    if (args.collectedAmount !== undefined) patch.invoiceCollectedAmount = (user.invoiceCollectedAmount ?? 0) + args.collectedAmount;
    if (args.pendingCount !== undefined) patch.invoicePendingCount = (user.invoicePendingCount ?? 0) + args.pendingCount;
    if (args.overdueCount !== undefined) patch.invoiceOverdueCount = (user.invoiceOverdueCount ?? 0) + args.overdueCount;
    await ctx.db.patch(user._id, patch);
  },
});

export const checkAndIncrementAiQuery = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const FREE_MONTHLY_LIMIT = 10;
    if (user.plan === "pro") return { allowed: true, used: 0, limit: -1 };
    const monthKey = new Date().toISOString().slice(0, 7);
    const sameMonth = user.aiMonthKey === monthKey;
    const used = sameMonth ? (user.aiQueriesThisMonth ?? 0) : 0;
    if (used >= FREE_MONTHLY_LIMIT) return { allowed: false, used, limit: FREE_MONTHLY_LIMIT };
    await ctx.db.patch(user._id, { aiQueriesThisMonth: used + 1, aiMonthKey: monthKey });
    return { allowed: true, used: used + 1, limit: FREE_MONTHLY_LIMIT };
  },
});
