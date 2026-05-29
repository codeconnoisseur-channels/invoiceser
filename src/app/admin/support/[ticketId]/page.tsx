"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminTicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const ticket = useQuery(api.support.adminGetTicket, { ticketId: ticketId as Id<"supportTickets"> });
  const messages = useQuery(api.support.adminGetMessages, { ticketId: ticketId as Id<"supportTickets"> });
  const adminReply = useMutation(api.support.adminReplyToTicket);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function handleReply() {
    if (!reply.trim()) return;
    try {
      setSending(true);
      await adminReply({ ticketId: ticketId as Id<"supportTickets">, message: reply });
      setReply("");
      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  if (!ticket) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/support"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to tickets
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{ticket.subject}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {ticket.userEmail} · {formatDate(ticket._creationTime)}
          </p>
        </div>
        <Badge>{ticket.status.replace(/_/g, " ")}</Badge>
      </div>

      <div className="space-y-3 mb-6">
        {messages?.map((msg) => (
          <Card key={msg._id} className={msg.isAdmin ? "border-primary-100 bg-primary-50" : ""}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {msg.isAdmin ? "Support" : "User"}
                </p>
                <p className="text-xs text-gray-400">{formatDate(msg._creationTime)}</p>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Reply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
          />
          <Button onClick={handleReply} disabled={sending || !reply.trim()}>
            Send Reply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
