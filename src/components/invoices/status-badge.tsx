import { Badge } from "@/components/ui/badge";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "voided";

const labels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  voided: "Cancelled",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge variant={status}>{labels[status]}</Badge>;
}
