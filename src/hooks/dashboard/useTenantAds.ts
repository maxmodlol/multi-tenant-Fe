// hooks/dashboard/useTenantAds.ts

import { useQuery } from "@tanstack/react-query";
import { TenantAdSetting } from "@/src/types/tenantAds";
import { tenantAdService } from "@/src/services/tenantAdService";
import { TenantAdPlacement, TenantAdAppearance } from "@/src/types/tenantAds";

/**
 * Fetches all tenant ads for the current tenant context
 */
export function useTenantAds() {
  return useQuery<TenantAdSetting[], Error>({
    queryKey: ["tenantAds"],
    queryFn: async () => {
      try {
        const result = await tenantAdService.getTenantAds();
        return result;
      } catch (error) {
        console.error("❌ useTenantAds: API call failed:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetches a specific tenant ad by ID
 */
export function useTenantAdById(id: string) {
  return useQuery<TenantAdSetting, Error>({
    queryKey: ["tenantAds", id],
    queryFn: async () => {
      try {
        const result = await tenantAdService.getTenantAdById(id);
        return result;
      } catch (error) {
        console.error("❌ useTenantAdById: API call failed:", error);
        throw error;
      }
    },
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}
