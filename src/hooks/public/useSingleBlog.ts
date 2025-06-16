import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { Blog } from "@explore/types/blogs";

export function useSingleBlog(blogId: string) {
  return useQuery<Blog>({
    queryKey: ["blog", blogId],
    queryFn: () => blogService.getBlogById(blogId),
    enabled: !!blogId,
  });
}
