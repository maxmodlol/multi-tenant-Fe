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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="المستأجرون" value={metrics?.totalTenants ?? "—"} />
        <StatCard title="المستخدمون" value={metrics?.totalUsers ?? "—"} />
        <StatCard title="كل التدوينات" value={metrics?.totalBlogs ?? "—"} />
        <StatCard title="المنشورة" value={metrics?.acceptedBlogs ?? "—"} />
        <StatCard title="جاهزة للنشر" value={metrics?.readyToPublish ?? "—"} />
        <StatCard title="بانتظار إعادة الموافقة" value={metrics?.pendingReapproval ?? "—"} />
      </div>

      {/* Tenant Overview */}
      <div className="rounded-lg border border-border-secondary bg-background-secondary overflow-hidden">
        <div className="px-4 py-3 border-b border-border-secondary bg-background-primary/40">
          <h2 className="text-text-primary font-semibold text-sm">نظرة عامة حسب المستأجر</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border-secondary bg-background-primary/20">
                <th className="px-4 py-3 text-right text-text-primary font-medium">المستأجر</th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">المستخدمون</th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">المدونات</th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">المنشورة</th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">جاهزة</th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">
                  بانتظار الموافقة
                </th>
                <th className="px-4 py-3 text-right text-text-primary font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr
                  key={r.tenant}
                  className={`border-b border-border-secondary hover:bg-background-primary/20 transition-colors ${idx % 2 ? "bg-background-primary/5" : ""}`}
                >
                  <td className="px-4 py-3 text-text-primary font-medium">{r.tenant}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.users}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.blogsTotal}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.blogsAccepted}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.blogsReadyToPublish}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.blogsPendingReapproval}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <a
                        href={`/dashboard/blogs?tenant=${encodeURIComponent(r.tenant)}`}
                        className="px-3 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80 transition-colors text-center"
                      >
                        عرض المدونات
                      </a>
                      <a
                        href={`/dashboard/settings?tab=users&tenant=${encodeURIComponent(r.tenant)}`}
                        className="px-3 py-1 rounded-md border border-border-secondary text-xs text-text-secondary hover:text-text-primary hover:bg-background-secondary/80 transition-colors text-center"
                      >
                        إدارة المستخدمين
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border-secondary">
          {rows.map((r, idx) => (
            <div key={r.tenant} className="p-4 hover:bg-background-primary/20 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary">{r.tenant}</h3>
                  <div className="flex gap-2">
                    <a
                      href={`/dashboard/blogs?tenant=${encodeURIComponent(r.tenant)}`}
                      className="px-2 py-1 rounded text-xs bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                    >
                      المدونات
                    </a>
                    <a
                      href={`/dashboard/settings?tab=users&tenant=${encodeURIComponent(r.tenant)}`}
                      className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      المستخدمين
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">{r.users}</div>
                    <div className="text-xs text-text-tertiary">المستخدمون</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">{r.blogsTotal}</div>
                    <div className="text-xs text-text-tertiary">المدونات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">{r.blogsAccepted}</div>
                    <div className="text-xs text-text-tertiary">المنشورة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">
                      {r.blogsReadyToPublish}
                    </div>
                    <div className="text-xs text-text-tertiary">جاهزة</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border-secondary bg-background-secondary p-4 hover:bg-background-secondary/80 transition-colors">
      <div className="text-text-tertiary text-xs mb-2">{title}</div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
    </div>
  );
}
