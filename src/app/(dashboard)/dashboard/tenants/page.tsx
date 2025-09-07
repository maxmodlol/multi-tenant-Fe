"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTenants } from "@/src/hooks/dashboard/useTenants";
import { getApiPrivate } from "@/src/config/axiosPrivate";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import { toast } from "react-hot-toast";

export default function TenantManagementPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { data: tenants = [], refetch } = useTenants();
  const [subdomain, setSubdomain] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return <div className="p-6">غير مصرح</div>;
  }

  async function createTenant() {
    try {
      setSubmitting(true);
      const api = await getApiPrivate();
      await api.post("/tenants", { domain: subdomain });
      toast.success("تم إنشاء النطاق الفرعي");
      setSubdomain("");
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "فشل الإنشاء");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTenant(domain: string) {
    try {
      const api = await getApiPrivate();
      await api.delete(`/tenants/${encodeURIComponent(domain)}`);
      toast.success("تم الحذف");
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "فشل الحذف");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">إدارة المستأجرين</h1>
      </div>

      <div className="rounded-lg border border-border-secondary bg-background-secondary p-4 space-y-3">
        <div className="text-sm text-text-tertiary">إنشاء نطاق فرعي جديد</div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            className="w-64 bg-background-primary border-border-secondary"
          />
          <Button
            onClick={createTenant}
            disabled={isSubmitting || !subdomain.trim()}
            className="bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover"
          >
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء"}
          </Button>
          <span className="text-xs text-text-tertiary">(محجوز: api, www, admin, auth, main)</span>
        </div>
      </div>

      <div className="rounded-lg border border-border-secondary bg-background-secondary">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border-secondary bg-background-primary/40">
              <th className="px-4 py-2 text-right">#</th>
              <th className="px-4 py-2 text-right">Subdomain</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t, idx) => (
              <tr key={t.id} className={idx % 2 ? "bg-background-primary/20" : ""}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{t.domain}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-end">
                    <a
                      href={`/dashboard/blogs?tenant=${encodeURIComponent(t.domain)}`}
                      className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
                    >
                      View blogs
                    </a>
                    <a
                      href={`/dashboard/settings?tab=users&tenant=${encodeURIComponent(t.domain)}`}
                      className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
                    >
                      Manage users
                    </a>
                    <ConfirmDelete onConfirm={() => deleteTenant(t.domain)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
      >
        Delete
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-lg border border-border-secondary bg-background-secondary p-4">
            <div className="text-sm text-text-primary mb-2">تأكيد الحذف</div>
            <div className="text-xs text-text-tertiary mb-4">
              سيتم حذف المستأجر وجميع بياناته. هذا الإجراء لا يمكن التراجع عنه.
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="px-2 py-1 rounded-md bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover text-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
