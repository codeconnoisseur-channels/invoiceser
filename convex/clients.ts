import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull, getCurrentUserOrCreate } from "./lib/auth";

export const listClients = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    return ctx.db
      .query("clients")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;
    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== user._id) return null;
    return client;
  },
});

export const createClient = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    companyName: v.optional(v.string()),
    clientType: v.optional(v.union(v.literal("individual"), v.literal("business"))),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrCreate(ctx);

    return ctx.db.insert("clients", {
      userId: user._id,
      fullName: args.fullName,
      email: args.email,
      companyName: args.companyName,
      clientType: args.clientType,
      address: args.address,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateClient = mutation({
  args: {
    clientId: v.id("clients"),
    fullName: v.string(),
    email: v.string(),
    companyName: v.optional(v.string()),
    clientType: v.optional(v.union(v.literal("individual"), v.literal("business"))),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.clientId, {
      fullName: args.fullName,
      email: args.email,
      companyName: args.companyName,
      clientType: args.clientType,
      address: args.address,
      updatedAt: Date.now(),
    });
  },
});

export const deleteClient = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.clientId, { deletedAt: Date.now() });
  },
});
