"use client";

import { useSession } from "next-auth/react";
import { useMemo, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useDashboardBlogs } from "@/src/hooks/dashboard/useDashboardBlogs";
import { fetchTimeseries, TimeseriesPointDTO } from "@/src/services/adminMetrics";
import PieChart from "./PieChart";
import ChartJSLine from "./ChartJSLine";
import ChartJSBar from "./ChartJSBar";
import { useTenants } from "@/src/hooks/dashboard/useTenants";

enum BlogStatus {
  ACCEPTED = "ACCEPTED",
  READY_TO_PUBLISH = "READY_TO_PUBLISH",
  PENDING_REAPPROVAL = "PENDING_REAPPROVAL",
  DRAFTED = "DRAFTED",
  DECLINED = "DECLINED",
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const tenant = session?.user?.tenant || "main";
  const isAdmin = role === "ADMIN";
  const { data: tenants = [] } = useTenants();

  // Admin uses tenant="all"; publisher uses their own; editor restricted.
  const [selectedTenant, setSelectedTenant] = useState<string>(isAdmin ? "all" : tenant);
  const scopedTenant = isAdmin ? selectedTenant : role === "PUBLISHER" ? tenant : undefined;

  // Load a large page to aggregate counts client-side for now
  const { data } = useDashboardBlogs({ tenant: scopedTenant, page: 1, limit: 200 });
  const counts = useMemo(() => {
    const list = data?.blogs ?? [];
    const total = list.length;
    const accepted = list.filter((b) => b.status === BlogStatus.ACCEPTED).length;
    const ready = list.filter((b) => b.status === BlogStatus.READY_TO_PUBLISH).length;
    const pending = list.filter((b) => b.status === BlogStatus.PENDING_REAPPROVAL).length;
    const drafted = list.filter((b) => b.status === BlogStatus.DRAFTED).length;
    const declined = list.filter((b) => b.status === BlogStatus.DECLINED).length;
    return { total, accepted, ready, pending, drafted, declined };
  }, [data]);

  if (role === "EDITOR") return <div className="p-6">غير مصرح</div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat title="إجمالي" value={counts.total ?? "—"} />
        <Stat title="منشورة" value={counts.accepted ?? "—"} />
        <Stat title="جاهزة للنشر" value={counts.ready ?? "—"} />
        <Stat title="بانتظار إعادة الموافقة" value={counts.pending ?? "—"} />
        <Stat title="مسودة" value={counts.drafted ?? "—"} />
        <Stat title="مرفوضة" value={counts.declined ?? "—"} />
      </div>

      <ControlsAndCharts
        tenant={scopedTenant}
        controls={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-tertiary">المستأجر</label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="rounded-md border border-border-secondary bg-background-primary px-2 py-1 text-xs"
              >
                <option value="all">الكل</option>
                {tenants.map((t: any) => (
                  <option key={t.domain} value={t.domain}>
                    {t.domain}
                  </option>
                ))}
              </select>
            </div>
          ) : null
        }
      />
      <Donut counts={counts} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border-secondary bg-background-secondary p-3 sm:p-4 hover:bg-background-secondary/80 transition-colors">
      <div className="text-xs text-text-tertiary mb-1">{title}</div>
      <div className="text-xl sm:text-2xl font-bold text-text-primary">{value}</div>
    </div>
  );
}

function Donut({
  counts,
}: {
  counts: {
    total: number;
    accepted: number;
    ready: number;
    pending: number;
    drafted: number;
    declined: number;
  };
}) {
  const data = [
    { label: "منشورة", value: counts.accepted || 0, color: "hsl(var(--success-500))" },
    { label: "جاهزة", value: counts.ready || 0, color: "hsl(var(--brand-600))" },
    { label: "بانتظار", value: counts.pending || 0, color: "hsl(var(--warning-500))" },
    { label: "مسودة", value: counts.drafted || 0, color: "hsl(var(--gray-500))" },
    { label: "مرفوضة", value: counts.declined || 0, color: "hsl(var(--error-500))" },
  ];
  return (
    <div className="rounded-lg border border-border-secondary bg-background-secondary p-4">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <PieChart data={data} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs text-text-tertiary flex-1">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="truncate">
                {d.label}: <span className="text-text-primary font-medium">{d.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlsAndCharts({ tenant, controls }: { tenant?: string; controls?: ReactNode }) {
  const [points, setPoints] = useState<TimeseriesPointDTO[]>([]);
  const [range, setRange] = useState<string>("30");
  const [show, setShow] = useState({
    accepted: true,
    ready: true,
    pending: true,
    drafted: false,
    declined: false,
  });
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  useEffect(() => {
    const d = range === "all" ? ("all" as any) : parseInt(range, 10);
    fetchTimeseries(tenant === "all" ? undefined : tenant, d)
      .then(setPoints)
      .catch(() => setPoints([]));
  }, [tenant, range]);

  const series = {
    accepted: "hsl(var(--success-500))",
    ready: "hsl(var(--brand-600))",
    pending: "hsl(var(--warning-500))",
    drafted: "hsl(var(--gray-500))",
    declined: "hsl(var(--error-500))",
  } as const;

  // chart.js variant no longer needs manual path calculations

  return (
    <div className="rounded-lg border border-border-secondary bg-background-secondary p-4 overflow-auto space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-text-primary font-medium text-sm">تطور الحالات</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-md border border-border-secondary bg-background-primary px-3 py-2 text-sm focus:border-brand-500 transition-colors w-full sm:w-auto"
          >
            <option value="7">آخر 7 أيام</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 90 يوم</option>
            <option value="all">كل الأيام</option>
          </select>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["accepted", "ready", "pending", "drafted", "declined"] as const).map((k) => (
              <label
                key={k}
                className="inline-flex items-center gap-2 px-2 py-1 rounded border border-border-secondary hover:bg-background-secondary/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={show[k]}
                  onChange={(e) => setShow((s) => ({ ...s, [k]: e.target.checked }))}
                  className="rounded"
                />
                <span className="capitalize text-text-secondary">{k}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-background-primary rounded-md p-3">
        <ChartJSLine
          labels={points.map((p) => p.day)}
          series={(["accepted", "ready", "pending", "drafted", "declined"] as const)
            .filter((k) => show[k])
            .map((k) => ({ label: k, data: points.map((p) => p[k]), color: series[k] }))}
          stacked
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-tertiary">
        {show.accepted && <Legend color={series.accepted} label="منشورة" />}
        {show.ready && <Legend color={series.ready} label="جاهزة" />}
        {show.pending && <Legend color={series.pending} label="بانتظار" />}
        {show.drafted && <Legend color={series.drafted} label="مسودة" />}
        {show.declined && <Legend color={series.declined} label="مرفوضة" />}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
