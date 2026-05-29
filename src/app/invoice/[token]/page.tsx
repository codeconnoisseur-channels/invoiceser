"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FileText } from "lucide-react";
import { InvoicePreview } from "@/components/invoices/invoice-preview";

export default function PublicInvoicePage() {
  const params = useParams();
  const token = params.token as string;

  const invoice  = useQuery(api.invoices.getInvoiceByToken, { token });
  const markViewed = useMutation(api.invoices.markInvoiceViewed);

  const biz = useQuery(
    api.settings.getSettingsForPublicInvoice,
    invoice?._id ? { invoiceId: invoice._id } : "skip"
  );
  const logoUrl = useQuery(
    api.settings.getLogoUrl,
    biz?.logoStorageId ? { storageId: biz.logoStorageId } : "skip"
  );

  useEffect(() => {
    if (invoice?._id && invoice.status !== "draft") {
      markViewed({ token }).catch(() => {});
    }
  }, [invoice?._id, invoice?.status, markViewed, token]);

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
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-[600px] mx-auto">
        <InvoicePreview
          companyName={biz?.companyName ?? ""}
          logoUrl={logoUrl}
          brandColor={biz?.brandColor ?? "#2563EB"}
          businessAddress={biz?.businessAddress ?? ""}
          businessCity={biz?.businessCity ?? ""}
          businessCountry={biz?.businessCountry ?? ""}
          businessPhone={biz?.businessPhone ?? ""}
          businessEmail={biz?.businessEmail ?? ""}
          businessWebsite={biz?.businessWebsite ?? ""}
          showBusinessAddress={biz?.showBusinessAddress}
          showBusinessPhone={biz?.showBusinessPhone}
          showBusinessEmail={biz?.showBusinessEmail}
          showBusinessWebsite={biz?.showBusinessWebsite}
          hideBranding={biz?.hideBranding}
          invoiceFont={biz?.invoiceFont}
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
          hasTax={invoice.salesTaxEnabled || invoice.vatEnabled}
          salesTaxEnabled={invoice.salesTaxEnabled}
          salesTaxAmount={invoice.salesTaxAmount ?? 0}
          salesTaxLabel={invoice.salesTaxLabel}
          salesTaxRate={invoice.salesTaxRate}
          vatEnabled={invoice.vatEnabled}
          vatAmount={invoice.vatAmount ?? 0}
          vatLabel={invoice.vatLabel}
          vatRate={invoice.vatRate}
          total={invoice.total}
          paymentInstructions={invoice.paymentInstructions}
          notes={invoice.notes}
        />
      </div>
    </div>
  );
}
