import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@explore/services/categoryService";
import { Category } from "@explore/types/category";

export function useCategories(options?: { initialData?: Category[] }) {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    ...options,
    // Retry twice on failure
  });
}
