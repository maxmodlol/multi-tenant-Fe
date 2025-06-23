// src/hooks/useUploadLogo.ts

import { useMutation } from "@tanstack/react-query";
import { uploadLogo } from "@explore/services/settingService";

/**
 * uploadLogo(file) → string (S3 URL)
 */
export function useUploadLogo() {
  return useMutation<string, Error, File>({
    mutationFn: (file) => uploadLogo(file),
  });
}
