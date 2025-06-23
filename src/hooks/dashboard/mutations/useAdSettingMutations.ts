// hooks/useAdSettingMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdSetting, updateAdSetting, deleteAdSetting } from "@explore/services/adsService";
import { AdSetting, CreateAdSettingInput, UpdateAdSettingInput } from "../../../types/ads";
import { toast } from "react-hot-toast";

/**
 * Create a new AdSetting for the given blogId.
 * Invalidates the ["adSettings", blogId] cache.
 */
export function useCreateAdSetting(blogId: string) {
  const qc = useQueryClient();
  return useMutation<AdSetting, Error, Omit<CreateAdSettingInput, "blogId">>({
    mutationFn: (input) => createAdSetting({ blogId, ...input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSettings", blogId] });
      toast.success("Ad created");
    },
    onError: () => {
      toast.error("Failed to create ad");
    },
  });
}

/**
 * Update an existing AdSetting (no tenantId needed).
 * Invalidates the ["adSettings", blogId] cache.
 */
export function useUpdateAdSetting(blogId: string) {
  const qc = useQueryClient();
  return useMutation<AdSetting, Error, UpdateAdSettingInput>({
    mutationFn: (input) => updateAdSetting(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSettings", blogId] });
      toast.success("Ad updated");
    },
    onError: () => {
      toast.error("Failed to update ad");
    },
  });
}

/**
 * Delete an AdSetting by ID.
 * Invalidates the ["adSettings", blogId] cache.
 */
export function useDeleteAdSetting(blogId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteAdSetting(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adSettings", blogId] });
      toast.success("Ad deleted");
    },
    onError: () => {
      toast.error("Failed to delete ad");
    },
  });
}
