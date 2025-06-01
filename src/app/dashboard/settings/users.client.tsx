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
} from "@explore/lib/useUsers";
import { AddMemberModal } from "../_components/AddMemberModal";
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

export default function UsersAndTeamsForm() {
  const { data: members = [], isLoading, refetch } = useMembers();
  const { data: session } = useSession();
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

      <AddMemberModal
        open={isAddOpen}
        onOpenChange={setAddOpen}
        currentDomain={session?.user?.tenant ?? "main"}
        isMainAdmin={session?.user?.role === "ADMIN"}
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
      <div className="bg-white rounded-xl shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Date added</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center space-x-4">
                      <Edit2
                        size={18}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
