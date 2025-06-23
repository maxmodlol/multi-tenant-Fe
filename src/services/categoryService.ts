// src/services/categoryService.ts  ← rename if you like
import { Category } from "@explore/types/category";
import { getApiPublic } from "../config/axiosPublic";
import { getApiPrivate } from "../config/axiosPrivate";

/* ───────────────────────── PUBLIC ───────────────────────── */

/** Anyone (site or dashboard) can read categories */
export const fetchCategories = async (): Promise<Category[]> => {
  const api = await getApiPublic();
  const { data } = await api.get<Category[]>("/categories");
  return data;
};

/* ─────────────────── DASHBOARD-ONLY (needs JWT) ────────────────── */

export const createCategory = async (payload: { name: string }): Promise<Category> => {
  const api = await getApiPrivate();
  const { data } = await api.post<Category>("/categories", payload);
  return data;
};

export const updateCategory = async (id: string, payload: { name: string }): Promise<Category> => {
  const api = await getApiPrivate();
  const data = await api.put<typeof payload, Category>(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const api = await getApiPrivate();
  await api.delete(`/categories/${id}`);
};
