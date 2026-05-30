"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import {
  Users, Plus, Pencil, Trash2, Search, FileText,
  Copy, Check, Mail, Building2, User,
  MapPin, Globe, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { PhoneInput } from "@/components/phone-input";

type ClientType = "individual" | "business";

interface ClientFormState {
  clientType: ClientType;
  fullName: string;
  email: string;
  companyName: string;
  address: string;
  phone: string;
  website: string;
}

const AVATAR_COLORS = [
  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  function copy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={copy}
      className="group/copy inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      title="Copy email"
    >
      <Mail className="w-3 h-3 shrink-0 text-gray-400 dark:text-gray-500" />
      <span className="truncate">{email}</span>
      {copied
        ? <Check className="w-3 h-3 text-emerald-500 shrink-0" />
        : <Copy className="w-3 h-3 shrink-0 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
      }
    </button>
  );
}

type Client = {
  _id: Id<"clients">;
  fullName: string;
  email: string;
  companyName?: string;
  clientType?: "individual" | "business";
  address?: string;
  phone?: string;
  website?: string;
  deletedAt?: number;
};

function isBusiness(c: Client) {
  return c.clientType === "business" || (c.clientType === undefined && !!c.companyName);
}

function primaryName(c: Client) {
  return isBusiness(c) ? (c.companyName ?? c.fullName) : c.fullName;
}

function contactName(c: Client) {
  return isBusiness(c) && c.companyName ? c.fullName : undefined;
}

export default function ClientsPage() {
  const router       = useRouter();
  const clients      = useQuery(api.clients.listClients);
  const createClient = useMutation(api.clients.createClient);
  const updateClient = useMutation(api.clients.updateClient);
  const deleteClient = useMutation(api.clients.deleteClient);

  const [search,        setSearch]        = useState("");
  const [formOpen,      setFormOpen]      = useState(false);
  const [editingId,     setEditingId]     = useState<Id<"clients"> | null>(null);
  const [form,          setForm]          = useState<ClientFormState>({
    clientType: "individual", fullName: "", email: "", companyName: "", address: "", phone: "", website: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"clients"> | null>(null);
  const [saving,        setSaving]        = useState(false);

  const active   = (clients as Client[] | undefined)?.filter((c) => !c.deletedAt) ?? [];
  const filtered = active.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.companyName ?? "").toLowerCase().includes(q);
  });

  function openCreate() {
    setEditingId(null);
    setForm({ clientType: "individual", fullName: "", email: "", companyName: "", address: "", phone: "", website: "" });
    setFormOpen(true);
  }
  function openEdit(id: Id<"clients">) {
    const c = active.find((x) => x._id === id);
    if (!c) return;
    setEditingId(id);
    const type: ClientType = c.clientType ?? (c.companyName ? "business" : "individual");
    setForm({
      clientType: type,
      fullName: c.fullName,
      email: c.email,
      companyName: c.companyName ?? "",
      address: c.address ?? "",
      phone: c.phone ?? "",
      website: c.website ?? "",
    });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.fullName || !form.email) { toast.error("Name and email are required"); return; }
    if (form.clientType === "business" && !form.companyName) { toast.error("Business name is required"); return; }
    try {
      setSaving(true);
      if (form.website && !form.website.startsWith("https://")) {
        toast.error("Website URL must start with https://");
        setSaving(false);
        return;
      }
      const args = {
        fullName: form.fullName,
        email: form.email,
        companyName: form.clientType === "business" ? (form.companyName || undefined) : undefined,
        clientType: form.clientType,
        address: form.address || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
      };
      if (editingId) {
        await updateClient({ clientId: editingId, ...args });
        toast.success("Client updated");
      } else {
        await createClient(args);
        toast.success("Client added");
      }
      setFormOpen(false);
    } catch {
      toast.error("Failed to save client");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: Id<"clients">) {
    try { await deleteClient({ clientId: id }); setDeleteConfirm(null); toast.success("Client deleted"); }
    catch { toast.error("Failed to delete client"); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {active.length > 0 ? `${active.length} client${active.length !== 1 ? "s" : ""}` : "Manage your client list"}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add Client</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Search clients…"
          className="pl-9 h-9 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {clients === undefined ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
            <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{search ? `No results for "${search}"` : "No clients yet"}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">{search ? "Try a different search" : "Add your first client to start invoicing"}</p>
          {!search && <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" />Add a client</Button>}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((c) => {
            const business = isBusiness(c);
            const primary  = primaryName(c);
            const contact  = contactName(c);
            const avatarLetter = primary.charAt(0).toUpperCase();

            return (
              <div key={c._id} className="flex sm:grid sm:grid-cols-[auto_1fr_1fr_auto] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group">
                {/* Avatar — click to see this client's invoices */}
                <button
                  onClick={() => router.push(`/invoices?clientId=${c._id}`)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 cursor-pointer hover:opacity-80 transition-opacity ${avatarColor(primary)}`}
                  title="View invoices"
                >
                  {business
                    ? <Building2 className="w-4 h-4" />
                    : <span className="text-sm font-extrabold">{avatarLetter}</span>
                  }
                </button>

                {/* Primary name — click to see this client's invoices */}
                <button onClick={() => router.push(`/invoices?clientId=${c._id}`)} className="min-w-0 text-left cursor-pointer group/name">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover/name:text-blue-600 dark:group-hover/name:text-blue-400 transition-colors">{primary}</p>
                  {contact && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{contact}</p>
                  )}
                  {c.address && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />{c.address}
                    </p>
                  )}
                  {c.website && (
                    <span className="flex items-center gap-1 text-xs text-blue-500 truncate mt-0.5">
                      <Globe className="w-3 h-3 shrink-0" />{c.website.replace("https://", "")}
                    </span>
                  )}
                </button>

                {/* Email + Phone — hidden on smallest screens, shown on sm+ */}
                <div className="hidden sm:block min-w-0 space-y-1">
                  <CopyEmail email={c.email} />
                  {c.phone && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 truncate">
                      <Phone className="w-3 h-3 shrink-0" />{c.phone}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    asChild
                  >
                    <Link href={`/invoices/new?clientId=${c._id}`}>
                      <FileText className="w-3 h-3" />New Invoice
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => openEdit(c._id)}
                    title="Edit client"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    onClick={() => setDeleteConfirm(c._id)}
                    title="Delete client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-4 space-y-4">

            {/* Type toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 gap-0.5">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-md transition-all ${
                  form.clientType === "individual"
                    ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => setForm((p) => ({ ...p, clientType: "individual", companyName: "", address: "" }))}
              >
                <User className="w-3.5 h-3.5" /> Individual
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-md transition-all ${
                  form.clientType === "business"
                    ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => setForm((p) => ({ ...p, clientType: "business" }))}
              >
                <Building2 className="w-3.5 h-3.5" /> Business
              </button>
            </div>

            {form.clientType === "individual" ? (
              <div>
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Full Name *</Label>
                <Input className="mt-1.5" placeholder="" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Business Name *</Label>
                  <Input className="mt-1.5" placeholder="" value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Contact Person *</Label>
                  <Input className="mt-1.5" placeholder="" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Business Address <span className="font-normal normal-case text-gray-400">(optional)</span>
                  </Label>
                  <Input className="mt-1.5" placeholder="" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
              </>
            )}

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email *</Label>
              <Input className="mt-1.5" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Phone</Label>
              <div className="mt-1.5">
                <PhoneInput value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Website <span className="font-normal normal-case text-gray-400">(optional)</span>
              </Label>
              <Input
                className="mt-1.5"
                type="url"
                placeholder="https://..."
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              />
              {form.website && !form.website.startsWith("https://") && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Must start with https://</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{editingId ? "Save Changes" : "Add Client"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete client?</DialogTitle></DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">This client will be removed. Existing invoices are not affected.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
