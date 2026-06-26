"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { FileText, ArrowDown, ExternalLink, Download } from "lucide-react";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { formatCurrency } from "@/lib/currency";

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s,;)]+/g;
  return text.match(urlRegex) || [];
}

export default function PublicInvoicePage() {
  const params = useParams();
  const token = params.token as string;

  const data     = useQuery(api.invoices.getPublicInvoiceData, { token });
  const markViewed = useMutation(api.invoices.markInvoiceViewed);

  const invoice = data?.invoice ?? undefined;
  const biz     = data?.settings ?? null;
  const logoUrl = data?.logoUrl ?? null;

  useEffect(() => {
    if (invoice?._id && invoice.status !== "draft") {
      markViewed({ token }).catch(() => {});
    }
  }, [invoice?._id, invoice?.status, markViewed, token]);

  const paymentUrls = useMemo(() => {
    if (!invoice?.paymentInstructions) return [];
    return extractUrls(invoice.paymentInstructions);
  }, [invoice?.paymentInstructions]);

  const scrollToPayment = () => {
    const el = document.getElementById("payment-details");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (invoice === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-700">Invoice not found</p>
          <p className="text-sm text-gray-400 mt-1">This link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <div className="py-10 px-4">
        <div className="max-w-[600px] mx-auto">
          <InvoicePreview
            companyName={invoice.fromName || biz?.companyName || ""}
            logoUrl={logoUrl}
            brandColor={invoice.brandColor || biz?.brandColor || "#2563EB"}
            businessAddress={invoice.fromAddress || biz?.businessAddress || ""}
            businessCity=""
            businessCountry=""
            businessPhone={invoice.fromPhone || biz?.businessPhone || ""}
            businessEmail={invoice.fromEmail || biz?.businessEmail || ""}
            businessWebsite=""
            showBusinessAddress={true}
            showBusinessPhone={true}
            showBusinessEmail={true}
            showBusinessWebsite={false}
            hideBranding={invoice.hideBranding ?? biz?.hideBranding}
            invoiceFont={invoice.invoiceFont || biz?.invoiceFont || "default"}
            invoiceNumber={invoice.invoiceNumber}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
            clientName={invoice.clientSnapshot.fullName}
            clientCompany={invoice.clientSnapshot.companyName}
            clientAddress={(invoice.clientSnapshot as { address?: string }).address}
            clientEmail={invoice.clientSnapshot.email}
            lineItems={invoice.lineItems}
            currency={invoice.currency}
            subtotal={invoice.subtotal}
            hasTax={(invoice.taxLines && invoice.taxLines.length > 0) || invoice.salesTaxEnabled || invoice.vatEnabled}
            salesTaxEnabled={false}
            salesTaxAmount={0}
            salesTaxLabel=""
            salesTaxRate={0}
            vatEnabled={false}
            vatAmount={0}
            vatLabel=""
            vatRate={0}
            taxLines={invoice.taxLines as { id: string; label: string; rate: number; amount: number }[] | undefined}
            total={invoice.total}
            paymentInstructions={invoice.paymentInstructions}
            notes={invoice.notes}
          />
        </div>
      </div>

      {/* Sticky Pay Now bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-[600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Total Due</p>
            <p className="text-lg font-bold text-gray-900 tabular-nums">
              {formatCurrency(invoice.total, invoice.currency)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!invoice.paidAt && invoice.status !== "voided" && invoice.status !== "draft" && (
              <>
                <a
                  href={`/api/pdf/${invoice._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </a>
                {paymentUrls.length > 0 ? (
                  <a
                    href={paymentUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
                  >
                    Pay Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={scrollToPayment}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
                  >
                    View Payment Details
                    <ArrowDown className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
            {invoice.status === "paid" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 border border-green-200">
                Paid
              </span>
            )}
            {invoice.status === "voided" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-500 border border-gray-200">
                Voided
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
