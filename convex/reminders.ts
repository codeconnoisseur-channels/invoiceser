import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

type ReminderTarget = {
  invoiceId: Id<"invoices">;
  userId: Id<"users">;
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  total: number;
  currency: string;
  businessName: string;
};

export const getReminderTargets = internalQuery({
  args: { today: v.string() },
  handler: async (ctx, { today }): Promise<ReminderTarget[]> => {
    const allSettings = await ctx.db.query("settings").collect();
    const active = allSettings.filter((s) => s.autoReminderEnabled);
    const results: ReminderTarget[] = [];

    for (const settings of active) {
      const targets: string[] = [];
      if (settings.autoReminderDaysBefore)
        targets.push(addDays(today, settings.autoReminderDaysBefore));
      if (settings.autoReminderDaysAfter)
        targets.push(addDays(today, -settings.autoReminderDaysAfter));

      for (const targetDate of targets) {
        const invoices = await ctx.db
          .query("invoices")
          .withIndex("by_user_due_date", (q) =>
            q.eq("userId", settings.userId).eq("dueDate", targetDate)
          )
          .collect();

        const relevant = invoices.filter(
          (inv) => inv.status === "sent" || inv.status === "overdue"
        );

        const since = Date.now() - 24 * 60 * 60 * 1000;

        for (const inv of relevant) {
          const activity = await ctx.db
            .query("activityLog")
            .withIndex("by_invoice", (q) => q.eq("invoiceId", inv._id))
            .collect();

          const alreadySent = activity.some(
            (a) => a.eventType === "reminder_sent" && a.createdAt > since
          );

          if (!alreadySent) {
            results.push({
              invoiceId: inv._id,
              userId: settings.userId,
              clientEmail: inv.clientSnapshot.email,
              clientName: inv.clientSnapshot.fullName,
              invoiceNumber: inv.invoiceNumber,
              dueDate: targetDate,
              total: inv.total,
              currency: inv.currency,
              businessName: settings.companyName,
            });
          }
        }
      }
    }

    return results;
  },
});

export const logReminderSent = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      invoiceId: args.invoiceId,
      userId: args.userId,
      eventType: "reminder_sent",
      createdAt: Date.now(),
    });
  },
});


