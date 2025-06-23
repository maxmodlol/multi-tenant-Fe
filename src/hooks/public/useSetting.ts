import { useQuery } from "@tanstack/react-query";
import { fetchSiteSetting } from "../../services/settingService";
import { SiteSetting } from "../../types/siteSetting";
import { detectTenant } from "@/src/config/detectTenant";

export function useSiteSetting() {
  return useQuery<SiteSetting>({
    queryKey: ["siteSetting"],
    queryFn: async () => {
      const tenant = await detectTenant(); // ✅ runs only in browser
      return fetchSiteSetting(tenant);
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}