// src/services/blogService.ts
import {
  Blog,
  BlogListResponse,
  BlogStatus,
  CreateBlogInput,
  GlobalBlogIndex,
} from "@explore/types/blogs";
import { apiPublic } from "../config/axiosPublic";
import { apiPrivate } from "../config/axiosPrivate";
export const blogService = {
  // ── PUBLIC (no JWT) ────────────────────────────────────────────────
  getAllBlogs: async (category = "all", page = 1, limit = 9): Promise<BlogListResponse> => {
    const { data } = await apiPublic.get("/api/blogs", {
      params: { category, page, limit },
    });
    return data;
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const { data } = await apiPublic.get(`/api/blogs/${id}`);
    return data;
  },

  getRelatedBlogs: async (id: string): Promise<Blog[]> => {
    const { data } = await apiPublic.get(`/api/blogs/${id}/related`);
    return data;
  },

  searchBlogs: async (q: string): Promise<GlobalBlogIndex[]> => {
    const { data } = await apiPublic.get(`/api/blogs/search`, { params: { q } });
    return data;
  },

  // ── DASHBOARD (needs JWT) ─────────────────────────────────────────
  createBlog: async (input: CreateBlogInput): Promise<Blog> => {
    const { data } = await apiPrivate.post("/api/dashboard/blogs", input);
    return data;
  },

  getDashboardBlogs: async (opts: {
    tenant?: string;
    page?: number;
    limit?: number;
    category?: string;
    status?: BlogStatus;
    search?: string;
  }): Promise<BlogListResponse> => {
    const { data } = await apiPrivate.get("/api/dashboard/blogs", { params: opts });
    return data;
  },

  getDashboardBlogById: async (id: string): Promise<Blog> => {
    const { data } = await apiPrivate.get(`/api/dashboard/blogs/${id}`);
    return data;
  },

  updateBlog: async (id: string, input: Partial<CreateBlogInput>): Promise<Blog> => {
    const { data } = await apiPrivate.patch(`/api/dashboard/blogs/${id}`, input);
    return data;
  },

  updateBlogStatus: async (id: string, status: BlogStatus): Promise<Blog> => {
    const { data } = await apiPrivate.patch(`/api/dashboard/blogs/${id}/status`, { status });
    return data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await apiPrivate.delete(`/api/dashboard/blogs/${id}`);
  },

  uploadBlogImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const { data } = await apiPrivate.post<{ url: string }>(
      "/api/dashboard/blogs/upload-image",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.url;
  },
};
