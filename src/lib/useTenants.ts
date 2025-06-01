// src/lib/useTenants.ts
import { useQuery } from "@tanstack/react-query";
import { GetApi } from "@explore/config/axios";

export interface TenantDTO {
  id: string;
  domain: string;
}

async function fetchTenants(): Promise<TenantDTO[]> {
  const data = await GetApi<{ tenants: TenantDTO[] }>("/api/tenants");
  return data.tenants;
}

export function useTenants() {
  return useQuery<TenantDTO[], Error>({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
  });
}
