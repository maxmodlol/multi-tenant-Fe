import { Category } from "./category";

export interface BlogPage {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export interface BlogPageInput {
  pageNumber: number;
  content: string;
}

export enum BlogStatus {
  DRAFTED = "DRAFTED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  READY_TO_PUBLISH = "READY_TO_PUBLISH",
}

export interface Blog {
  id: string;
  title: string;
  coverPhoto?: string;
  description?: string;
  tags?: string[];
  author?: {
    id: string;
    name: string;
  }; // 👈 Add this
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
  pages: BlogPage[];
  categories: Category[];
}

export interface BlogListResponse {
  blogs: Blog[];
  totalPages: number;
  totalBlogs: number;
}
export interface GlobalBlogIndex {
  blogId: string;
  tenant: string;
  title: string;
  author?: {
    id: string;
    name: string;
  };
  coverPhoto?: string;
  tags?: string[];
  url: string; // ✅ New
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  coverPhoto?: string;
  tags?: string[];
  description?: string;
  categoryNames?: string[];
  pages: BlogPageInput[]; // <-- was BlogPage[]
  authorId: string;
  tenant: string;
}
export interface IndexBlogData {
  blogId: string;
  tenant: string;
  title: string;
  coverPhoto?: string;
  tags?: string[];
}
// @explore/types/blogCard.ts (new)
export interface BlogCardData {
  id: string;
  title: string;
  coverPhoto?: string;
  createdAt: string;
  author?: {
    name: string;
    id: string;
  };
  tags?: string[];
  pages?: BlogPage[];
  categories?: Category[];
  status?: BlogStatus;
  description?: string;
  url?: string; // ✅ New
}
