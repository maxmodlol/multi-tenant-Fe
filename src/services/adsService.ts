// adjust path if needed

import { apiPrivate } from "../config/axiosPrivate";
import { apiPublic } from "../config/axiosPublic";
import {
  AdSetting,
  AdHeaderSetting,
  CreateAdSettingInput,
  UpdateAdSettingInput,
  UpsertAdHeaderInput,
} from "../types/ads";

/* ───────────────────────── PUBLIC (no JWT) ────────────────────────── */

export async function getAdSettings(blogId: string): Promise<AdSetting[]> {
  const { data } = await apiPublic.get("/api/settings/ads", { params: { blogId } });
  return data;
}

export async function getAdHeader(): Promise<AdHeaderSetting> {
  const { data } = await apiPublic.get("/api/settings/ads/header");
  return data;
}

/* ───────────────────── DASHBOARD (needs JWT) ──────────────────────── */

export async function createAdSetting(
  dto: Omit<CreateAdSettingInput, "tenantId">,
): Promise<AdSetting> {
  const { data } = await apiPrivate.post("/api/settings/ads", dto);
  return data;
}

export async function updateAdSetting(dto: UpdateAdSettingInput): Promise<AdSetting> {
  const { id, ...updates } = dto;
  const { data } = await apiPrivate.put(`/api/settings/ads/${id}`, updates);
  return data;
}

export async function deleteAdSetting(id: string): Promise<void> {
  await apiPrivate.delete(`/api/settings/ads/${id}`);
}

export async function upsertAdHeader(dto: UpsertAdHeaderInput): Promise<AdHeaderSetting> {
  const { data } = await apiPrivate.post("/api/settings/ads/header", dto);
  return data;
}
