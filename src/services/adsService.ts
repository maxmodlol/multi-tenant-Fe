// adjust path if needed

import { getApiPrivate } from "../config/axiosPrivate";
import { getApiPublic } from "../config/axiosPublic";
import {
  AdSetting,
  AdHeaderSetting,
  CreateAdSettingInput,
  UpdateAdSettingInput,
  UpsertAdHeaderInput,
} from "../types/ads";

/* ───────────────────────── PUBLIC (no JWT) ────────────────────────── */

export async function getAdSettings(blogId: string): Promise<AdSetting[]> {
  const apiPublic = await getApiPublic();

  const { data } = await apiPublic.get("/settings/ads", { params: { blogId } });
  return data;
}

export async function getAdHeader(): Promise<AdHeaderSetting> {
  const apiPublic = await getApiPublic();

  const { data } = await apiPublic.get("/settings/ads/header");
  return data;
}

/* ───────────────────── DASHBOARD (needs JWT) ──────────────────────── */

export async function createAdSetting(
  dto: Omit<CreateAdSettingInput, "tenantId">,
): Promise<AdSetting> {
  const apiPrivate = await getApiPrivate(); // ✅

  const { data } = await apiPrivate.post("/settings/ads", dto);
  return data;
}

export async function updateAdSetting(dto: UpdateAdSettingInput): Promise<AdSetting> {
  const apiPrivate = await getApiPrivate(); // ✅

  const { id, ...updates } = dto;
  const { data } = await apiPrivate.put(`/settings/ads/${id}`, updates);
  return data;
}

export async function deleteAdSetting(id: string): Promise<void> {
  const apiPrivate = await getApiPrivate(); // ✅

  await apiPrivate.delete(`/settings/ads/${id}`);
}

export async function upsertAdHeader(dto: UpsertAdHeaderInput): Promise<AdHeaderSetting> {
  const apiPrivate = await getApiPrivate(); // ✅

  const { data } = await apiPrivate.post("/settings/ads/header", dto);
  return data;
}
