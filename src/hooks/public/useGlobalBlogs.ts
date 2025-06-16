// hooks/useGlobalBlogs.ts

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { GlobalBlogIndex } from "@explore/types/blogs";

/**
 * Fetches all approved blogs from the global index.
 * Assumes searchBlogs("") returns everything approved.
 */
export function useGlobalBlogs() {
  return useQuery<GlobalBlogIndex[], Error>({
    queryKey: ["globalBlogs"],
    queryFn: () => blogService.searchBlogs(""),
    staleTime: 5 * 60 * 1000,
  });
}
