import { QueryCtx, MutationCtx, ActionCtx } from "../_generated/server";

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new Error("User record not found");
  return user;
}

export async function getCurrentUserOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

// For mutations: returns the user record, creating it if the webhook hasn't fired yet.
export async function getCurrentUserOrCreate(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (existing) return existing;

  const email = identity.email ?? "";
  const name = (identity.name as string | undefined) ?? undefined;

  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    email,
    name,
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

  return (await ctx.db.get(userId))!;
}

// Verifies the caller is a platform admin.
// Set PLATFORM_ADMIN_EMAILS in Convex env vars (comma-separated list of admin emails).
export async function requirePlatformAdmin(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const adminEmails = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = (identity.email ?? "").toLowerCase();
  if (!adminEmails.length || !adminEmails.includes(email)) {
    throw new Error("Forbidden");
  }
  return identity;
}
