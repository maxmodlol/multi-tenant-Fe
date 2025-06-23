// lib/useBlogs.ts
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { Blog } from "@explore/types/blogs";
import { blogService } from "@explore/services/blogService";

export interface BlogsResponse {
  blogs: Blog[];
  totalPages: number;
  totalBlogs: number;
}

// Omit only the things we supply ourselves (queryKey & queryFn),
// leave the rest of UseQueryOptions at their defaults (including TQueryKey = QueryKey).
type BlogsQueryOptions = Omit<
  UseQueryOptions<
    // <-- defaults to TQueryKey = QueryKey (readonly unknown[])
    BlogsResponse, // TQueryFnData
    Error, // TError
    BlogsResponse // TData
  >,
  "queryKey" | "queryFn"
>;

export function useBlogs(category = "all", page = 1, limit = 9, options?: BlogsQueryOptions) {
  // our key is still a tuple, but React-Query merely sees it as a QueryKey (unknown[])
  const queryKey = ["blogs", category, page, limit] as const;

  return useQuery<BlogsResponse, Error>({
    queryKey,
    queryFn: () => blogService.getAllBlogs(category, page, limit),
    staleTime: 1000 * 60 * 10, // still a number → OK
    retry: 2, // OK
    ...options, // initialData, onSuccess, etc now slot right in
  });
}
