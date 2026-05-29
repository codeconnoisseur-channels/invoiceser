import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull } from "./lib/auth";

export const listTemplates = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    return ctx.db
      .query("lineItemTemplates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(100);
  },
});

export const createTemplate = mutation({
  args: {
    name: v.string(),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        rate: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return ctx.db.insert("lineItemTemplates", {
      userId: user._id,
      name: args.name,
      lineItems: args.lineItems,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deleteTemplate = mutation({
  args: { templateId: v.id("lineItemTemplates") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const template = await ctx.db.get(args.templateId);
    if (!template || template.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(args.templateId);
  },
});
