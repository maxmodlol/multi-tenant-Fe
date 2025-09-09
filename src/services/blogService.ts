// src/services/blogService.ts
import {
  Blog,
  BlogListResponse,
  BlogStatus,
  CreateBlogInput,
  GlobalBlogIndex,
} from "@explore/types/blogs";
import { getApiPrivate } from "../config/axiosPrivate";
import { getApiPublic } from "../config/axiosPublic";
export const blogService = {
  // ── PUBLIC (no JWT) ────────────────────────────────────────────────
  getAllBlogs: async (category = "all", page = 1, limit = 9): Promise<BlogListResponse> => {
    const apiPublic = await getApiPublic();

    console.log("BlogService.getAllBlogs - Category parameter:", category);
    console.log("BlogService.getAllBlogs - Category type:", typeof category);
    console.log("BlogService.getAllBlogs - Category length:", category.length);

    const { data } = await apiPublic.get("/blogs", {
      params: { category, page, limit },
    });
    return data;
  },

  getBlogById: async (id: string): Promise<Blog> => {
    const apiPublic = await getApiPublic();

    const { data } = await apiPublic.get(`/blogs/${id}`);
    return data;
  },

  getRelatedBlogs: async (id: string): Promise<Blog[]> => {
    const apiPublic = await getApiPublic();

    const { data } = await apiPublic.get(`/blogs/${id}/related`);
    return data;
  },

  searchBlogs: async (q: string): Promise<GlobalBlogIndex[]> => {
    const apiPublic = await getApiPublic();

    const { data } = await apiPublic.get(`/blogs/search`, { params: { q } });
    return data;
  },

  // ── DASHBOARD (needs JWT) ─────────────────────────────────────────
  createBlog: async (input: CreateBlogInput): Promise<Blog> => {
    const apiPrivate = await getApiPrivate(); // ✅

    const { data } = await apiPrivate.post("/dashboard/blogs", input);
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
    const apiPrivate = await getApiPrivate(); // ✅

    const { data } = await apiPrivate.get("/dashboard/blogs", { params: opts });
    return data;
  },

  getDashboardBlogById: async (id: string): Promise<Blog> => {
    const apiPrivate = await getApiPrivate(); // ✅

    const { data } = await apiPrivate.get(`/dashboard/blogs/${id}`);
    return data;
  },

  updateBlog: async (id: string, input: Partial<CreateBlogInput>): Promise<Blog> => {
    const apiPrivate = await getApiPrivate(); // ✅

    const { data } = await apiPrivate.patch(`/dashboard/blogs/${id}`, input);
    return data;
  },

  updateBlogStatus: async (id: string, status: BlogStatus): Promise<Blog> => {
    const apiPrivate = await getApiPrivate(); // ✅

    const { data } = await apiPrivate.patch(`/dashboard/blogs/${id}/status`, { status });
    return data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    const apiPrivate = await getApiPrivate(); // ✅

    await apiPrivate.delete(`/dashboard/blogs/${id}`);
  },

  uploadBlogImage: async (file: File): Promise<string> => {
    const apiPrivate = await getApiPrivate(); // ✅

    const form = new FormData();
    form.append("file", file);

    const { data } = await apiPrivate.post<{ url: string }>("/dashboard/blogs/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  },
};
