import axiosInstance from "@explore/config/axios";
import { Blog, BlogListResponse, CreateBlogInput, GlobalBlogIndex } from "@explore/types/blogs";

export const blogService = {
  createBlog: async (data: CreateBlogInput): Promise<Blog> => {
    const response = await axiosInstance.post("api/blogs", data);
    return response.data;
  },

  getAllBlogs: async (category = "all", page = 1, limit = 9): Promise<BlogListResponse> => {
    const response = await axiosInstance.get<BlogListResponse>("/api/blogs", {
      params: { category, page, limit },
    });
    return response.data;
  },

  getGlobalIndex: async (): Promise<GlobalBlogIndex[]> => {
    const response = await axiosInstance.get("api/global-blogs");
    return response.data;
  },
  getBlogById: async (blogId: string): Promise<Blog> => {
    // You can pass the tenant if your backend route demands it
    // or rely on subdomain-based tenant logic in your backend
    const response = await axiosInstance.get<Blog>(`/api/blogs/${blogId}`);
    return response.data;
  },
  getRelatedBlogs: async (blogId: string): Promise<Blog[]> => {
    const response = await axiosInstance.get(`/api/blogs/${blogId}/related`);
    return response.data;
  },
  searchBlogs: async (query: string): Promise<GlobalBlogIndex[]> => {
    const response = await axiosInstance.get(`/api/blogs/search?q=${query}`);
    return response.data;
  },
};
