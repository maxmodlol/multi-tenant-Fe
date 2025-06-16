import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { BlogListResponse, BlogStatus } from "@explore/types/blogs";

// ↓ AFTER
export interface DashboardBlogsFilters {
  tenant?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: BlogStatus; // ← rename field to `status`
}

export function useDashboardBlogs({
  tenant,
  page = 1,
  limit = 9,
  search,
  category,
  status, // ← renamed
}: DashboardBlogsFilters) {
  return useQuery<BlogListResponse, Error>({
    queryKey: [
      "dashboardBlogs",
      tenant ?? "none",
      page,
      limit,
      search ?? "none",
      category ?? "none",
      status, // ← renamed
    ],
    queryFn: () =>
      blogService.getDashboardBlogs({
        tenant,
        page,
        limit,
        search,
        category,
        status, // ← renamed
      }),
  });
}
