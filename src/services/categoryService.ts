import { Category } from "@explore/types/category";
import { createHttpHelpers } from "../config/helpers";
import { apiPrivate } from "../config/axiosPrivate";
import { apiPublic } from "../config/axiosPublic";

/* build two helper sets */
const { GetApi: GetPublic } = createHttpHelpers(apiPublic);
const {
  PostApi: PostPrivate,
  PutApi: PutPrivate,
  DeleteApi: DeletePrivate,
} = createHttpHelpers(apiPrivate);

/* ───────────────────────── PUBLIC ───────────────────────── */

/** Anyone can read categories (site + dashboard) */
export const fetchCategories = async (): Promise<Category[]> =>
  GetPublic<Category[]>("/api/categories");

/* ─────────────────── DASHBOARD-ONLY (JWT) ────────────────── */

/** Create new category (dashboard) */
export const createCategory = async (data: { name: string }): Promise<Category> =>
  PostPrivate<typeof data, Category>("/api/categories", data);

/** Update category name (dashboard) */
export const updateCategory = async (id: string, data: { name: string }): Promise<Category> =>
  PutPrivate<typeof data, Category>(`/api/categories/${id}`, data);

/** Remove category (dashboard) */
export const deleteCategory = async (id: string): Promise<void> =>
  DeletePrivate<void>(`/api/categories/${id}`);
