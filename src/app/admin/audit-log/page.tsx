"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";

const actionColor: Record<string, string> = {
  create: "text-green-600",
  update: "text-blue-600",
  delete: "text-red-600",
  send: "text-purple-600",
  void: "text-orange-600",
};

export default function AdminAuditLogPage() {
  const entries = useQuery(api.admin.getAuditLog);
  const [search, setSearch] = useState("");

  const filtered = entries?.filter(
    (e) =>
      !search ||
      e.action.includes(search.toLowerCase()) ||
      e.resource.includes(search.toLowerCase()) ||
      e.userId.includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Audit Log</h1>

      <Input
        className="mb-4 max-w-xs"
        placeholder="Filter by action, resource, user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">When</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Action</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((entry) => (
                <tr key={entry._id} className="border-b border-gray-50 hover:bg-gray-25">
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(entry._creationTime)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono truncate max-w-[120px]">
                    {entry.userId}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold uppercase ${actionColor[entry.action] ?? "text-gray-600"}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{entry.resource}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 truncate max-w-[200px]">
                    {entry.details ?? "—"}
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                    No audit log entries found.
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
