"use client";

import { useQuery } from "@tanstack/react-query";
import { getApiPrivate } from "@/src/config/axiosPrivate";

export interface TenantDTO {
  id: string | number;
  domain: string;
}

async function fetchTenants(): Promise<TenantDTO[]> {
  const api = await getApiPrivate();
  const { data } = await api.get<{ tenants: TenantDTO[] }>("/tenants");
  return data.tenants;
}

export function useTenants() {
  return useQuery<TenantDTO[], Error>({ queryKey: ["tenants"], queryFn: fetchTenants });
}
