"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { FileText, ArrowDown, ExternalLink, Download } from "lucide-react";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { formatCurrency } from "@/lib/currency";

import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-slate-100 pb-10">
      <div className="py-10 px-4">
        <div className="max-w-[600px] mx-auto">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" className="shadow-sm" onClick={() => window.open(`/api/pdf/public/${token}`, "_blank")}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
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
    </div>
  );
}
