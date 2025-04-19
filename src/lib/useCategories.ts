import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@explore/services/categoryService";
import { Category } from "@explore/types/category";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry twice on failure
  });
};
