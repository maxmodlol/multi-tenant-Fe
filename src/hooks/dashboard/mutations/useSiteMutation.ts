import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSiteSetting } from "@explore/services/settingService";
import { SiteSetting } from "@explore/types/siteSetting";

export function useUpdateSiteSetting() {
  const qc = useQueryClient();
  return useMutation<SiteSetting, Error, SiteSetting>({
    mutationFn: (dto) => updateSiteSetting(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteSetting"] });
    },
  });
}
