"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import nodemailer from "nodemailer";

export const sendAutoReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    if (!SMTP_USER || !SMTP_PASSWORD) {
      console.warn("SMTP_USER or SMTP_PASSWORD not set in Convex env — skipping auto reminders");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    const today = new Date().toISOString().split("T")[0];
    const targets = await ctx.runQuery(internal.reminders.getReminderTargets, { today });

    for (const t of targets) {
      try {
        const formatted = new Intl.NumberFormat("en", {
          style: "currency",
          currency: t.currency,
        }).format(t.total);

        const subject = `Reminder: Invoice ${t.invoiceNumber} — ${formatted} due`;
        const html = `
          <p>Hi ${t.clientName},</p>
          <p>This is a friendly reminder from <strong>${t.businessName}</strong> regarding invoice <strong>${t.invoiceNumber}</strong>.</p>
          <p>Amount due: <strong>${formatted}</strong></p>
          <p>Please reach out to ${t.businessName} if you have any questions.</p>
          <p>Thank you.</p>
          <p>— ${t.businessName}</p>
        `;

        await transporter.sendMail({
          from: `${t.businessName} <${SMTP_USER}>`,
          to: t.clientEmail,
          subject,
          html,
        });

        await ctx.runMutation(internal.reminders.logReminderSent, {
          invoiceId: t.invoiceId,
          userId: t.userId,
        });
      } catch (err) {
        console.error(`Auto-reminder failed for invoice ${t.invoiceId}:`, err);
      }
    }
  },
});
