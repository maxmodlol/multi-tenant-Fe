// hooks/useAdHeader.ts

import { useQuery } from "@tanstack/react-query";
import { AdHeaderSetting } from "../../types/ads";
import { getAdHeader } from "@explore/services/adsService";

/**
 * Fetches the single AdHeaderSetting (singleton).
 */
export function useAdHeader() {
  return useQuery<AdHeaderSetting, Error>({
    queryKey: ["adHeader"],
    queryFn: () => getAdHeader(),
    staleTime: 5 * 60 * 1000,
  });
}
