import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull } from "./lib/auth";

export const listMyTickets = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    return ctx.db
      .query("supportTickets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(100);
  },
});

export const getTicket = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.userId !== user._id) return null;
    return ticket;
  },
});

export const getMessages = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.userId !== user._id) return [];
    return ctx.db
      .query("supportMessages")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
      .order("asc")
      .take(200);
  },
});

export const createTicket = mutation({
  args: {
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const ticketId = await ctx.db.insert("supportTickets", {
      userId: user._id,
      subject: args.subject,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.insert("supportMessages", {
      ticketId,
      authorId: user._id,
      isAdmin: false,
      isInternalNote: false,
      body: args.message,
      createdAt: Date.now(),
    });
    return ticketId;
  },
});

export const replyToTicket = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.userId !== user._id) throw new Error("Forbidden");
    await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      authorId: user._id,
      isAdmin: false,
      isInternalNote: false,
      body: args.body,
      createdAt: Date.now(),
    });
    await ctx.db.patch(args.ticketId, { updatedAt: Date.now() });
  },
});

// Admin queries
export const listAllTickets = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);
    const tickets = args.status
      ? await ctx.db
          .query("supportTickets")
          .withIndex("by_status", (q) =>
            q.eq("status", args.status as "open" | "in_progress" | "resolved" | "closed")
          )
          .order("desc")
          .take(200)
      : await ctx.db.query("supportTickets").order("desc").take(200);

    return Promise.all(
      tickets.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return { ...t, userEmail: user?.email };
      })
    );
  },
});

export const adminGetTicket = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Not found");
    const user = await ctx.db.get(ticket.userId);
    return { ...ticket, userEmail: user?.email };
  },
});

export const adminGetMessages = query({
  args: { ticketId: v.id("supportTickets") },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);
    return ctx.db
      .query("supportMessages")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
      .order("asc")
      .take(200);
  },
});

export const adminReplyToTicket = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      authorId: user._id,
      isAdmin: true,
      isInternalNote: false,
      body: args.message,
      createdAt: Date.now(),
    });
    await ctx.db.patch(args.ticketId, {
      status: "in_progress",
      updatedAt: Date.now(),
    });
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    await getCurrentUser(ctx);
    await ctx.db.patch(args.ticketId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
