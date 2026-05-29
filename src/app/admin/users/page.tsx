"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/dates";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminUsersPage() {
  const users = useQuery(api.users.getAllUsers);
  const updatePlan = useMutation(api.users.updateUserPlan);
  const suspendUser = useMutation(api.users.suspendUser);

  async function handlePlanChange(userId: Id<"users">, plan: "free" | "pro") {
    try {
      await updatePlan({ targetUserId: userId, plan });
      toast.success("Plan updated");
    } catch {
      toast.error("Failed to update plan");
    }
  }

  async function handleSuspend(userId: Id<"users">, suspended: boolean) {
    try {
      await suspendUser({ targetUserId: userId, suspended });
      toast.success(suspended ? "User suspended" : "User unsuspended");
    } catch {
      toast.error("Failed to update user");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Plan
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Joined
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-50 hover:bg-gray-25"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={user.plan}
                      onValueChange={(v) =>
                        handlePlanChange(user._id, v as "free" | "pro")
                      }
                    >
                      <SelectTrigger className="h-7 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.suspended ? "voided" : "paid"}>
                      {user.suspended ? "Suspended" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                      <Link href={`/admin/users/${user._id}`}>View</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        handleSuspend(user._id, !user.suspended)
                      }
                    >
                      {user.suspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
