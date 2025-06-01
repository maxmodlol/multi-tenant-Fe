// src/lib/useCategoryMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory, deleteCategory } from "@explore/services/categoryService";
import { Category } from "@explore/types/category";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, { name: string }>({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation<Category, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) => updateCategory(id, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
