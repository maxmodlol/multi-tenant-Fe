import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";

import { GlobalBlogIndex } from "@explore/types/blogs";

export function useSearchBlogs() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  return useQuery<GlobalBlogIndex[]>({
    queryKey: ["search", query],
    queryFn: () => blogService.searchBlogs(query),
    enabled: !!query,
  });
}
