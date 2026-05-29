"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateInsights = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const invoices = (await ctx.runQuery(api.invoices.getAnalyticsData, {
      range: "all",
    })) as Array<{
      status: string;
      total: number;
      clientSnapshot: { fullName: string };
      invoiceNumber: string;
      dueDate: string;
      createdAt: number;
      sentAt?: number;
      paidAt?: number;
    }>;

    const clients = (await ctx.runQuery(api.clients.listClients)) as Array<{
      _id: string;
      fullName: string;
    }>;

    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;

    const totalPaid = invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.total, 0);
    const totalPending = invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((s, i) => s + i.total, 0);
    const totalOverdue = invoices
      .filter((i) => i.status === "overdue")
      .reduce((s, i) => s + i.total, 0);
    const overdueCount = invoices.filter((i) => i.status === "overdue").length;

    const paidInvoices = invoices.filter(
      (i) => i.status === "paid" && i.sentAt && i.paidAt
    );
    const avgDaysToPay =
      paidInvoices.length > 0
        ? paidInvoices.reduce(
            (s, i) => s + (i.paidAt! - i.sentAt!) / msPerDay,
            0
          ) / paidInvoices.length
        : 0;

    // Monthly revenue (last 12 months)
    const monthlyRevenue: Record<
      string,
      { billed: number; collected: number }
    > = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      if (!monthlyRevenue[key]) monthlyRevenue[key] = { billed: 0, collected: 0 };
      monthlyRevenue[key].billed += inv.total;
      if (inv.status === "paid") monthlyRevenue[key].collected += inv.total;
    });

    const clientStats: Record<
      string,
      {
        name: string;
        invoiceCount: number;
        totalBilled: number;
        totalPaid: number;
        totalDays: number;
        paidCount: number;
        hasOverdue: boolean;
        lastInvoicedDate: number;
      }
    > = {};
    invoices.forEach((inv) => {
      const name = inv.clientSnapshot.fullName;
      if (!clientStats[name]) {
        clientStats[name] = {
          name,
          invoiceCount: 0,
          totalBilled: 0,
          totalPaid: 0,
          totalDays: 0,
          paidCount: 0,
          hasOverdue: false,
          lastInvoicedDate: 0,
        };
      }
      clientStats[name].invoiceCount++;
      clientStats[name].totalBilled += inv.total;
      if (inv.status === "paid") {
        clientStats[name].totalPaid += inv.total;
        if (inv.sentAt && inv.paidAt) {
          clientStats[name].totalDays += (inv.paidAt - inv.sentAt) / msPerDay;
          clientStats[name].paidCount++;
        }
      }
      if (inv.status === "overdue") clientStats[name].hasOverdue = true;
      if (inv.createdAt > clientStats[name].lastInvoicedDate)
        clientStats[name].lastInvoicedDate = inv.createdAt;
    });

    const payload = {
      generatedAt: new Date().toISOString().split("T")[0],
      summary: {
        totalInvoices: invoices.length,
        totalPaid,
        totalPending,
        totalOverdue,
        overdueCount,
        avgDaysToPay: Math.round(avgDaysToPay * 10) / 10,
      },
      clients: Object.values(clientStats)
        .slice(0, 20)
        .map((c) => ({
          name: c.name,
          invoiceCount: c.invoiceCount,
          totalBilled: c.totalBilled,
          totalPaid: c.totalPaid,
          avgDaysToPay:
            c.paidCount > 0
              ? Math.round((c.totalDays / c.paidCount) * 10) / 10
              : null,
          lastInvoicedDate: new Date(c.lastInvoicedDate)
            .toISOString()
            .split("T")[0],
          hasOverdue: c.hasOverdue,
        })),
      recentInvoices: invoices
        .filter((i) => i.status === "overdue" || i.status === "sent")
        .slice(0, 10)
        .map((i) => ({
          invoiceNumber: i.invoiceNumber,
          clientName: i.clientSnapshot.fullName,
          total: i.total,
          status: i.status,
          dueDate: i.dueDate,
          daysSinceDue:
            i.status === "overdue"
              ? Math.floor(
                  (now - new Date(i.dueDate).getTime()) / msPerDay
                )
              : 0,
        })),
      monthlyRevenue: Object.entries(monthlyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, data]) => ({ month, ...data })),
    };

    const groqKey = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL_NAME ?? "llama-3.3-70b-versatile";
    if (!groqKey) throw new Error("GROQ_API_KEY not set");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            {
              role: "system",
              content: `You are a financial assistant for a freelance invoicing tool.
Analyse the provided invoice and client data and return a JSON array of insight cards.
Each card must have:
  - "type": one of "flagged_payer" | "revenue_trend" | "dormant_client" | "avg_payment_time" | "overdue_summary" | "best_worst_month"
  - "title": a short headline (max 60 chars)
  - "summary": a 1–2 sentence actionable insight (max 200 chars)
  - "actionLabel": optional string — a suggested button label (e.g. "Send Reminder", "View Client")
  - "actionTarget": optional string — "invoice" | "client" | null
Return only valid JSON. No markdown, no explanation outside the JSON array.
Limit response to a maximum of 6 insight cards.`,
            },
            {
              role: "user",
              content: JSON.stringify(payload),
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Groq API error: ${response.status} — ${body}`);
    }

    const result = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = result.choices[0]?.message?.content ?? "[]";

    await ctx.runMutation(api.users.storeAiInsights, { insights: content });
    return content;
  },
});

export const askQuestion = action({
  args: { question: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const invoices = (await ctx.runQuery(api.invoices.getAnalyticsData, {
      range: "all",
    })) as Array<{
      status: string;
      total: number;
      clientSnapshot: { fullName: string };
      invoiceNumber: string;
      dueDate: string;
      createdAt: number;
    }>;

    const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
    const totalPending = invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.total, 0);
    const overdueCount = invoices.filter((i) => i.status === "overdue").length;

    const context = {
      totalInvoices: invoices.length,
      totalPaid,
      totalPending,
      overdueCount,
      invoices: invoices.slice(0, 60).map((i) => ({
        invoiceNumber:  i.invoiceNumber,
        clientName:     i.clientSnapshot.fullName,
        total:          i.total,
        status:         i.status,
        dueDate:        i.dueDate,
        createdAt:      new Date(i.createdAt).toISOString().split("T")[0],
      })),
    };

    const groqKey   = process.env.GROQ_API_KEY;
    const groqModel = process.env.GROQ_MODEL_NAME ?? "llama-3.3-70b-versatile";
    if (!groqKey) throw new Error("GROQ_API_KEY not set");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          {
            role: "system",
            content: `You are a concise financial assistant for a freelance invoicing tool. You have access to the user's invoice data. Answer the user's question directly, using specific numbers and client names from the data. Keep answers under 120 words. Be helpful and actionable.`,
          },
          {
            role: "user",
            content: `Invoice data:\n${JSON.stringify(context)}\n\nQuestion: ${args.question}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Groq API error: ${response.status} — ${body}`);
    }

    const result = await response.json() as { choices: Array<{ message: { content: string } }> };
    return result.choices[0]?.message?.content ?? "I couldn't generate an answer.";
  },
});
