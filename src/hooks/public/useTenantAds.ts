// hooks/public/useTenantAds.ts

import { useQuery } from "@tanstack/react-query";
import { tenantAdService } from "@/src/services/tenantAdService";
import type { TenantAdsByPlacement, PageType } from "@/src/types/tenantAds";

export function useTenantAds(pageType: PageType, placements?: string[], tenantId?: string) {
  return useQuery({
    queryKey: ["tenant-ads", pageType, placements, tenantId],
    queryFn: () => tenantAdService.getPublicTenantAdsForPage(pageType, placements, tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!tenantId, // Only run query if tenantId is provided
  });
}

export function useTenantAdsByPlacement(pageType: PageType, placement: string, tenantId?: string) {
  return useQuery({
    queryKey: ["tenant-ads", pageType, placement, tenantId],
    queryFn: () => tenantAdService.getPublicTenantAdsForPage(pageType, [placement], tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!tenantId, // Only run query if tenantId is provided
    select: (data: TenantAdsByPlacement) => data[placement] || [],
  });
}
