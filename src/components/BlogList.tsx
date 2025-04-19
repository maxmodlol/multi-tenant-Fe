"use client";
import { useState } from "react";
import BlogCard from "./BlogCard";
import { useBlogs } from "@explore/lib/useBlogs";
import clsx from "clsx";
import { useCategories } from "@explore/lib/useCategories";
import Pagination from "./ui/Pagination";
import { Button } from "./ui/button";

export default function BlogsList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 11; // 9 regular + 2 wide at the bottom

  const { blogsQuery } = useBlogs(activeCategory, currentPage, pageSize);
  const { data: categories } = useCategories();

  const blogs = blogsQuery.data?.blogs || [];
  const totalPages = blogsQuery.data?.totalPages || 1;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-hidden pb-2 rtl:flex-row">
        <Button
          onClick={() => handleCategoryChange("all")}
          className={clsx(
            "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
            activeCategory === "all" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800",
          )}
        >
          جميع التصنيفات
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.name)}
            className={clsx(
              "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
              activeCategory === cat.name ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800",
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

      {/* Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
