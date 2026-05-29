"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const announcements = useQuery(api.admin.getAllAnnouncements);
  const createAnnouncement = useMutation(api.admin.createAnnouncement);
  const updateAnnouncement = useMutation(api.admin.updateAnnouncement);

  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "maintenance">("info");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!message.trim()) return;
    try {
      setSaving(true);
      await createAnnouncement({ message, type, active });
      setMessage("");
      toast.success("Announcement created");
    } catch {
      toast.error("Failed to create announcement");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: Id<"announcements">, active: boolean) {
    await updateAnnouncement({ id, active });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Announcements</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Message</Label>
            <Input
              className="mt-1.5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Announcement text..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) =>
                  setType(v as "info" | "warning" | "maintenance")
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <Switch checked={active} onCheckedChange={setActive} />
              <Label>Active</Label>
            </div>
          </div>
          <Button onClick={handleCreate} disabled={saving}>
            Create Announcement
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {announcements?.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Badge variant={a.type}>{a.type}</Badge>
                <p className="text-sm text-gray-700">{a.message}</p>
              </div>
              <Switch
                checked={a.active}
                onCheckedChange={(v) => toggleActive(a._id, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
