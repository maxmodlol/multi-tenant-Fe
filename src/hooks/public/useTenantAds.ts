// hooks/public/useTenantAds.ts

import { useQuery } from "@tanstack/react-query";
import { tenantAdService } from "@/src/services/tenantAdService";
import type { TenantAdsByPlacement, PageType } from "@/src/types/tenantAds";

export function useTenantAds(
  pageType: PageType,
  placements?: string[],
  tenantId?: string,
  blogId?: string,
) {
  return useQuery({
    queryKey: ["tenant-ads", pageType, placements, tenantId, blogId],
    queryFn: () =>
      tenantAdService.getPublicTenantAdsForPage(pageType, placements, tenantId, blogId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!tenantId, // Only run query if tenantId is provided
  });
}

export function useTenantAdsByPlacement(
  pageType: PageType,
  placement: string,
  tenantId?: string,
  blogId?: string,
) {
  return useQuery({
    queryKey: ["tenant-ads", pageType, placement, tenantId, blogId],
    queryFn: () =>
      tenantAdService.getPublicTenantAdsForPage(pageType, [placement], tenantId, blogId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!tenantId, // Only run query if tenantId is provided
    select: (data: TenantAdsByPlacement) => data[placement] || [],
  });
}
