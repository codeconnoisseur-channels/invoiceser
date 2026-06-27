import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import React from "react";

export const maxDuration = 30;
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    // Require authentication — the invoice PDF contains sensitive billing data
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = await getToken({ template: "convex" });
    if (!token) {
      return NextResponse.json({ error: "Auth token unavailable" }, { status: 401 });
    }

    // getInvoice verifies the invoice belongs to the authenticated user
    const [invoice, biz] = await Promise.all([
      fetchQuery(
        api.invoices.getInvoice,
        { invoiceId: invoiceId as Id<"invoices"> },
        { token }
      ).catch(() => null),
      fetchQuery(api.settings.getSettingsForPublicInvoice, {
        invoiceId: invoiceId as Id<"invoices">,
      }).catch(() => null),
    ]);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    let logoUrl: string | null = null;
    if (biz?.logoStorageId) {
      logoUrl = await fetchQuery(api.settings.getLogoUrl, {
        storageId: biz.logoStorageId,
      }).catch(() => null);
    }

    const {
      Document,
      Page,
      Text,
      View,
      Image,
      StyleSheet,
      renderToBuffer,
    } = await import("@react-pdf/renderer");

    const accent = biz?.brandColor || "#2563EB";
    const accentLight = accent + "18";
    const hideBranding = biz?.hideBranding ?? false;

    const PDF_FONT: Record<string, string> = {
      default: "Helvetica",
      serif:   "Times-Roman",
      mono:    "Courier",
    };
    const pageFont = PDF_FONT[(biz as { invoiceFont?: string } | null)?.invoiceFont ?? "default"] ?? "Helvetica";

    const styles = StyleSheet.create({
      page: {
        fontFamily: pageFont,
        fontSize: 11,
        color: "#1f2937",
        backgroundColor: "#ffffff",
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "40 50 20 50",
      },
      headerLeft: { maxWidth: "55%" },
      companyName: { fontSize: 18, fontWeight: "bold", color: accent, marginBottom: 4 },
      headerMeta: { fontSize: 10, color: "#6b7280", marginTop: 2 },
      invoiceTitle: { fontSize: 28, fontWeight: "bold", color: "#111827" },
      invoiceNumber: { fontSize: 12, color: "#6b7280", fontFamily: "Helvetica", marginTop: 4 },
      dateLine: { fontSize: 10, color: "#9ca3af", marginTop: 8 },
      dateValue: { fontSize: 10, color: "#374151" },
      billToBand: {
        backgroundColor: accentLight,
        paddingHorizontal: 50,
        paddingVertical: 14,
      },
      billToLabel: { fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, color: accent, marginBottom: 4 },
      billToName: { fontSize: 14, fontWeight: "bold", color: "#111827" },
      billToSub: { fontSize: 10, color: "#6b7280", marginTop: 2 },
      tableContainer: { paddingHorizontal: 50, paddingTop: 24 },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: accent,
        paddingVertical: 10,
        paddingHorizontal: 10,
      },
      tableHeaderCell: { fontSize: 9, fontWeight: "bold", color: "#ffffff", textTransform: "uppercase" },
      tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 },
      tableRowAlt: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, backgroundColor: "#f9fafb" },
      colDesc: { flex: 3 },
      colRight: { flex: 1, textAlign: "right" },
      cellText: { fontSize: 11, color: "#374151" },
      cellMono: { fontSize: 11, color: "#374151", fontFamily: "Helvetica" },
      totalsContainer: { paddingHorizontal: 50, paddingTop: 12 },
      totalsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4 },
      totalLabel: { width: 130, textAlign: "right", fontSize: 10, color: "#6b7280" },
      totalValue: { width: 100, textAlign: "right", fontSize: 10, fontFamily: "Helvetica", color: "#374151" },
      grandTotalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
      },
      grandTotalLabel: { width: 130, textAlign: "right", fontSize: 14, fontWeight: "bold", color: accent },
      grandTotalValue: { width: 100, textAlign: "right", fontSize: 14, fontWeight: "bold", fontFamily: "Helvetica", color: accent },
      divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginTop: 12 },
      sectionContainer: { paddingHorizontal: 50, paddingTop: 24 },
      sectionLabel: { fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1.5, color: accent, marginBottom: 6 },
      sectionText: { fontSize: 10, color: "#4b5563", lineHeight: 1.7 },
      footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 12,
        paddingHorizontal: 50,
        backgroundColor: "#f9fafb",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        alignItems: "center",
      },
      footerText: { fontSize: 9, color: "#9ca3af", textAlign: "center" },
      footerBrand: { fontSize: 8, color: "#d1d5db", textAlign: "center", marginTop: 3 },
      voidWatermark: {
        position: "absolute", top: "40%", left: "15%",
        fontSize: 80, color: "#EF4444", opacity: 0.12, fontWeight: "bold",
      },
    });

    const el = React.createElement;

    const showAddress = biz?.showBusinessAddress !== false;
    const showPhone   = biz?.showBusinessPhone   !== false;
    const showEmail   = biz?.showBusinessEmail   !== false;
    const showWebsite = biz?.showBusinessWebsite !== false;

    const clientAddress = (invoice.clientSnapshot as { address?: string }).address;

    const pdfDoc = el(
      Document,
      null,
      el(
        Page,
        { size: "A4", style: styles.page, wrap: true },

        invoice.status === "voided" ? el(Text, { style: styles.voidWatermark }, "VOID") : null,

        // ── Header ──
        el(
          View,
          { style: styles.header },
          el(
            View,
            { style: styles.headerLeft },
            logoUrl
              ? el(Image, { src: logoUrl, style: { height: 32, maxWidth: 100, marginBottom: 6, objectFit: "contain" } })
              : null,
            el(Text, { style: styles.companyName }, biz?.companyName || ""),
            biz?.businessAddress && showAddress
              ? el(Text, { style: styles.headerMeta }, biz.businessAddress)
              : null,
            (biz?.businessCity || biz?.businessCountry) && showAddress
              ? el(Text, { style: styles.headerMeta }, [biz.businessCity, biz.businessCountry].filter(Boolean).join(", "))
              : null,
            biz?.businessPhone && showPhone
              ? el(Text, { style: styles.headerMeta }, biz.businessPhone)
              : null,
            biz?.businessEmail && showEmail
              ? el(Text, { style: styles.headerMeta }, biz.businessEmail)
              : null,
            biz?.businessWebsite && showWebsite
              ? el(Text, { style: styles.headerMeta }, biz.businessWebsite)
              : null,
          ),
          el(
            View,
            { style: { alignItems: "flex-end" } },
            el(Text, { style: styles.invoiceTitle }, "INVOICE"),
            el(Text, { style: styles.invoiceNumber }, invoice.invoiceNumber),
            invoice.issueDate
              ? el(View, { style: { marginTop: 10 } },
                  el(Text, { style: styles.dateLine }, ["Issued: ", el(Text, { style: styles.dateValue }, formatDate(invoice.issueDate))])
                )
              : null,
            invoice.dueDate
              ? el(View, { style: { marginTop: 2 } },
                  el(Text, { style: styles.dateLine }, ["Due: ", el(Text, { style: { ...styles.dateValue, fontWeight: "bold" } }, formatDate(invoice.dueDate))])
                )
              : null,
          )
        ),

        // ── Bill To band ──
        el(
          View,
          { style: styles.billToBand },
          el(Text, { style: styles.billToLabel }, "Bill To"),
          el(Text, { style: styles.billToName }, invoice.clientSnapshot.fullName),
          invoice.clientSnapshot.companyName
            ? el(Text, { style: styles.billToSub }, invoice.clientSnapshot.companyName)
            : null,
          clientAddress
            ? el(Text, { style: styles.billToSub }, clientAddress)
            : null,
          el(Text, { style: styles.billToSub }, invoice.clientSnapshot.email),
        ),

        // ── Line items ──
        el(
          View,
          { style: styles.tableContainer },
          el(
            View,
            { style: styles.tableHeader },
            el(Text, { style: { ...styles.tableHeaderCell, flex: 3 } }, "Description"),
            el(Text, { style: { ...styles.tableHeaderCell, flex: 1, textAlign: "right" } }, "Unit Cost"),
            el(Text, { style: { ...styles.tableHeaderCell, flex: 0.6, textAlign: "right" } }, "Qty"),
            el(Text, { style: { ...styles.tableHeaderCell, flex: 1, textAlign: "right" } }, "Amount"),
          ),
          ...invoice.lineItems.map((item, idx) =>
            el(
              View,
              { style: idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt, wrap: false },
              el(Text, { style: { ...styles.cellText, flex: 3 } }, item.description),
              el(Text, { style: { ...styles.cellMono, flex: 1, textAlign: "right" } },
                item.rate > 0 ? formatCurrency(item.rate, invoice.currency) : "—"
              ),
              el(Text, { style: { ...styles.cellText, flex: 0.6, textAlign: "right" } }, String(item.quantity)),
              el(Text, { style: { ...styles.cellMono, flex: 1, textAlign: "right", fontWeight: "bold" } },
                item.amount > 0 ? formatCurrency(item.amount, invoice.currency) : "—"
              ),
            )
          ),
        ),

        // ── Totals ──
        el(
          View,
          { style: styles.totalsContainer },
          el(View, { style: styles.divider }),
          (invoice.salesTaxEnabled || invoice.vatEnabled)
            ? el(View, { style: styles.totalsRow },
                el(Text, { style: styles.totalLabel }, "Subtotal"),
                el(Text, { style: styles.totalValue }, formatCurrency(invoice.subtotal, invoice.currency))
              )
            : null,
          invoice.salesTaxEnabled && invoice.salesTaxAmount != null
            ? el(View, { style: styles.totalsRow },
                el(Text, { style: styles.totalLabel }, `${invoice.salesTaxLabel ?? "Sales Tax"} (${invoice.salesTaxRate}%)`),
                el(Text, { style: styles.totalValue }, formatCurrency(invoice.salesTaxAmount, invoice.currency))
              )
            : null,
          invoice.vatEnabled && invoice.vatAmount != null
            ? el(View, { style: styles.totalsRow },
                el(Text, { style: styles.totalLabel }, `${invoice.vatLabel ?? "VAT"} (${invoice.vatRate}%)`),
                el(Text, { style: styles.totalValue }, formatCurrency(invoice.vatAmount, invoice.currency))
              )
            : null,
          el(
            View,
            { style: styles.grandTotalRow },
            el(Text, { style: styles.grandTotalLabel }, "TOTAL"),
            el(Text, { style: styles.grandTotalValue }, formatCurrency(invoice.total, invoice.currency))
          ),
        ),

        // ── Payment instructions ──
        invoice.paymentInstructions
          ? el(
              View,
              { style: styles.sectionContainer },
              el(Text, { style: styles.sectionLabel }, "Payment Details"),
              el(Text, { style: styles.sectionText }, invoice.paymentInstructions)
            )
          : null,

        // ── Notes ──
        invoice.notes
          ? el(
              View,
              { style: styles.sectionContainer },
              el(Text, { style: styles.sectionLabel }, "Notes"),
              el(Text, { style: styles.sectionText }, invoice.notes)
            )
          : null,

        // ── Footer ──
        el(
          View,
          { style: styles.footer, fixed: true },
          el(Text, { style: styles.footerText }, "Thank you for doing business with us"),
          !hideBranding ? el(Text, { style: styles.footerBrand }, "Powered by Invoiceser") : null,
        ),
      )
    );

    const pdfBuffer = await renderToBuffer(pdfDoc);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
