// hooks/dashboard/useTenantAds.ts

import { useQuery } from "@tanstack/react-query";
import { TenantAdSetting } from "@/src/types/tenantAds";
import { tenantAdService } from "@/src/services/tenantAdService";
import { TenantAdPlacement, TenantAdAppearance } from "@/src/types/tenantAds";

/**
 * Fetches all tenant ads for the current tenant context
 */
export function useTenantAds() {
  console.log("🔍 useTenantAds: Hook called!");

  return useQuery<TenantAdSetting[], Error>({
    queryKey: ["tenantAds"],
    queryFn: async () => {
      console.log("🔍 useTenantAds: Starting API call...");

      try {
        const result = await tenantAdService.getTenantAds();
        console.log("✅ useTenantAds: API call successful:", result);
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
      console.log("🔍 useTenantAdById: Starting API call for ID:", id);
      try {
        const result = await tenantAdService.getTenantAdById(id);
        console.log("✅ useTenantAdById: API call successful:", result);
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
