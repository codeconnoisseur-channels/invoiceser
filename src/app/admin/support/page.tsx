"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/dates";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminSupportPage() {
  const tickets = useQuery(api.support.listAllTickets, {});
  const updateStatus = useMutation(api.support.updateTicketStatus);

  async function handleStatus(id: Id<"supportTickets">, status: "open" | "in_progress" | "resolved" | "closed") {
    try {
      await updateStatus({ ticketId: id, status });
      toast.success("Ticket updated");
    } catch {
      toast.error("Failed to update ticket");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Support Tickets</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Created</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket) => (
                <tr key={ticket._id} className="border-b border-gray-50 hover:bg-gray-25">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{ticket.subject}</p>
                    {ticket.category && (
                      <p className="text-xs text-gray-400 capitalize">{ticket.category.replace(/_/g, " ")}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ticket.userEmail ?? ticket.userId}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={ticket.status}
                      onValueChange={(v) =>
                        handleStatus(ticket._id, v as "open" | "in_progress" | "resolved" | "closed")
                      }
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(ticket._creationTime)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                      <Link href={`/admin/support/${ticket._id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {tickets?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    No support tickets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
