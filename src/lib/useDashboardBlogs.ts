import { useQuery } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { BlogListResponse, BlogStatus } from "@explore/types/blogs";

export interface DashboardBlogsFilters {
  tenant?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  statuses?: BlogStatus[];
}

export function useDashboardBlogs({
  tenant,
  page = 1,
  limit = 9,
  search,
  category,
  statuses = [],
}: DashboardBlogsFilters) {
  // build a stable key
  const statusKey = statuses.length ? statuses.join(",") : "all";

  return useQuery<BlogListResponse, Error>({
    queryKey: [
      "dashboardBlogs",
      tenant ?? "none",
      page,
      limit,
      search ?? "none",
      category ?? "none",
      statusKey,
    ],
    queryFn: () =>
      blogService.getDashboardBlogs({
        tenant,
        page,
        limit,
        search,
        category,
        statuses,
      }),
    // keepPreviousData: true, // Uncomment if supported by your react-query version
    placeholderData: undefined,
  });
}
