"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoiceId = id as Id<"invoices">;
  const invoice = useQuery(api.invoices.getInvoice, { invoiceId });

  if (invoice === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!invoice || invoice.status !== "draft") {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500">This invoice cannot be edited.</p>
        <Link href="/invoices" className="text-blue-600 hover:underline text-sm mt-2 inline-block">← Back to invoices</Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/invoices/${invoiceId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {invoice.invoiceNumber}
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Draft</h1>
        <p className="text-sm text-gray-400 mt-1">
          Editing {invoice.invoiceNumber} — changes are saved when you click &quot;Update Draft&quot;
        </p>
      </div>
      <InvoiceForm invoiceId={invoiceId} existingInvoice={invoice} />
    </div>
  );
}
