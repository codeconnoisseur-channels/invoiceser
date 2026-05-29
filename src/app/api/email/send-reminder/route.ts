import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ReminderEmailTemplate } from "@/emails/reminder-email";
import { formatCurrency } from "@/lib/currency";
import { formatDate, relativeDueDate } from "@/lib/dates";
import { renderAsync } from "@react-email/components";
import React from "react";
import { parseISO } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = await getToken({ template: "convex" });
    if (!token) return NextResponse.json({ error: "Auth token unavailable" }, { status: 401 });

    const body = await req.json().catch(() => null) as { invoiceId?: string } | null;
    if (!body || typeof body.invoiceId !== "string" || !body.invoiceId.trim()) {
      return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
    }
    const { invoiceId } = body;

    const [invoice, settings] = await Promise.all([
      fetchQuery(api.invoices.getInvoice, { invoiceId: invoiceId as Id<"invoices"> }, { token }),
      fetchQuery(api.settings.getSettings, {}, { token }),
    ]);

    if (!invoice || !settings) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const publicUrl = `${appUrl}/invoice/${invoice.publicToken}`;

    let logoUrl: string | undefined;
    if (settings.logoStorageId) {
      logoUrl =
        (await fetchQuery(
          api.settings.getLogoUrl,
          { storageId: settings.logoStorageId },
          { token }
        )) ?? undefined;
    }

    const isOverdue = invoice.status === "overdue";
    const dueDateParsed = invoice.dueDate ? parseISO(invoice.dueDate) : null;
    const isPast = dueDateParsed ? dueDateParsed < new Date() : false;
    const relDue = relativeDueDate(invoice.dueDate ?? undefined);

    const paymentDetails = {
      bankName:         settings.paymentBankName      ?? undefined,
      accountName:      settings.paymentAccountName   ?? undefined,
      accountNumber:    settings.paymentAccountNumber ?? undefined,
      sortCode:         settings.paymentSortCode      ?? undefined,
      iban:             settings.paymentIban           ?? undefined,
      swiftBic:         settings.paymentSwiftBic      ?? undefined,
      paymentLink:      settings.paymentLink           ?? undefined,
      paymentLinkLabel: settings.paymentLinkLabel      ?? undefined,
    };

    const html = await renderAsync(
      React.createElement(ReminderEmailTemplate, {
        companyName: settings.companyName || "Invoiceser",
        logoUrl,
        clientName: invoice.clientSnapshot.fullName,
        invoiceNumber: invoice.invoiceNumber,
        total: formatCurrency(invoice.total, invoice.currency),
        currency: invoice.currency,
        dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : "No due date",
        relativeDueDate: relDue,
        isOverdue: isPast || isOverdue,
        publicInvoiceUrl: publicUrl,
        paymentDetails,
        paymentInstructions: invoice.paymentInstructions ?? settings.paymentInstructions,
      })
    );

    const fromName = settings.companyName || "Invoiceser";

    const { error } = await resend.emails.send({
      from: `${fromName} <invoices@resend.dev>`,
      to: [invoice.clientSnapshot.email],
      subject: invoice.dueDate
        ? `Reminder: Invoice ${invoice.invoiceNumber} is due ${relDue}`
        : `Reminder: Invoice ${invoice.invoiceNumber} from ${fromName}`,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("send-reminder error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
