import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { InvoiceEmailTemplate } from "@/emails/invoice-email";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import { renderAsync } from "@react-email/components";
import React from "react";

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
      React.createElement(InvoiceEmailTemplate, {
        companyName: settings.companyName || "Invoiceser",
        logoUrl,
        clientName: invoice.clientSnapshot.fullName,
        invoiceNumber: invoice.invoiceNumber,
        total: formatCurrency(invoice.total, invoice.currency),
        currency: invoice.currency,
        issueDate: formatDate(invoice.issueDate),
        dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : "No due date",
        publicInvoiceUrl: publicUrl,
        paymentDetails,
        paymentInstructions: invoice.paymentInstructions ?? settings.paymentInstructions,
      })
    );

    // Generate PDF attachment
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfRes = await fetch(`${appUrl}/api/pdf/${invoiceId}`, {
        method: "GET",
        headers: { Cookie: req.headers.get("cookie") ?? "" },
      });
      if (pdfRes.ok) {
        pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
      }
    } catch {
      // PDF failure is non-fatal
    }

    const fromName = settings.companyName || "Invoiceser";
    const attachments = pdfBuffer
      ? [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
      : [];

    const replyTo = settings.businessEmail || undefined;

    const { error } = await resend.emails.send({
      from: `${fromName} <onboarding@resend.dev>`,
      to: [invoice.clientSnapshot.email],
      replyTo,
      subject: `Invoice ${invoice.invoiceNumber} from ${fromName}`,
      html,
      attachments,
    });

    if (error) {
      await fetchMutation(
        api.invoices.markEmailDelivery,
        { invoiceId: invoiceId as Id<"invoices">, status: "failed", error: error.message },
        { token }
      );
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await fetchMutation(
      api.invoices.markEmailDelivery,
      { invoiceId: invoiceId as Id<"invoices">, status: "delivered" },
      { token }
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("send-invoice error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
