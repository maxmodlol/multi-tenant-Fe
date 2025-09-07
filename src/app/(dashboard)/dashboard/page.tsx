"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  fetchAdminMetrics,
  type AdminMetricsDTO,
  fetchPerTenantMetrics,
  type PerTenantMetricsDTO,
} from "@/src/services/adminMetrics";
import { redirect } from "next/navigation";

export default function DashboardHome() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [metrics, setMetrics] = useState<AdminMetricsDTO | null>(null);
  const [rows, setRows] = useState<PerTenantMetricsDTO[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminMetrics()
        .then(setMetrics)
        .catch(() => setMetrics(null));
      fetchPerTenantMetrics()
        .then(setRows)
        .catch(() => setRows([]));
    }
  }, [isAdmin]);

  if (!isAdmin) {
    redirect("/dashboard/settings");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="المستأجرون" value={metrics?.totalTenants ?? "—"} />
        <StatCard title="المستخدمون" value={metrics?.totalUsers ?? "—"} />
        <StatCard title="كل التدوينات" value={metrics?.totalBlogs ?? "—"} />
        <StatCard title="المنشورة" value={metrics?.acceptedBlogs ?? "—"} />
        <StatCard title="جاهزة للنشر" value={metrics?.readyToPublish ?? "—"} />
        <StatCard title="بانتظار إعادة الموافقة" value={metrics?.pendingReapproval ?? "—"} />
      </div>
      <div className="rounded-lg border border-border-secondary bg-background-secondary">
        <div className="px-4 py-3 border-b border-border-secondary text-text-secondary text-sm">
          نظرة عامة حسب المستأجر
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border-secondary bg-background-primary/40">
                <th className="px-4 py-2 text-right">Tenant</th>
                <th className="px-4 py-2 text-right">Users</th>
                <th className="px-4 py-2 text-right">Blogs</th>
                <th className="px-4 py-2 text-right">Accepted</th>
                <th className="px-4 py-2 text-right">Ready</th>
                <th className="px-4 py-2 text-right">Pending re-approval</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.tenant} className={idx % 2 ? "bg-background-primary/20" : ""}>
                  <td className="px-4 py-2">{r.tenant}</td>
                  <td className="px-4 py-2">{r.users}</td>
                  <td className="px-4 py-2">{r.blogsTotal}</td>
                  <td className="px-4 py-2">{r.blogsAccepted}</td>
                  <td className="px-4 py-2">{r.blogsReadyToPublish}</td>
                  <td className="px-4 py-2">{r.blogsPendingReapproval}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-end">
                      <a
                        href={`/dashboard/blogs?tenant=${encodeURIComponent(r.tenant)}`}
                        className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
                      >
                        View blogs
                      </a>
                      <a
                        href={`/dashboard/settings?tab=users&tenant=${encodeURIComponent(r.tenant)}`}
                        className="px-2 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
                      >
                        Manage users
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border-secondary bg-background-secondary p-4">
      <div className="text-text-tertiary text-xs mb-1">{title}</div>
      <div className="text-2xl font-semibold text-text-primary">{value}</div>
    </div>
  );
}
