/* ─────────────────────── PUBLIC (no JWT) ─────────────────────── */

import { apiPrivate } from "../config/axiosPrivate";
import { apiPublic } from "../config/axiosPublic";
import { SiteSetting } from "../types/siteSetting";

/**
 * GET current tenant’s site settings (logos + palette).
 */
export async function fetchSiteSetting(): Promise<SiteSetting> {
  const { data } = await apiPublic.get<SiteSetting>("/api/settings/site");
  return data;
}

/* ──────────────────── DASHBOARD-ONLY (needs JWT) ────────────────── */

/**
 * PUT updated site settings.
 */
export async function updateSiteSetting(dto: SiteSetting): Promise<SiteSetting> {
  const { data } = await apiPrivate.put<SiteSetting>("/api/settings/site", dto);
  return data;
}

/**
 * Upload one logo file (multipart).
 * Returns the S3 URL.
 */
export async function uploadLogo(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await apiPrivate.post<{ url: string }>("/api/settings/uploadLogo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.url;
}
