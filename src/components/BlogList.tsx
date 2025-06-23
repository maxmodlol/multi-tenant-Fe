"use client";
import { useState } from "react";
import BlogCard from "./BlogCard";
import { useBlogs } from "@/src/hooks/public/useBlogs";
import { useCategories } from "@/src/hooks/public/useCategories";
import clsx from "clsx";
import Pagination from "./ui/Pagination";
import { Button } from "./ui/button";
import { Blog } from "../types/blogs";
import { Category } from "../types/category";

interface BlogsListProps {
  initialBlogs: Blog[];
  initialTotalPages: number;
  initialCategories: Category[];
  initialCategory?: string;
}

export default function BlogsList({
  initialBlogs,
  initialTotalPages,
  initialCategories,
  initialCategory,
}: BlogsListProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 11; // 9 regular + 2 wide

  // 1) Categories query + fallback
  const categoriesQuery = useCategories({
    initialData: initialCategories,
  });
  const categories = categoriesQuery.data ?? initialCategories;

  // 2) Blogs query + fallback
  const { data: blogsResponse } = useBlogs(activeCategory, currentPage, pageSize, {
    // initialData lines up with BlogsResponse
    initialData:
      activeCategory === (initialCategory ?? "all") && currentPage === 1
        ? {
            blogs: initialBlogs,
            totalPages: initialTotalPages,
            totalBlogs: initialBlogs.length,
          }
        : undefined,
  });

  const blogs = blogsResponse?.blogs || initialBlogs;
  const totalPages = blogsResponse?.totalPages || initialTotalPages;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-hidden pb-2 rtl:flex-row">
        <Button
          variant="primary"
          onClick={() => handleCategoryChange("all")}
          className={clsx(
            "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
            activeCategory === "all" ? "bg-red-500 text-text-white" : "bg-gray-100 text-gray-800",
          )}
        >
          جميع التصنيفات
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.name)}
            className={clsx(
              "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
              activeCategory === cat.name
                ? "bg-red-500 text-text-white"
                : "bg-gray-100 text-gray-800",
            )}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Blogs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(0, 9).map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="grid" />
        ))}
      </div>

      {/* Wide Blog Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {blogs.slice(9).map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="grid" />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
