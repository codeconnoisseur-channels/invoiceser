"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export default function AdminStatsPage() {
  const stats = useQuery(api.admin.getPlatformStats);

  if (!stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Stats</h1>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Pro Users", value: stats.proUsers },
    { label: "Free Users", value: stats.freeUsers },
    { label: "Total Invoices", value: stats.totalInvoices },
    { label: "Paid Invoices", value: stats.paidInvoices },
    { label: "Total Clients", value: stats.totalClients },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Stats</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{c.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (All Users)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(stats.totalRevenue, "USD")}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total payments recorded across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{stats.openTickets}</p>
            <p className="text-xs text-gray-400 mt-1">Tickets awaiting admin response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
