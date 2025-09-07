// hooks/dashboard/mutations/useTenantAdMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantAdService } from "@/src/services/tenantAdService";
import type { CreateTenantAdInput, UpdateTenantAdInput } from "@/src/types/tenantAds";

export function useTenantAdMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (input: CreateTenantAdInput) => tenantAdService.createTenantAd(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAds"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateTenantAdInput) => tenantAdService.updateTenantAd(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAds"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantAdService.deleteTenantAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenantAds"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
