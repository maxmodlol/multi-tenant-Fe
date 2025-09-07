import { getApiPrivate } from "@/src/config/axiosPrivate";

export interface AdminMetricsDTO {
  totalTenants: number;
  totalUsers: number;
  totalBlogs: number;
  acceptedBlogs: number;
  pendingReapproval: number;
  readyToPublish: number;
}

export async function fetchAdminMetrics(): Promise<AdminMetricsDTO> {
  const api = await getApiPrivate();
  const { data } = await api.get<AdminMetricsDTO>("/dashboard/blogs/metrics/admin");
  return data;
}

export interface PerTenantMetricsDTO {
  tenant: string;
  users: number;
  blogsTotal: number;
  blogsAccepted: number;
  blogsPendingReapproval: number;
  blogsReadyToPublish: number;
}

export async function fetchPerTenantMetrics(): Promise<PerTenantMetricsDTO[]> {
  const api = await getApiPrivate();
  const { data } = await api.get<{ tenants: PerTenantMetricsDTO[] }>(
    "/dashboard/blogs/metrics/admin/tenants",
  );
  return data.tenants;
}

export interface TimeseriesPointDTO {
  day: string;
  accepted: number;
  ready: number;
  pending: number;
  drafted: number;
  declined: number;
}

export async function fetchTimeseries(tenant?: string, days = 30): Promise<TimeseriesPointDTO[]> {
  const api = await getApiPrivate();
  const { data } = await api.get<{ points: TimeseriesPointDTO[] }>(
    "/dashboard/blogs/metrics/timeseries",
    { params: { tenant, days } },
  );
  return data.points;
}
