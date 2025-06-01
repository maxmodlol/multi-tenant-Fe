import axiosInstance from "@explore/config/axios";
import {
  Blog,
  BlogListResponse,
  BlogStatus,
  CreateBlogInput,
  GlobalBlogIndex,
} from "@explore/types/blogs";

export const blogService = {
  //
  // ── PUBLIC ────────────────────────────────────────────────────────────────
  //

  getAllBlogs: async (category = "all", page = 1, limit = 9): Promise<BlogListResponse> => {
    const { data } = await axiosInstance.get<BlogListResponse>("/api/blogs", {
      params: { category, page, limit },
    });
    return data;
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const { data } = await axiosInstance.get<Blog>(`/api/blogs/${id}`);
    return data;
  },

  getRelatedBlogs: async (id: string): Promise<Blog[]> => {
    const { data } = await axiosInstance.get<Blog[]>(`/api/blogs/${id}/related`);
    return data;
  },

  searchBlogs: async (q: string): Promise<GlobalBlogIndex[]> => {
    const { data } = await axiosInstance.get<GlobalBlogIndex[]>(`/api/blogs/search`, {
      params: { q },
    });
    return data;
  },

  //
  // ── DASHBOARD (AUTH) ─────────────────────────────────────────────────────
  //

  createBlog: async (input: CreateBlogInput): Promise<Blog> => {
    const { data } = await axiosInstance.post<Blog>("/api/dashboard/blogs", input);
    return data;
  },

  getDashboardBlogs: async (opts: {
    tenant?: string;
    page?: number;
    limit?: number;
    category?: string;
    statuses?: BlogStatus[];
    search?: string;
  }): Promise<BlogListResponse> => {
    const { data } = await axiosInstance.get<BlogListResponse>("/api/dashboard/blogs", {
      params: opts,
    });
    return data;
  },

  getDashboardBlogById: async (id: string): Promise<Blog> => {
    const { data } = await axiosInstance.get<Blog>(`/api/dashboard/blogs/${id}`);
    return data;
  },

  updateBlog: async (id: string, input: Partial<CreateBlogInput>): Promise<Blog> => {
    const { data } = await axiosInstance.patch<Blog>(`/api/dashboard/blogs/${id}`, input);
    return data;
  },

  updateBlogStatus: async (id: string, status: BlogStatus): Promise<Blog> => {
    const { data } = await axiosInstance.patch<Blog>(`/api/dashboard/blogs/${id}/status`, {
      status,
    });
    return data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/dashboard/blogs/${id}`);
  },
  uploadBlogImage: async (file: File): Promise<string> => {
    // Build FormData
    const form = new FormData();
    form.append("file", file);

    // POST to your new /upload-image endpoint
    const { data } = await axiosInstance.post<{ url: string }>(
      "/api/dashboard/blogs/upload-image",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.url;
  },
};
