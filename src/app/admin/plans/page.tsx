"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminPlansPage() {
  const flags = useQuery(api.admin.getFeatureFlags);
  const upsertFlag = useMutation(api.admin.upsertFeatureFlag);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  async function handleSave(key: string) {
    try {
      await upsertFlag({ key, value: editValues[key] ?? "" });
      toast.success("Flag updated");
    } catch {
      toast.error("Failed to update flag");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Plans & Feature Flags
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          {flags === undefined ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : flags.length === 0 ? (
            <p className="text-sm text-gray-400">
              No flags configured. They&apos;ll be seeded on first use.
            </p>
          ) : (
            <div className="space-y-3">
              {flags.map((flag) => (
                <div
                  key={flag._id}
                  className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-mono font-medium text-gray-800">
                      {flag.key}
                    </p>
                    {flag.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {flag.description}
                      </p>
                    )}
                  </div>
                  <Input
                    className="w-32 text-sm font-mono"
                    defaultValue={flag.value}
                    onChange={(e) =>
                      setEditValues((p) => ({ ...p, [flag.key]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSave(flag.key)}
                  >
                    Save
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
