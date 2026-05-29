import { InvoiceForm } from "@/components/invoices/invoice-form";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Invoice Builder</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the details on the left — the preview updates live on the right
        </p>
      </div>
      <InvoiceForm initialClientId={clientId} />
    </div>
  );
}
