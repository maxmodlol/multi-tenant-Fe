// hooks/useAdSettings.ts

import { useQuery } from "@tanstack/react-query";
import { AdSetting } from "../../types/ads";
import { getAdSettings } from "../../services/adsService";

/**
 * Fetches all AdSettings for the given blogId.
 * Only runs if blogId is non-empty.
 */
export function useAdSettings(blogId?: string) {
  return useQuery<AdSetting[], Error>({
    queryKey: ["adSettings", blogId],
    queryFn: () => {
      if (!blogId) {
        throw new Error("blogId is required to fetch ad settings");
      }
      return getAdSettings(blogId);
    },
    enabled: Boolean(blogId),
    staleTime: 2 * 60 * 1000,
  });
}
