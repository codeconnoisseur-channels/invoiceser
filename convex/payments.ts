import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, getCurrentUserOrNull } from "./lib/auth";

export const getPaymentsForInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) return [];
    return ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();
  },
});

export const recordPayment = mutation({
  args: {
    invoiceId: v.id("invoices"),
    amount: v.number(),
    dateReceived: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== user._id) throw new Error("Not found");
    if (!["sent", "overdue", "paid"].includes(invoice.status))
      throw new Error("Cannot record payment for this invoice status");

    await ctx.db.insert("payments", {
      invoiceId: args.invoiceId,
      userId: user._id,
      amount: args.amount,
      dateReceived: args.dateReceived,
      note: args.note,
      createdAt: Date.now(),
    });

    await ctx.db.insert("activityLog", {
      invoiceId: args.invoiceId,
      userId: user._id,
      eventType: "payment_recorded",
      metadata: JSON.stringify({ amount: args.amount, date: args.dateReceived }),
      createdAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      userId: user._id,
      invoiceId: args.invoiceId,
      type: "payment_recorded",
      message: `Payment of ${args.amount} recorded on invoice ${invoice.invoiceNumber}`,
      read: false,
      createdAt: Date.now(),
    });

    // Check if fully paid
    const allPayments = await ctx.db
      .query("payments")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();
    const totalPaid = allPayments.reduce((s, p) => s + p.amount, 0) + args.amount;

    if (totalPaid >= invoice.total) {
      await ctx.db.patch(args.invoiceId, {
        status: "paid",
        paidAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert("activityLog", {
        invoiceId: args.invoiceId,
        userId: user._id,
        eventType: "paid",
        createdAt: Date.now(),
      });
      await ctx.db.insert("notifications", {
        userId: user._id,
        invoiceId: args.invoiceId,
        type: "invoice_paid",
        message: `Invoice ${invoice.invoiceNumber} marked as paid`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});
