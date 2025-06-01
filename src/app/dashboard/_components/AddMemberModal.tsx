// app/(dashboard)/settings/_components/AddMemberModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@explore/components/ui/dialog";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import { Select } from "@explore/components/ui/select";
import type { Role } from "../settings/settings-config";
import { useTenants, TenantDTO } from "@explore/lib/useTenants";

interface MemberInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  domain?: string;
}

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDomain: string;
  isMainAdmin: boolean;
  onCreate: (input: MemberInput) => Promise<void>;
  initialData?: Partial<MemberInput>;
}

export function AddMemberModal({
  open,
  onOpenChange,
  currentDomain,
  isMainAdmin,
  onCreate,
  initialData = {},
}: AddMemberModalProps) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [password, setPassword] = useState(initialData.password || "");
  const [role, setRole] = useState<Role>(initialData.role || "EDITOR");
  const [domain, setDomain] = useState(initialData.domain || currentDomain);

  // fetch existing tenants for Editor role
  const { data: tenants = [], isLoading: tenantsLoading } = useTenants();

  useEffect(() => {
    if (!open) return;
    // When the modal first opens, initialize from props:
    setName(initialData.name ?? "");
    setEmail(initialData.email ?? "");
    setPassword(initialData.password ?? "");
    setRole(initialData.role ?? "EDITOR");
    setDomain(initialData.domain ?? currentDomain);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onCreate({ name, email, password, role, domain });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{initialData.name ? "Edit team member" : "Add new team member"}</DialogTitle>
      </DialogHeader>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              minLength={8}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters.</p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <Select value={role} onChange={(val) => setRole(val as Role)} className="w-full">
              <Select.Item value="PUBLISHER">Publisher</Select.Item>
              <Select.Item value="EDITOR">Editor</Select.Item>
            </Select>
          </div>

          {/* Domain / Tenant Selector */}
          {role === "PUBLISHER" ? (
            <div>
              <label className="block text-sm font-medium">Sub-domain</label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter new sub-domain"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">Tenant (sub-domain)</label>
              <Select
                value={domain}
                onChange={(val) => setDomain(val as string)}
                className="w-full"
              >
                {tenants.map((t: TenantDTO) => (
                  <Select.Item key={t.id} value={t.domain}>
                    {t.domain}
                  </Select.Item>
                ))}
              </Select>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              {initialData.name ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
