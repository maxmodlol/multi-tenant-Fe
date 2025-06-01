// src/services/categoryService.ts
import { GetApi, PostApi, PutApi, DeleteApi } from "@explore/config/axios";
import { Category } from "@explore/types/category";

export const fetchCategories = async (): Promise<Category[]> =>
  GetApi<Category[]>("/api/categories");

// now only name
export const createCategory = async (data: { name: string }): Promise<Category> =>
  PostApi<typeof data, Category>("/api/categories", data);

// now only name
export const updateCategory = async (id: string, data: { name: string }): Promise<Category> =>
  PutApi<typeof data, Category>(`/api/categories/${id}`, data);

export const deleteCategory = async (id: string): Promise<void> =>
  DeleteApi<void>("/api/categories/" + id);
