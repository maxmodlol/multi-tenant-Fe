// app/(dashboard)/settings/UsersAndTeamsForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@explore/components/ui/button";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import {
  useMembers,
  useDeleteMember,
  useCreateMember,
  useUpdateMember,
} from "@/src/hooks/dashboard/useUsers";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@explore/components/ui/dialog";
import { useSession } from "next-auth/react";
import type { Role } from "../settings/settings-config";
import { toast } from "react-hot-toast";
import { AddMemberModal } from "../../_components/AddMemberModal";
import { Select } from "@/src/components/ui/select";
import { useTenants } from "@/src/hooks/dashboard/useTenants";

export default function UsersAndTeamsForm() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const currentTenant = session?.user?.tenant ?? "main";

  // Admin can filter by tenant; default "all". Publishers/editors locked to their tenant.
  // Seed from URL ?tenant=slug to deep-link from admin dashboard quick actions
  const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
  const seedTenant = url?.searchParams.get("tenant") || undefined;
  const [tenantFilter, setTenantFilter] = useState<string>(
    isAdmin ? seedTenant || "all" : currentTenant,
  );

  const { data: tenants = [] } = useTenants();
  const {
    data: members = [],
    isLoading,
    refetch,
  } = useMembers({
    tenant: isAdmin ? (tenantFilter === "all" ? "all" : tenantFilter) : undefined,
  });
  const deleteMember = useDeleteMember();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const [isAddOpen, setAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<null | (typeof members)[0]>(null);
  const [deletingMember, setDeletingMember] = useState<null | (typeof members)[0]>(null);

  const handleSave = async (input: Parameters<typeof createMember.mutateAsync>[0]) => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, ...input });
        toast.success("Member updated");
      } else {
        await createMember.mutateAsync(input);
        toast.success("New member added");
      }
      setAddOpen(false);
      setEditingMember(null);
      refetch();
    } catch (err: any) {
      toast.error("Operation failed: " + (err?.message ?? ""));
    }
  };

  const confirmDelete = () => {
    if (!deletingMember) return;
    deleteMember.mutate(deletingMember.id, {
      onSuccess: () => {
        toast.success("Member deleted");
        setDeletingMember(null);
        refetch();
      },
      onError: (err: any) => {
        toast.error("Delete failed: " + (err?.message ?? ""));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 bg-background-secondary/60 border border-border-secondary rounded-lg p-3">
        {isAdmin && (
          <Select
            value={tenantFilter}
            onChange={(v) => {
              setTenantFilter(v);
              refetch();
            }}
            className="w-64"
          >
            <Select.Item value="all">All tenants</Select.Item>
            {tenants.map((t) => (
              <Select.Item key={t.domain} value={t.domain}>
                {t.domain}
              </Select.Item>
            ))}
          </Select>
        )}

        {session?.user?.role !== "EDITOR" && (
          <Button
            onClick={() => {
              setEditingMember(null);
              setAddOpen(true);
            }}
            variant="primary"
            size="sm"
          >
            + Add team member
          </Button>
        )}
      </div>

      <AddMemberModal
        open={isAddOpen}
        onOpenChange={setAddOpen}
        currentDomain={currentTenant}
        isMainAdmin={isAdmin}
        onCreate={handleSave}
        initialData={
          editingMember
            ? {
                name: editingMember.name,
                email: editingMember.email,
                password: "",
                role: editingMember.role as Role,
                domain: editingMember.tenant,
              }
            : undefined
        }
      />

      {/* Delete confirmation */}
      <Dialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle>Delete team member</DialogTitle>
            </div>
          </DialogHeader>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deletingMember?.name}</strong>? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingMember(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members table */}
      <div className="rounded-xl border border-border-secondary bg-background-secondary shadow-custom-1">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border-secondary bg-background-primary/40">
              <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary">Name</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary">
                Email
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary">
                Date added
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary">
                Tenant
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-text-tertiary" />
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-text-tertiary">
                  No team members yet.
                </td>
              </tr>
            ) : (
              members.map((m, idx) => (
                <tr key={m.id} className={idx % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          {m.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(m.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {m.tenant ?? m.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center space-x-4">
                      <Edit2
                        size={18}
                        className="text-text-tertiary hover:text-text-primary cursor-pointer"
                        onClick={() => {
                          setEditingMember(m);
                          setAddOpen(true);
                        }}
                      />
                      <Trash2
                        size={18}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={() => setDeletingMember(m)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
