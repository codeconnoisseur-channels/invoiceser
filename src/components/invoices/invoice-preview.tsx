import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";

export interface PreviewLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type InvoiceFont = "default" | "serif" | "mono";

export interface InvoicePreviewProps {
  companyName: string;
  logoUrl?: string | null;
  brandColor: string;
  hideBranding?: boolean;
  invoiceFont?: InvoiceFont | string;
  businessAddress?: string;
  businessCity?: string;
  businessCountry?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  showBusinessAddress?: boolean;
  showBusinessPhone?: boolean;
  showBusinessEmail?: boolean;
  showBusinessWebsite?: boolean;
  invoiceNumber: string;
  issueDate?: string;
  dueDate?: string;
  clientName: string;
  clientCompany?: string;
  clientAddress?: string;
  clientEmail?: string;
  lineItems: PreviewLineItem[];
  currency: string;
  subtotal: number;
  hasTax: boolean;
  salesTaxEnabled: boolean;
  salesTaxAmount: number;
  salesTaxLabel?: string;
  salesTaxRate?: number;
  vatEnabled: boolean;
  vatAmount: number;
  vatLabel?: string;
  vatRate?: number;
  total: number;
  paymentInstructions?: string;
  notes?: string;
}

const FONT_CLASS: Record<string, string> = {
  default: "font-sans",
  serif:   "font-serif",
  mono:    "font-mono",
};

export function InvoicePreview({
  companyName, logoUrl, brandColor,
  hideBranding, invoiceFont,
  businessAddress, businessCity, businessCountry, businessPhone, businessEmail, businessWebsite,
  showBusinessAddress, showBusinessPhone, showBusinessEmail, showBusinessWebsite,
  invoiceNumber, issueDate, dueDate,
  clientName, clientCompany, clientAddress, clientEmail,
  lineItems, currency,
  hasTax, subtotal,
  salesTaxEnabled, salesTaxAmount, salesTaxLabel, salesTaxRate,
  vatEnabled, vatAmount, vatLabel, vatRate,
  total,
  paymentInstructions,
  notes,
}: InvoicePreviewProps) {
  const accent = brandColor || "#2563EB";
  const fontClass = FONT_CLASS[invoiceFont ?? "default"] ?? "font-sans";
  const visibleItems = lineItems.filter((i) => i.description || i.amount > 0);
  const displayAddress = showBusinessAddress !== false && businessAddress;
  const displayCity    = showBusinessAddress !== false && (businessCity || businessCountry);
  const displayPhone   = showBusinessPhone   !== false && businessPhone;
  const displayEmail   = showBusinessEmail   !== false && businessEmail;
  const displayWebsite = showBusinessWebsite !== false && businessWebsite;

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 flex justify-center">
      {/* Paper */}
      <div className={`bg-white w-full max-w-[540px] shadow-2xl text-[11px] leading-relaxed ${fontClass}`}>

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5">
          <div className="max-w-[55%]">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="logo" className="h-10 max-w-[120px] object-contain mb-3" />
            )}
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: accent }}>
                {companyName || "Your Business Name"}
              </p>
              {displayAddress && <p className="text-gray-500 mt-0.5">{businessAddress}</p>}
              {displayCity && (
                <p className="text-gray-500">{[businessCity, businessCountry].filter(Boolean).join(", ")}</p>
              )}
              {displayPhone && <p className="text-gray-500 mt-0.5">{businessPhone}</p>}
              {displayEmail && <p className="text-gray-500">{businessEmail}</p>}
              {displayWebsite && <p className="text-gray-500">{businessWebsite}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-800 tracking-tight">INVOICE</p>
            <p className="font-mono font-semibold text-gray-600 mt-1 text-xs">{invoiceNumber}</p>
            {issueDate && (
              <p className="text-gray-400 mt-2 text-[10px]">
                Issued: <span className="text-gray-600">{formatDate(issueDate)}</span>
              </p>
            )}
            {dueDate && (
              <p className="text-gray-400 text-[10px]">
                Due: <span className="font-semibold text-gray-700">{formatDate(dueDate)}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bill To band */}
        <div className="px-7 py-3" style={{ backgroundColor: `${accent}18` }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>
            Bill To
          </p>
          <p className="font-bold text-gray-800 text-xs">{clientName || "Client Name"}</p>
          {clientCompany && <p className="text-gray-500">{clientCompany}</p>}
          {clientAddress && <p className="text-gray-500">{clientAddress}</p>}
          {clientEmail && <p className="text-gray-400">{clientEmail}</p>}
        </div>

        {/* Line items */}
        <div className="px-7 pt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: accent }}>
                <th className="text-left py-2.5 px-2 text-[9px] font-bold uppercase tracking-wide text-white first:pl-3 last:pr-3">Description</th>
                <th className="text-right py-2.5 px-2 text-[9px] font-bold uppercase tracking-wide text-white">Unit Cost</th>
                <th className="text-right py-2.5 px-2 text-[9px] font-bold uppercase tracking-wide text-white">Qty</th>
                <th className="text-right py-2.5 px-2 text-[9px] font-bold uppercase tracking-wide text-white last:pr-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-300 italic text-[10px]">
                    Add items to see them here
                  </td>
                </tr>
              ) : (
                visibleItems.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className="py-2 px-2 text-gray-700 first:pl-3 align-top">{item.description || "—"}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-gray-500">
                      {item.rate > 0 ? formatCurrency(item.rate, currency) : "—"}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-500">{item.quantity}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-semibold text-gray-800 last:pr-3">
                      {item.amount > 0 ? formatCurrency(item.amount, currency) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-7 pt-3 pb-5">
          <div className="flex justify-end">
            <div className="w-52 space-y-1.5">
              {hasTax && (
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(subtotal, currency)}</span>
                </div>
              )}
              {salesTaxEnabled && salesTaxAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>{salesTaxLabel || "Sales Tax"} ({salesTaxRate}%)</span>
                  <span className="tabular-nums">{formatCurrency(salesTaxAmount, currency)}</span>
                </div>
              )}
              {vatEnabled && vatAmount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>{vatLabel || "VAT"} ({vatRate}%)</span>
                  <span className="tabular-nums">{formatCurrency(vatAmount, currency)}</span>
                </div>
              )}
              <div
                className="border-t pt-2 flex justify-between font-black text-sm"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                <span>TOTAL</span>
                <span className="tabular-nums">{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment details */}
        {paymentInstructions && (
          <div className="px-7 py-4 border-t border-gray-100">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              Payment Details
            </p>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{paymentInstructions}</p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="px-7 py-4 border-t border-gray-100">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              Notes
            </p>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-7 py-3 border-t border-gray-100 bg-gray-50/50 text-center space-y-0.5">
          <p className="text-[9px] text-gray-400">Thank you for doing business with us</p>
          {!hideBranding && <p className="text-[8px] text-gray-300">Powered by Invoiceser</p>}
        </div>
      </div>
    </div>
  );
}
