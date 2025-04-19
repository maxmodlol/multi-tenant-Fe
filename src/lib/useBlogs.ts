import { useQuery } from "@tanstack/react-query";
import { Blog } from "@explore/types/blogs";
import { blogService } from "@explore/services/blogService";

export function useBlogs(category = "all", page = 1, limit = 9) {
  const blogsQuery = useQuery<{
    blogs: Blog[];
    totalPages: number;
    totalBlogs: number;
  }>({
    queryKey: ["blogs", category, page, limit],
    queryFn: () => blogService.getAllBlogs(category, page, limit),
  });
  return { blogsQuery };
}
