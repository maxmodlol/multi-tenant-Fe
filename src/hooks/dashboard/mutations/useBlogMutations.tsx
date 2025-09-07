import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@explore/services/blogService";
import { Blog, BlogStatus, CreateBlogInput } from "@explore/types/blogs";
import toast from "react-hot-toast";
export function useApproveBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, Error, string>({
    mutationFn: (id) => blogService.updateBlogStatus(id, BlogStatus.ACCEPTED),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboardBlogs"] }),
  });
}

export function useDeclineBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, Error, string>({
    mutationFn: (id) => blogService.updateBlogStatus(id, BlogStatus.DECLINED),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboardBlogs"] }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => blogService.deleteBlog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboardBlogs"] }),
  });
}

export function useBlogById(id?: string) {
  return useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => {
      if (!id) throw new Error("No ID provided");
      return blogService.getBlogById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, Error, CreateBlogInput>({
    mutationFn: (dto) => blogService.createBlog(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboardBlogs"] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, Error, { id: string; dto: CreateBlogInput }>({
    mutationFn: ({ id, dto }) => blogService.updateBlog(id, dto),
    onSuccess: (_blog, { id }) => {
      qc.invalidateQueries({ queryKey: ["dashboardBlogs", id] });
      qc.invalidateQueries({ queryKey: ["dashboardBlogs"] });
    },
  });
}

export function usePublishBlog() {
  const qc = useQueryClient();
  return useMutation<Blog, Error, { id: string; currentStatus: BlogStatus }>({
    mutationFn: ({ id, currentStatus }) => {
      const newStatus =
        currentStatus === BlogStatus.ACCEPTED
          ? BlogStatus.PENDING_REAPPROVAL
          : BlogStatus.READY_TO_PUBLISH;
      return blogService.updateBlogStatus(id, newStatus);
    },
    onSuccess: (_, { currentStatus }) => {
      toast.success(
        currentStatus === BlogStatus.ACCEPTED
          ? "تم إرسال التعديلات للمراجعة"
          : "تم إرسال المدونة للنشر",
      );
      qc.invalidateQueries({ queryKey: ["dashboardBlogs"] });
    },
    onError: (err) => {
      toast.error("فشل في تحديث حالة المدونة: " + err.message);
    },
  });
}

export function useDashboardBlogById(id?: string) {
  return useQuery<Blog, Error>({
    queryKey: ["dashboardBlog", id],
    queryFn: () => {
      if (!id) throw new Error("No blog ID provided");
      return blogService.getDashboardBlogById(id);
    },
    enabled: Boolean(id),
  });
}

// NEW: listing hook for dashboard table
export function useDashboardBlogs(opts: {
  tenant?: string;
  page?: number;
  limit?: number;
  category?: string;
  status?: BlogStatus;
  search?: string;
}) {
  return useQuery<{
    blogs: Blog[];
    totalPages: number;
    totalBlogs: number;
  }>({
    queryKey: ["dashboardBlogs", opts],
    queryFn: () => blogService.getDashboardBlogs(opts),
  });
}
