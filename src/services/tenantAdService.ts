// services/tenantAdService.ts

import { getApiPrivate } from "@/src/config/axiosPrivate";
import { getApiPublic } from "@/src/config/axiosPublic";
import type {
  TenantAdSetting,
  CreateTenantAdInput,
  UpdateTenantAdInput,
  TenantAdsByPlacement,
  PageType,
} from "@/src/types/tenantAds";

const API_BASE = "/settings/tenant-ads";

export const tenantAdService = {
  /**
   * Create a new tenant ad
   */
  async createTenantAd(input: CreateTenantAdInput): Promise<TenantAdSetting> {
    const apiPrivate = await getApiPrivate();
    const response = await apiPrivate.post(API_BASE, input);
    return response.data;
  },

  /**
   * Get all tenant ads for the current tenant
   */
  async getTenantAds(): Promise<TenantAdSetting[]> {
    try {
      const apiPrivate = await getApiPrivate();
      const response = await apiPrivate.get(API_BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific tenant ad by ID
   */
  async getTenantAdById(id: string): Promise<TenantAdSetting> {
    const apiPrivate = await getApiPrivate();
    const response = await apiPrivate.get(`${API_BASE}/${id}`);
    return response.data;
  },

  /**
   * Update an existing tenant ad
   */
  async updateTenantAd(input: UpdateTenantAdInput): Promise<TenantAdSetting> {
    const apiPrivate = await getApiPrivate();
    const response = await apiPrivate.put(`${API_BASE}/${input.id}`, input);
    return response.data;
  },

  /**
   * Delete a tenant ad
   */
  async deleteTenantAd(id: string): Promise<void> {
    const apiPrivate = await getApiPrivate();
    await apiPrivate.delete(`${API_BASE}/${id}`);
  },

  /**
   * Get tenant ads for a specific page type
   */
  async getTenantAdsForPage(
    pageType: PageType,
    placements?: string[],
  ): Promise<TenantAdsByPlacement> {
    const apiPrivate = await getApiPrivate();
    const params = new URLSearchParams();
    params.append("pageType", pageType);

    if (placements && placements.length > 0) {
      params.append("placements", placements.join(","));
    }

    const response = await apiPrivate.get(`${API_BASE}/page/${pageType}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get tenant ads for public pages (no auth required)
   */
  async getPublicTenantAdsForPage(
    pageType: PageType,
    placements?: string[],
    tenantId?: string,
  ): Promise<TenantAdsByPlacement> {
    const apiPublic = await getApiPublic();
    const params = new URLSearchParams();
    params.append("pageType", pageType);

    if (placements && placements.length > 0) {
      params.append("placements", placements.join(","));
    }

    if (tenantId) {
      params.append("tenantId", tenantId);
    }

    // Use the new public endpoint
    const response = await apiPublic.get(
      `${API_BASE}/public/page/${pageType}?${params.toString()}`,
    );
    return response.data;
  },
};
