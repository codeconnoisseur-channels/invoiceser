"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/dates";
import { timeAgo } from "@/lib/dates";
import { toast } from "sonner";

export default function SupportPage() {
  const tickets = useQuery(api.support.listMyTickets);
  const createTicket = useMutation(api.support.createTicket);

  const [formOpen, setFormOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    try {
      setSaving(true);
      const ticketId = await createTicket({ subject, message });
      setFormOpen(false);
      setSubject("");
      setMessage("");
      toast.success("Support request submitted");
      window.location.href = `/support/${ticketId}`;
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Help & Support</h1>
            <p className="text-sm text-gray-500 mt-0.5">Submit a request or view your support history</p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Submit a Request
        </Button>
      </div>

      <Card className="rounded-2xl border-teal-200/50 dark:border-teal-900/30 shadow-card dark:shadow-card-dark overflow-hidden">
        <CardContent className="p-0">
          {tickets === undefined ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Loading...
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-700">
                No support requests
              </p>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Submit a request if you need help
              </p>
              <Button onClick={() => setFormOpen(true)}>
                Submit a request
              </Button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Link
                key={ticket._id}
                href={`/support/${ticket._id}`}
                className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-25 transition-colors last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {timeAgo(ticket.updatedAt)}
                  </p>
                </div>
                <Badge variant={ticket.status}>
                  {ticket.status.replace("_", " ")}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a Support Request</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-4">
            <div>
              <Label>Subject *</Label>
              <Input
                className="mt-1.5"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <Label>Message *</Label>
              <Textarea
                className="mt-1.5"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
