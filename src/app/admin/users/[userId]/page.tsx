"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const detail = useQuery(api.admin.getUserDetail, { userId: userId as Id<"users"> });

  if (!detail) return <p className="text-sm text-gray-400">Loading...</p>;

  const { user, invoices, clients } = detail;

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to users
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{user.name ?? "Unnamed"}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.plan === "pro" ? "paid" : "draft"}>{user.plan}</Badge>
          {user.suspended && <Badge variant="voided">Suspended</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Invoices</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{invoices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Clients</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Joined</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{formatDate(user.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 10).map((inv) => (
                <tr key={inv._id} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-sm font-mono text-gray-700">{inv.invoiceNumber}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{inv.clientSnapshot.fullName}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={inv.status as "paid" | "draft" | "voided" | "overdue" | "sent"}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-right text-gray-800">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                    No invoices yet.
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
