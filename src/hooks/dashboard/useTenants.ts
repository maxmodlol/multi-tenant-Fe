import { useQuery } from "@tanstack/react-query";
import { getApiPrivate } from "../../config/axiosPrivate"; // ← change

/* ─────────────────────── Types ──────────────────────── */

export interface TenantDTO {
  id: string;
  domain: string;
}

/* ─────────────────────── Fetcher ─────────────────────── */

async function fetchTenants(): Promise<TenantDTO[]> {
  const api = await getApiPrivate(); // ← builds instance
  const { data } = await api.get<{ tenants: TenantDTO[] }>("/tenants");
  return data.tenants;
}

/* ─────────────────── React-Query hook ────────────────── */

export function useTenants() {
  return useQuery<TenantDTO[], Error>({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
  });
}
