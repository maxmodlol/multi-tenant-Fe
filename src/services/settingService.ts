/* ─────────────────────── PUBLIC (no JWT) ─────────────────────── */

import { getApiPrivate } from "../config/axiosPrivate";
import { getApiPublic } from "../config/axiosPublic";
import { SiteSetting } from "../types/siteSetting";

/**
 * GET current tenant’s site settings (logos + palette).
 */
export async function fetchSiteSetting(tenant?: string): Promise<SiteSetting> {
  const apiPublic = await getApiPublic(tenant);

  const { data } = await apiPublic.get<SiteSetting>("/settings/site");
  return data;
}

/* ──────────────────── DASHBOARD-ONLY (needs JWT) ────────────────── */

/**
 * PUT updated site settings.
 */
export async function updateSiteSetting(dto: SiteSetting): Promise<SiteSetting> {
  const apiPrivate = await getApiPrivate(); // ✅

  const { data } = await apiPrivate.put<SiteSetting>("/settings/site", dto);
  return data;
}

/**
 * Upload one logo file (multipart).
 * Returns the S3 URL.
 */
export async function uploadLogo(file: File): Promise<string> {
  const apiPrivate = await getApiPrivate(); // ✅

  const form = new FormData();
  form.append("file", file);

  const { data } = await apiPrivate.post<{ url: string }>("/settings/uploadLogo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.url;
}
