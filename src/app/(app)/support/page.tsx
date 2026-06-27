"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function SupportPage() {
  const createTicket = useMutation(api.support.createTicket);

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
      // This will now just act as sending a message to admin via email
      await createTicket({ subject, message });
      setSubject("");
      setMessage("");
      toast.success("Your message has been sent to our support team!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center ring-1 ring-teal-200 dark:ring-teal-800 mt-0.5 shrink-0 shadow-sm">
          <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Contact Support</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Need help? Send us a message and we'll get back to you via email.
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border-gray-200/70 dark:border-gray-800 shadow-card dark:shadow-card-dark overflow-hidden bg-white dark:bg-gray-900">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Subject
            </Label>
            <Input
              className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 h-11 text-base focus-visible:ring-teal-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Message
            </Label>
            <Textarea
              className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 min-h-[160px] text-base p-3 resize-y focus-visible:ring-teal-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe how we can help you..."
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button 
              onClick={handleCreate} 
              disabled={saving}
              className="h-11 px-8 bg-teal-600 hover:bg-teal-700 text-white font-bold gap-2 shadow-sm shadow-teal-500/20"
            >
              {saving ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
