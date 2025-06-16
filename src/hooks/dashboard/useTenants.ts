import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "../../config/axiosPrivate";
import { createHttpHelpers } from "../../config/helpers";

export interface TenantDTO {
  id: string;
  domain: string;
}
const { GetApi: GetPrivate } = createHttpHelpers(apiPrivate);

async function fetchTenants(): Promise<TenantDTO[]> {
  const data = await GetPrivate<{ tenants: TenantDTO[] }>("/api/tenants");
  return data.tenants;
}

export function useTenants() {
  return useQuery<TenantDTO[], Error>({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
  });
}
