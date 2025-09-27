// src/hooks/useUploadBlogImage.ts
import { useMutation } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";

export function useUploadBlogImage() {
  return useMutation<string, Error, File>({
    mutationFn: (file) => blogService.uploadBlogImage(file),
  });
}

export function useUploadBlogVideo() {
  return useMutation<string, Error, File>({
    mutationFn: (file) => blogService.uploadBlogVideo(file),
  });
}
