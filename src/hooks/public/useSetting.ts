import { useQuery } from "@tanstack/react-query";
import { fetchSiteSetting } from "../../services/settingService";
import { SiteSetting } from "../../types/siteSetting";

export function useSiteSetting() {
  return useQuery<SiteSetting>({
    queryKey: ["siteSetting"],
    queryFn: fetchSiteSetting,
    staleTime: 60 * 1000, // cache for 1 minute
    refetchOnWindowFocus: false,
  });
}
