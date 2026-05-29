"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/dates";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function SupportTicketPage() {
  const params = useParams();
  const ticketId = params.ticketId as Id<"supportTickets">;
  const { user } = useUser();

  const ticket = useQuery(api.support.getTicket, { ticketId });
  const messages = useQuery(api.support.getMessages, { ticketId });
  const reply = useMutation(api.support.replyToTicket);

  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handleReply() {
    if (!body.trim()) return;
    try {
      setSending(true);
      await reply({ ticketId, body });
      setBody("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  if (!ticket || !messages) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/support" className="hover:text-gray-600">
          Support
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">
          {ticket.subject}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">{ticket.subject}</h1>
        <Badge variant={ticket.status}>
          {ticket.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        {messages.map((msg) => {
          const isMe = msg.authorId !== undefined;
          const isAdmin = msg.isAdmin;
          return (
            <Card key={msg._id} className={isAdmin ? "border-primary-100 bg-primary-50/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    {isAdmin ? "Support Team" : user?.firstName ?? "You"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {msg.body}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {ticket.status !== "resolved" && (
        <div className="space-y-3">
          <Textarea
            rows={4}
            placeholder="Write a reply..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleReply} disabled={sending || !body.trim()}>
              Send Reply
            </Button>
          </div>
        </div>
      )}

      {ticket.status === "resolved" && (
        <div className="text-center py-4 text-sm text-gray-400">
          This ticket is resolved. Submit a new request if you need further help.
        </div>
      )}
    </div>
  );
}
