import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { Blog } from "@explore/types/blogs";

export function useRelatedBlogs(blogId: string) {
  return useQuery<Blog[]>({
    queryKey: ["related-blogs", blogId],
    queryFn: () => blogService.getRelatedBlogs(blogId),
    enabled: !!blogId,
  });
}
