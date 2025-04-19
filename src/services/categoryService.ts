import { GetApi } from "@explore/config/axios";
import { Category } from "@explore/types/category";

export const fetchCategories = async (): Promise<Category[]> => {
  return GetApi<Category[]>("/api/categories");
};
