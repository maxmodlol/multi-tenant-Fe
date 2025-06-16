// hooks/useAdHeaderMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertAdHeader } from "@explore/services/adsService";
import { UpsertAdHeaderInput, AdHeaderSetting } from "../../../types/ads";
import { toast } from "react-hot-toast";

/**
 * Creates or updates the singleton AdHeaderSetting and invalidates the cache.
 */
export function useUpsertAdHeader() {
  const qc = useQueryClient();
  return useMutation<AdHeaderSetting, Error, UpsertAdHeaderInput>({
    mutationFn: (input) => upsertAdHeader(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adHeader"] });
      toast.success("Header snippet saved");
    },
    onError: () => {
      toast.error("Failed to save header snippet");
    },
  });
}
